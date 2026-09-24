"use client"

import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Turnstile } from "@marsidev/react-turnstile"
import { toast } from "sonner"
import { CheckCircle2Icon, TriangleAlertIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form"
import { cn } from "@workspace/ui/lib/utils"
import type { SERVICES_QUERY_RESULT } from "@workspace/sanity/types"

import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact"
import { ServiceMultiSelect } from "@/components/contact/service-multi-select"
import { trackFormEvent } from "@/lib/analytics"

interface ContactFormProps {
  services: SERVICES_QUERY_RESULT
}

const DEFAULT_VALUES: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  services: [],
  otherService: "",
  subject: "",
  message: "",
  turnstileToken: undefined,
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export function ContactForm({ services }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle"
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const selectedServices = useWatch({ control: form.control, name: "services" })
  const showOtherField = selectedServices.includes("other")

  async function onSubmit(values: ContactFormValues) {
    setStatus("submitting")
    setErrorMessage(null)
    trackFormEvent({ formName: "contact_form", status: "submit" })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          services: values.services.filter((service) => service !== "other"),
        }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string
        } | null
        throw new Error(
          data?.message ??
            "Unable to send your message right now, please try again later."
        )
      }

      setStatus("success")
      toast.success("Message sent — I'll get back to you soon.")
      trackFormEvent({ formName: "contact_form", status: "success" })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to send your message right now, please try again later."
      setErrorMessage(message)
      setStatus("idle")
      toast.error(message)
      trackFormEvent({
        formName: "contact_form",
        status: "error",
        errorMessage: message,
      })
    }
  }

  if (status === "success") {
    return (
      <div className="flex w-full flex-col items-center gap-2 rounded-lg border-3 border-border bg-card p-8 text-center shadow-lg">
        <CheckCircle2Icon className="size-12 text-success" />
        <p className="font-heading text-lg font-black">Thank you</p>
        <p className="text-sm text-body-foreground">
          Your message has been sent. I&apos;ll get back to you within 24–48
          hours.
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6 rounded-lg border-3 border-border bg-card p-6 shadow-lg sm:p-8"
      >
        {errorMessage ? (
          <div className="flex items-start gap-2 rounded-md border-2 border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Jonathan Joestar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="j.joestar@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject*</FormLabel>
                <FormControl>
                  <Input placeholder="Project inquiry" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {services && services.length > 0 ? (
          <FormField
            control={form.control}
            name="services"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What are you looking for?</FormLabel>
                <FormControl>
                  <ServiceMultiSelect
                    services={services}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        {showOtherField ? (
          <FormField
            control={form.control}
            name="otherService"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tell me more</FormLabel>
                <FormControl>
                  <Input placeholder="What else are you looking for?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message*</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Got any message for me?"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {TURNSTILE_SITE_KEY ? (
          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={(token) => form.setValue("turnstileToken", token)}
            onExpire={() => form.setValue("turnstileToken", undefined)}
          />
        ) : null}

        <Button
          type="submit"
          disabled={status === "submitting"}
          className={cn("w-full sm:w-fit")}
        >
          {status === "submitting" ? "Sending..." : "Send message"}
        </Button>
      </form>
    </Form>
  )
}
