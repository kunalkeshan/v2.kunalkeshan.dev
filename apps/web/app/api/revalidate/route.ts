import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import {
  type SanityDocumentType,
  type CacheTag,
  createCollectionTag,
  createDocumentTag,
} from "@workspace/sanity/cache-tags";

// Webhook payload type
type WebhookPayload = {
  _id: string;
  _type: SanityDocumentType;
  slug?: string;
  categorySlug?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_WEBHOOK_SECRET
    );

    // Validate the webhook signature
    if (!isValidSignature) {
      const message = "Invalid signature";
      return new NextResponse(JSON.stringify({ message, isValidSignature }), {
        status: 401,
      });
    }

    if (!body?._type) {
      const message = "Bad Request: Missing _type";
      return new NextResponse(JSON.stringify({ message }), { status: 400 });
    }

    // Revalidate based on document type
    const tags: CacheTag[] = [];

    switch (body._type) {
      case "siteConfig":
        // Site config affects all pages (used in layout)
        tags.push(createCollectionTag("siteConfig"));
        break;

      case "legal":
        // Revalidate legal documents list and specific document
        tags.push(createCollectionTag("legal"));
        if (body.slug) {
          tags.push(createDocumentTag("legal", body.slug));
        }
        break;

      case "faqs":
        // Revalidate FAQs
        tags.push(createCollectionTag("faqs"));
        break;

      case "skill":
        // Revalidate skills list (home page featured strip + /skills page).
        // Projects dereference skills for their tech chips, so a rename has to
        // bust the project collection too — same reasoning as `organization`.
        tags.push(createCollectionTag("skill"));
        tags.push(createCollectionTag("project"));
        break;

      case "project":
        // Revalidate the project grid (home page section + /projects) and the
        // individual project page.
        tags.push(createCollectionTag("project"));
        if (body.slug) {
          tags.push(createDocumentTag("project", body.slug));
        }
        break;

      case "service":
        // Revalidate services list (home page strip + /services page)
        tags.push(createCollectionTag("service"));
        break;

      case "value":
        // Revalidate the core values grid on /about
        tags.push(createCollectionTag("value"));
        break;

      case "experience":
        // Revalidate the timeline (home page section + /experience page).
        // Projects cross-reference the role they were built in, so an edited
        // role title has to bust the project collection as well.
        tags.push(createCollectionTag("experience"));
        tags.push(createCollectionTag("project"));
        break;

      case "organization":
        // Organizations are only ever read through an experience, project,
        // certification-issuer, or testimonial-author reference, so a logo
        // or name edit has to bust those collections too.
        tags.push(createCollectionTag("organization"));
        tags.push(createCollectionTag("experience"));
        tags.push(createCollectionTag("project"));
        tags.push(createCollectionTag("certification"));
        tags.push(createCollectionTag("testimonial"));
        break;

      case "certification":
        // Revalidate the /certifications page.
        tags.push(createCollectionTag("certification"));
        break;

      case "person":
        // A person is only rendered through a testimonial's `author->`
        // dereference, so editing their photo, position or employer changes
        // already-cached testimonial payloads and must bust that collection.
        tags.push(createCollectionTag("person"));
        tags.push(createCollectionTag("testimonial"));
        break;

      case "testimonial":
        // Revalidate the testimonials carousel on the home page
        tags.push(createCollectionTag("testimonial"));
        break;

      case "publication":
        // Revalidate the publication callout on /experience
        tags.push(createCollectionTag("publication"));
        break;

      default:
        // Unknown type, log it but don't fail
        console.warn(`Unknown document type: ${body._type}`);
    }

    // Revalidate all relevant tags
    for (const tag of tags) {
      revalidateTag(tag, "max");
    }

    return NextResponse.json({
      success: true,
      revalidated: tags,
      now: Date.now(),
    });
  } catch (err: unknown) {
    console.error("Webhook error:", err);
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return new NextResponse(JSON.stringify({ message }), { status: 500 });
  }
}
