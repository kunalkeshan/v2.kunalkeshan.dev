import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

import { env } from "@workspace/env/server"
import { sanityFetch } from "@workspace/sanity/fetch"
import { createCollectionTag } from "@workspace/sanity/cache-tags"
import { SITE_CONFIG_QUERY } from "@workspace/sanity/query"
import type { SITE_CONFIG_QUERY_RESULT } from "@workspace/sanity/types"
import { logoUrlFor } from "@workspace/sanity/image"
import {
  renderEmailTemplateHtml,
  renderEmailTemplatePlainText,
} from "@workspace/emails/render"

import { contactFormSchema } from "@/lib/validations/contact"
import { getClientIp, verifyTurnstileToken } from "@/lib/turnstile"

let transporter: ReturnType<typeof nodemailer.createTransport> | undefined

function getTransporter() {
  transporter ??= nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.NODEMAILER_EMAIL,
      pass: env.NODEMAILER_PASSWORD,
    },
  })
  return transporter
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers)

    const json = await req.json()
    const parsed = contactFormSchema.safeParse(json)
    if (!parsed.success) {
      const message = "Invalid submission"
      return new NextResponse(
        JSON.stringify({ message, issues: parsed.error.issues }),
        { status: 400 }
      )
    }

    const {
      name,
      email,
      phone,
      services,
      otherService,
      subject,
      message: body,
      turnstileToken,
    } = parsed.data

    const isHuman = await verifyTurnstileToken(turnstileToken, ip)
    if (!isHuman) {
      const message = "Bot verification failed"
      return new NextResponse(JSON.stringify({ message }), { status: 403 })
    }

    const siteConfig = await sanityFetch<SITE_CONFIG_QUERY_RESULT>({
      query: SITE_CONFIG_QUERY,
      tags: [createCollectionTag("siteConfig")],
    })

    const notificationEmail = siteConfig?.contactNotificationEmail
    if (!notificationEmail) {
      console.error(
        "Contact form: siteConfig.contactNotificationEmail is not set"
      )
      const message = "Contact form is not configured"
      return new NextResponse(JSON.stringify({ message }), { status: 500 })
    }

    const logoUrl = siteConfig?.logo?.asset
      ? logoUrlFor(siteConfig.logo, { width: 160 })
      : undefined

    const emailProps = {
      name,
      email,
      phone: phone || undefined,
      services,
      otherService: otherService || undefined,
      subject,
      message: body,
      logoUrl,
      logoAlt: siteConfig?.logo?.alt ?? undefined,
      siteName: siteConfig?.title ?? undefined,
    } as const

    const [html, text] = await Promise.all([
      renderEmailTemplateHtml("contact/contact-notification", emailProps),
      renderEmailTemplatePlainText("contact/contact-notification", emailProps),
    ])

    await getTransporter().sendMail({
      from: env.NODEMAILER_EMAIL,
      to: notificationEmail,
      replyTo: email,
      subject: `${subject} — Portfolio contact from ${name}`,
      html,
      text,
    })

    return NextResponse.json({ message: "Message sent" })
  } catch (err: unknown) {
    console.error("Contact form error:", err)
    const message =
      err instanceof Error ? err.message : "Internal Server Error"
    return new NextResponse(JSON.stringify({ message }), { status: 500 })
  }
}
