// Content collections of the example blog: six Markdown posts about a fictional
// weather cooperative, with the frontmatter every page of the blog needs.
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["campo", "arquivo", "instrumentos"]),
    author: z.enum(["ana-sa", "bento-lima", "cora-vaz"]),
    publishedAt: z.coerce.date(),
    readingTime: z.number().int().positive(),
    cover: z.string(),
    variant: z.enum(["left", "centered", "behind"]).default("left"),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts };
