import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import {
  type SanityDocumentType,
  type CacheTag,
  createCollectionTag,
  createDocumentTag,
} from "@/sanity/lib/cache-tags";
import { client } from "@/sanity/lib/client";
// import { MENU_ITEMS_BY_INGREDIENT_QUERY } from "@/sanity/queries/menu";
// import type { MENU_ITEMS_BY_INGREDIENT_QUERYResult } from "@/types/cms";

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
      // case "menuItem":
      //   // Revalidate all menu-related pages
      //   tags.push(createCollectionTag("menuItem"));
      //   // Revalidate specific menu item if slug exists
      //   if (body.slug) {
      //     tags.push(createDocumentTag("menuItem", body.slug));
      //   }
      //   // Revalidate category page if categorySlug exists
      //   if (body.categorySlug) {
      //     tags.push(createDocumentTag("menuCategory", body.categorySlug));
      //   }
      //   break;

      // case "menuCategory":
      //   // Revalidate all categories and menu pages
      //   tags.push(createCollectionTag("menuCategory"));
      //   // Revalidate specific category if slug exists
      //   if (body.slug) {
      //     tags.push(createDocumentTag("menuCategory", body.slug));
      //   }
      //   break;

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

      // case "ingredient":
      //   // Revalidate all menu items that use this ingredient
      //   tags.push(createCollectionTag("menuItem"));

      //   // Query Sanity to find which specific menu items reference this ingredient
      //   const affectedMenuItems =
      //     await client.fetch<MENU_ITEMS_BY_INGREDIENT_QUERYResult>(
      //       MENU_ITEMS_BY_INGREDIENT_QUERY,
      //       { ingredientId: body._id }
      //     );

      //   // Invalidate each affected menu item's cache
      //   affectedMenuItems.forEach((item) => {
      //     if (item.slug) {
      //       tags.push(createDocumentTag("menuItem", item.slug));
      //     }
      //   });

      //   // Future-proofing: When ingredients get their own pages, uncomment this:
      //   // if (body.slug) {
      //   //   tags.push(createDocumentTag("ingredient", body.slug));
      //   // }
      //   break;

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
