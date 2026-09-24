"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon, MailIcon } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@workspace/ui/lib/utils"
import { trackUiEvent } from "@/lib/analytics"

interface CopyEmailButtonProps {
  email: string
}

export function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      toast.success("Email copied to clipboard")
      trackUiEvent({ name: "copy_email_click", placement: "contact_copy_email" })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Unable to copy email")
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy email address"
      title="Click to copy"
      className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border-3 border-border bg-card px-6 py-4 font-heading text-base font-bold shadow-base transition-[translate,transform,box-shadow] duration-press ease-snap hover:-translate-y-0.5 hover:shadow-lg lg:w-fit lg:justify-start"
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <MailIcon className="size-4" />
      </span>
      {email}
      <span
        className={cn(
          "ml-1 flex size-5 items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground",
          copied && "text-success"
        )}
      >
        {copied ? (
          <CheckIcon className="size-4" />
        ) : (
          <CopyIcon className="size-4" />
        )}
      </span>
    </button>
  )
}
