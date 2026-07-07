import React from "react";

import type {
  FOOTER_LEGAL_LINKS_QUERY_RESULT,
  SITE_CONFIG_QUERY_RESULT,
} from "@workspace/sanity/types";

interface Props {
  siteConfig: SITE_CONFIG_QUERY_RESULT;
  legalLinks: FOOTER_LEGAL_LINKS_QUERY_RESULT;
}

const Footer = ({ siteConfig, legalLinks }: Props) => {
  return <div>Footer</div>;
};

export default Footer;
