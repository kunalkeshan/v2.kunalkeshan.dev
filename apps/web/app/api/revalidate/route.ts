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
        // Revalidate skills list (home page featured strip + /skills page)
        tags.push(createCollectionTag("skill"));
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
