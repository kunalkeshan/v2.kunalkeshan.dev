"use client";

import React from "react";
import { motion } from "motion/react";

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
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      variants={sectionReveal}
      transition={sectionRevealTransition}
      viewport={sectionRevealViewport}
    >
      Footer
    </motion.footer>
  );
};

export default Footer;
