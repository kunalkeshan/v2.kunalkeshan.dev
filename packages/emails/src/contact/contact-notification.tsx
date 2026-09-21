import { Body, Container, Heading, Preview, Section, Text } from "react-email";

import { EmailTailwindRoot } from "../_components/email-tailwind-root";
import { EmailHeader } from "../_components/header";
import { EmailFooter } from "../_components/footer";
import type { EmailTemplateWithPreview } from "../types";

export const CONTACT_NOTIFICATION_EMAIL_FILE = "contact/contact-notification";

export interface ContactNotificationEmailProps {
  name: string;
  email: string;
  phone?: string;
  services: string[];
  otherService?: string;
  subject: string;
  message: string;
  logoUrl?: string;
  logoAlt?: string;
  siteName?: string;
}

export const CONTACT_NOTIFICATION_EMAIL_PREVIEW_PROPS = {
  name: "Jonathan Joestar",
  email: "j.joestar@example.com",
  phone: "+91 98765 43210",
  services: ["Software Development", "Cloud Deployment & DevOps"],
  subject: "Project inquiry",
  message:
    "Hi, I'd like to discuss building a small internal tool for my team. Do you have availability in the next few weeks?",
} satisfies ContactNotificationEmailProps;

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Section className="mb-3">
      <Text className="m-0 text-xs font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </Text>
      <Text className="m-0 text-sm text-foreground">{value}</Text>
    </Section>
  );
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
    [...services, otherService].filter(Boolean).join(", ") || "Not specified";

  return (
    <EmailTailwindRoot>
      <Preview>
        New contact form submission from {name}: {subject}
      </Preview>
      <Body className="bg-background font-sans">
        <Container className="mx-auto max-w-[560px] px-4 py-8">
          <EmailHeader logoUrl={logoUrl} logoAlt={logoAlt} siteName={siteName} />

          <Section className="rounded-mail border-2 border-solid border-border bg-card px-6 py-6">
            <Heading className="m-0 mb-4 text-xl font-black text-foreground">
              New contact form submission
            </Heading>

            <DetailRow label="Name" value={name} />
            <DetailRow label="Email" value={email} />
            {phone ? <DetailRow label="Phone" value={phone} /> : null}
            <DetailRow label="Services" value={servicesLabel} />
            <DetailRow label="Subject" value={subject} />

            <Section className="mt-4 rounded-mail bg-muted px-4 py-4">
              <Text className="m-0 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                Message
              </Text>
              <Text className="m-0 mt-2 text-sm whitespace-pre-wrap text-foreground">
                {message}
              </Text>
            </Section>
          </Section>

          <EmailFooter siteName={siteName} />
        </Container>
      </Body>
    </EmailTailwindRoot>
  );
}

const ContactNotificationEmail = Object.assign(
  ContactNotificationEmailComponent,
  { PreviewProps: CONTACT_NOTIFICATION_EMAIL_PREVIEW_PROPS }
) as EmailTemplateWithPreview<ContactNotificationEmailProps>;

export default ContactNotificationEmail;
