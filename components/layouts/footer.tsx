import {
  FOOTER_LEGAL_LINKS_QUERYResult,
  SITE_CONFIG_QUERYResult,
} from "@/types/cms";
import React from "react";

interface Props {
  siteConfig: SITE_CONFIG_QUERYResult;
  legalLinks: FOOTER_LEGAL_LINKS_QUERYResult;
}

const Footer = ({ siteConfig, legalLinks }: Props) => {
  return <div>Footer</div>;
};

export default Footer;
