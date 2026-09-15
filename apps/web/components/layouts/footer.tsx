"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { Logo } from "@workspace/ui/components/logo";
import { Container } from "@workspace/ui/components/container";
import { urlFor } from "@workspace/sanity/image";
import type {
  FOOTER_LEGAL_LINKS_QUERY_RESULT,
  SITE_CONFIG_QUERY_RESULT,
} from "@workspace/sanity/types";

import {
  sectionReveal,
  sectionRevealTransition,
  sectionRevealViewport,
} from "@/lib/motion";

interface Props {
  siteConfig: SITE_CONFIG_QUERY_RESULT;
  legalLinks: FOOTER_LEGAL_LINKS_QUERY_RESULT;
}

const Footer = ({ siteConfig, legalLinks }: Props) => {
  const logoSrc = siteConfig?.logo?.asset
    ? urlFor(siteConfig.logo).width(112).height(112).url()
    : undefined;

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      variants={sectionReveal}
      transition={sectionRevealTransition}
      viewport={sectionRevealViewport}
      className="border-t-3 border-border py-10"
    >
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Logo size="sm" src={logoSrc} />
          <span className="font-heading text-sm font-bold">
            {siteConfig?.heroName ?? siteConfig?.title}
          </span>
        </div>

        {legalLinks && legalLinks.length > 0 && (
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {legalLinks.map((link) =>
              link?.slug?.current ? (
                <Link
                  key={link._id}
                  href={`/legal/${link.slug.current}`}
                  className="hover:text-foreground"
                >
                  {link.title}
                </Link>
              ) : null
            )}
          </nav>
        )}

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig?.heroName ?? siteConfig?.title}
        </p>
      </Container>
    </motion.footer>
  );
};

export default Footer;
