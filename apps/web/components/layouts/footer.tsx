"use client"

import Link from "next/link";
import { motion } from "motion/react";
import { FaGithub } from "react-icons/fa";

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
import { primaryLinks, workLinks, moreLinks } from "@/components/layouts/nav-links";
import { SocialsRow } from "@/components/contact/socials-row";
import { CopyEmailButton } from "@/components/contact/copy-email-button";
import { useRickrollAudio } from "@/providers/rickroll-audio-provider";
import { trackLinkClick, trackUiEvent } from "@/lib/analytics";

interface Props {
  siteConfig: SITE_CONFIG_QUERY_RESULT;
  legalLinks: FOOTER_LEGAL_LINKS_QUERY_RESULT;
}

const pageLinks = [
  ...primaryLinks,
  ...workLinks,
  ...moreLinks,
  { label: "Contact", href: "/contact" },
];

const SANITY_STUDIO_URL = "https://kunalkeshan.sanity.studio";
const REPO_URL = "https://github.com/kunalkeshan/v2.kunalkeshan.dev";

// Cycles through kaomoji states based on playback: paused / and two
// alternating "wiggle" frames while playing, matching the v1 easter egg.
function rickrollLabel(isPlaying: boolean, tick: number) {
  if (!isPlaying) return "~(˘▽˘)~";
  return tick % 2 ? "↜(˘▽˘)↦" : "↤(˘▽˘)↝";
}

const Footer = ({ siteConfig, legalLinks }: Props) => {
  const logoSrc = siteConfig?.logo?.asset
    ? urlFor(siteConfig.logo).width(112).height(112).url()
    : undefined;

  const rickrollUrl = siteConfig?.rickrollAudio?.asset?.url ?? null;
  const { isPlaying: isRickrollPlaying, tick, toggleRickroll } = useRickrollAudio();

  const primaryEmail = siteConfig?.emails?.find((entry) => entry.email)?.email;

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      variants={sectionReveal}
      transition={sectionRevealTransition}
      viewport={sectionRevealViewport}
      className="border-t-3 border-border py-12"
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Logo size="sm" src={logoSrc} />
              <Link href="/" className="font-heading text-sm font-bold">
                {siteConfig?.heroName ?? siteConfig?.title}
              </Link>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {siteConfig?.footerBlurb}
            </p>
            <div className="mt-6">
              <SocialsRow socialMedia={siteConfig?.socialMedia ?? null} />
            </div>
          </div>

          <div>
            <p className="font-heading text-sm font-bold">Pages</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-muted-foreground">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-heading text-sm font-bold">Utility links</p>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackLinkClick({
                      platform: "github",
                      url: REPO_URL,
                      placement: "footer",
                    })
                  }
                  className="inline-flex items-center gap-1.5 hover:text-foreground"
                >
                  <FaGithub className="size-3.5" aria-hidden="true" />
                  Open-Source Repo
                </a>
              </li>
              <li>
                <a
                  href={SANITY_STUDIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackLinkClick({
                      platform: "sanity_studio",
                      url: SANITY_STUDIO_URL,
                      placement: "footer",
                    })
                  }
                  className="hover:text-foreground"
                >
                  Sanity Studio
                </a>
              </li>
              <li>
                <Link href="/style-guide" className="hover:text-foreground">
                  Style Guide
                </Link>
              </li>
              {rickrollUrl && (
                <li suppressHydrationWarning>
                  <button
                    type="button"
                    onClick={() => {
                      toggleRickroll();
                      trackUiEvent({ name: "rickroll_toggle", placement: "footer" });
                    }}
                    aria-pressed={isRickrollPlaying}
                    aria-label="Toggle a little surprise"
                    className="hover:text-foreground"
                  >
                    {rickrollLabel(isRickrollPlaying, tick)}
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div>
            <p className="font-heading text-sm font-bold">Contact</p>
            <div className="mt-4">
              {primaryEmail && <CopyEmailButton email={primaryEmail} />}
            </div>
          </div>
        </div>

        {legalLinks && legalLinks.length > 0 && (
          <nav className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t-2 border-border pt-6 text-sm text-muted-foreground">
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

        <p className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig?.heroName ?? siteConfig?.title}
          {" · "}
          Inspired by{" "}
          <a
            href="https://paperfolio.webflow.io/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackLinkClick({
                platform: "paperfolio",
                url: "https://paperfolio.webflow.io/",
                placement: "footer",
              })
            }
            className="underline underline-offset-2 hover:text-foreground"
          >
            Paperfolio
          </a>
          {" · "}
          Open-Source on{" "}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackLinkClick({
                platform: "github",
                url: REPO_URL,
                placement: "footer",
              })
            }
            className="underline underline-offset-2 hover:text-foreground"
          >
            GitHub
          </a>
          {" · "}
          Powered by{" "}
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackLinkClick({
                platform: "nextjs",
                url: "https://nextjs.org/",
                placement: "footer",
              })
            }
            className="underline underline-offset-2 hover:text-foreground"
          >
            Next.js
          </a>
        </p>
      </Container>
    </motion.footer>
  );
};

export default Footer;
