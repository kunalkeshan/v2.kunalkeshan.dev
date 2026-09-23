import { Heading, Link, Section, Text } from "react-email"

import { EmailLayout } from "../_components/email-layout"
import type { EmailTemplateWithPreview } from "../types"

export const CONTACT_NOTIFICATION_EMAIL_FILE = "contact/contact-notification"

export interface ContactNotificationEmailProps {
  name: string
  email: string
  phone?: string
  services: string[]
  otherService?: string
  subject: string
  message: string
  logoUrl?: string
  logoAlt?: string
  siteName?: string
}

export const CONTACT_NOTIFICATION_EMAIL_PREVIEW_PROPS = {
  name: "Jonathan Joestar",
  email: "j.joestar@example.com",
  phone: "+91 98765 43210",
  services: ["Software Development", "Cloud Deployment & DevOps"],
  subject: "Project inquiry",
  message:
    "Hi, I'd like to discuss building a small internal tool for my team. Do you have availability in the next few weeks?",
  // Real siteConfig.logo asset (via logoUrlFor(source, { width: 160 })), so
  // the local react-email preview shows the actual logo instead of
  // EmailHeader's plain-text wordmark fallback — the preview server has no
  // Sanity access, so this can't be fetched live the way the send route does.
  logoUrl:
    "https://cdn.sanity.io/images/eqohkmfj/production/f1948ddea239aca90e44c883450aaa44f58e3122-1433x1956.jpg?fit=max&w=160",
  logoAlt: "Kunal Keshan",
} satisfies ContactNotificationEmailProps

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Section className="mb-3">
      <Text className="m-0 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </Text>
      <Text className="m-0 text-sm text-foreground">{value}</Text>
    </Section>
  )
}

function EmailDetailRow({ email }: { email: string }) {
  return (
    <Section className="mb-3">
      <Text className="m-0 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        Email
      </Text>
      <Link
        href={`mailto:${email}`}
        className="text-sm font-medium text-primary underline"
      >
        {email}
      </Link>
    </Section>
  )
}

function ContactNotificationEmailComponent({
  name,
  email,
  phone,
  services,
  otherService,
  subject,
  message,
  logoUrl,
  logoAlt,
  siteName,
}: ContactNotificationEmailProps) {
  const servicesLabel =
    [...services, otherService].filter(Boolean).join(", ") || "Not specified"

  return (
    <EmailLayout
      preview={`New contact form submission: ${subject}`}
      logoUrl={logoUrl}
      logoAlt={logoAlt}
      siteName={siteName}
    >
      <Section className="rounded-mail border-2 border-solid border-border bg-card px-6 py-6">
        <Heading className="m-0 mb-4 text-xl font-black text-foreground">
          New contact form submission
        </Heading>

        <DetailRow label="Name" value={name} />
        <EmailDetailRow email={email} />
        {phone ? <DetailRow label="Phone" value={phone} /> : null}
        <DetailRow label="Services" value={servicesLabel} />
        <DetailRow label="Subject" value={subject} />

        <Section className="rounded-mail mt-4 bg-muted px-4 py-4">
          <Text className="m-0 text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Message
          </Text>
          <Text className="m-0 mt-2 text-sm whitespace-pre-wrap text-foreground">
            {message}
          </Text>
        </Section>
      </Section>
    </EmailLayout>
  )
}

const ContactNotificationEmail = Object.assign(
  ContactNotificationEmailComponent,
  { PreviewProps: CONTACT_NOTIFICATION_EMAIL_PREVIEW_PROPS }
) as EmailTemplateWithPreview<ContactNotificationEmailProps>

export default ContactNotificationEmail
