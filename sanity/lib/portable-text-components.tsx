import React from "react";
import Image from "next/image";
import { type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "./image";

/**
 * Reusable PortableText components configuration for Sanity block content.
 *
 * This configuration implements heading level shifting where:
 * - h1 style → renders as <h2>
 * - h2 style → renders as <h3>
 * - h3 style → renders as <h4>
 * - h4 style → renders as <h5>
 * - h5 style → renders as <h6>
 * - h6 style → renders as bold paragraph
 *
 * This ensures that content headings don't conflict with page titles (h1).
 */
export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;

      const imageUrl = urlFor(value.asset)
        .format("webp")
        .quality(80)
        .width(1200)
        .height(800)
        .url();

      return (
        <div className="my-8">
          <Image
            src={imageUrl}
            alt={(value as { alt?: string }).alt || ""}
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />
        </div>
      );
    },
  },
  block: {
    // h1 style → renders as h2
    h1: (props) => (
      <h2 className="text-3xl font-semibold tracking-tight text-foreground mt-8 mb-4 first:mt-0">
        {props.children}
      </h2>
    ),
    // h2 style → renders as h3
    h2: (props) => (
      <h3 className="text-2xl font-semibold tracking-tight text-foreground mt-6 mb-3">
        {props.children}
      </h3>
    ),
    // h3 style → renders as h4
    h3: (props) => (
      <h4 className="text-xl font-semibold tracking-tight text-foreground mt-5 mb-2">
        {props.children}
      </h4>
    ),
    // h4 style → renders as h5
    h4: (props) => (
      <h5 className="text-lg font-semibold tracking-tight text-foreground mt-4 mb-2">
        {props.children}
      </h5>
    ),
    // h5 style → renders as h6
    h5: (props) => (
      <h6 className="text-base font-semibold tracking-tight text-foreground mt-4 mb-2">
        {props.children}
      </h6>
    ),
    // h6 style → renders as bold paragraph
    h6: (props) => (
      <p className="font-bold text-foreground mt-4 mb-2">{props.children}</p>
    ),
    // Normal paragraph
    normal: (props) => (
      <p className="text-muted-foreground leading-relaxed mb-4 text-justify">
        {props.children}
      </p>
    ),
    // Blockquote
    blockquote: (props) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4 text-justify">
        {props.children}
      </blockquote>
    ),
  },
  list: {
    bullet: (props) => (
      <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground">
        {props.children}
      </ul>
    ),
  },
  listItem: {
    bullet: (props) => (
      <li className="leading-relaxed text-justify">{props.children}</li>
    ),
  },
  marks: {
    link: (props) => {
      const href = props.value?.href || "";
      const target = href.startsWith("http") ? "_blank" : undefined;
      return (
        <a
          href={href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-primary hover:text-primary/80 underline"
        >
          {props.children}
        </a>
      );
    },
    strong: (props) => (
      <strong className="font-semibold text-foreground">
        {props.children}
      </strong>
    ),
    em: (props) => (
      <em className="italic text-muted-foreground">{props.children}</em>
    ),
  },
};
