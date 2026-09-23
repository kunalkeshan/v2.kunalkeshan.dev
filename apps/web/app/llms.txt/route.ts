import { sanityFetch } from "@workspace/sanity/live";
import { createCollectionTag } from "@workspace/sanity/cache-tags";
import {
  FEATURED_PROJECTS_QUERY,
  LATEST_POSTS_QUERY,
  SITE_CONFIG_QUERY,
} from "@workspace/sanity/query";

import { SITE_CONFIG } from "@/config/site";

/**
 * llms.txt — an emerging (not yet standardized) convention giving LLMs/AI
 * crawlers a curated Markdown index of the site, rather than asking them to
 * infer structure from rendered HTML. A dynamic route (not a static file) so
 * it always reflects the current siteConfig and latest content, the same way
 * sitemap.ts stays current — never a second, hand-maintained copy of what's
 * already in Sanity.
 *
 * Deliberately a curated index, not a full content dump: a short intro, the
 * key static pages, and a handful of the most recent posts/projects.
 */
export const revalidate = 0;

function absoluteUrl(path: string): string {
  return `${SITE_CONFIG.URL}${path}`;
}

export async function GET() {
  // Public route, no draft-mode concept — always published, never stega.
  const [{ data: siteConfig }, { data: latestPosts }, { data: featuredProjects }] =
    await Promise.all([
      sanityFetch({
        query: SITE_CONFIG_QUERY,
        tags: [createCollectionTag("siteConfig")],
        perspective: "published",
        stega: false,
      }),
      sanityFetch({
        query: LATEST_POSTS_QUERY,
        tags: [createCollectionTag("post")],
        perspective: "published",
        stega: false,
      }),
      sanityFetch({
        query: FEATURED_PROJECTS_QUERY,
        tags: [createCollectionTag("project")],
        perspective: "published",
        stega: false,
      }),
    ]);

  const name = siteConfig?.heroName ?? "Kunal Keshan";
  const description =
    siteConfig?.description ??
    "Portfolio of Kunal Keshan, a software engineer based in India.";

  const lines: string[] = [
    `# ${name}`,
    "",
    `> ${description}`,
    "",
    "## Pages",
    "",
    `- [About](${absoluteUrl("/about")}): Background, story, and values.`,
    `- [Projects](${absoluteUrl("/projects")}): Products, client work, and side projects.`,
    `- [Experience](${absoluteUrl("/work")}): Work history and education.`,
    `- [Blog](${absoluteUrl("/blog")}): Technical and professional writing.`,
    `- [Journal](${absoluteUrl("/journal")}): Shorter, more personal notes.`,
    `- [Services](${absoluteUrl("/services")}): What I can help you build.`,
    `- [Contact](${absoluteUrl("/contact")}): Get in touch.`,
  ];

  const projects = (featuredProjects ?? []).filter((project) => project.slug?.current);
  if (projects.length > 0) {
    lines.push("", "## Recent projects", "");
    for (const project of projects) {
      const summary = project.tagline ?? project.summary ?? "";
      lines.push(
        `- [${project.title ?? "Project"}](${absoluteUrl(`/projects/${project.slug?.current}`)})${summary ? `: ${summary}` : ""}`
      );
    }
  }

  const posts = (latestPosts ?? []).filter((post) => post.slug?.current);
  if (posts.length > 0) {
    lines.push("", "## Recent posts", "");
    for (const post of posts) {
      lines.push(
        `- [${post.title ?? "Post"}](${absoluteUrl(`/blog/${post.slug?.current}`)})`
      );
    }
  }

  return new Response(lines.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
