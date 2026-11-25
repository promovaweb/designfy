/**
 * Sample data of the example blog: the fictional cooperative, its categories,
 * its authors and the mapping from a collection entry to the props of the
 * Designfy content items.
 */
import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

export const site = {
  name: "Serra Clara",
  tagline: "Diário da cooperativa que mede a chuva da serra",
  description:
    "Amostra de blog construída com os componentes de conteúdo do Designfy. Cooperativa, estações e pessoas são fictícias.",
};

export interface CategoryRecord {
  slug: "campo" | "arquivo" | "instrumentos" | "metodo";
  label: string;
  description: string;
}

export const categories: CategoryRecord[] = [
  {
    slug: "campo",
    label: "Campo",
    description: "Dias de coleta, leituras na chuva e o que a serra mostra de fora.",
  },
  {
    slug: "arquivo",
    label: "Arquivo",
    description: "Cadernos antigos, planilhas e a memória escrita da cooperativa.",
  },
  {
    slug: "instrumentos",
    label: "Instrumentos",
    description: "Réguas, pluviômetros e a manutenção que mantém a série inteira.",
  },
  {
    slug: "metodo",
    label: "Método",
    description: "Como a cooperativa escolhe o que medir e o que deixar de fora. A primeira leva sai no próximo inverno.",
  },
];

export interface AuthorRecord {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  links: { label: string; href: string }[];
}

export const authors: Record<"ana-sa" | "bento-lima" | "cora-vaz", AuthorRecord> = {
  "ana-sa": {
    name: "Ana Sá",
    role: "Coordenação de campo",
    bio: "Passa metade do ano subindo a serra com uma régua na mochila. Escreve sobre leitura de chuva, escala e paciência.",
    avatar: "/avatars/ana-sa.svg",
    links: [
      { label: "Todos os textos", href: "/blog/" },
      { label: "Campo", href: "/blog/categoria/campo/" },
    ],
  },
  "bento-lima": {
    name: "Bento Lima",
    role: "Instrumentos",
    bio: "Cuida das réguas, dos pluviômetros e do caderno de manutenção. Prefere uma peça consertada a uma peça nova.",
    avatar: "/avatars/bento-lima.svg",
    links: [
      { label: "Todos os textos", href: "/blog/" },
      { label: "Instrumentos", href: "/blog/categoria/instrumentos/" },
    ],
  },
  "cora-vaz": {
    name: "Cora Vaz",
    role: "Arquivo",
    bio: "Organiza 60 anos de cadernos em uma série que qualquer pessoa consegue conferir. Desconfia de planilha sem nota de rodapé.",
    avatar: "/avatars/cora-vaz.svg",
    links: [
      { label: "Todos os textos", href: "/blog/" },
      { label: "Arquivo", href: "/blog/categoria/arquivo/" },
    ],
  },
};

export const categoryBySlug = (slug: string): CategoryRecord | undefined => categories.find((item) => item.slug === slug);

/** Filters of the blog list, with the current one marked. */
export const categoryFilters = (
  active?: string,
): { label: string; href: string; current: boolean }[] => [
  { label: "Todos", href: "/blog/", current: active === undefined },
  ...categories.map((category) => ({
    label: category.label,
    href: `/blog/categoria/${category.slug}/`,
    current: active === category.slug,
  })),
];

export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(date);

export const readingLabel = (minutes: number): string => `${minutes} min de leitura`;

/** All posts, newest first. */
export async function allPosts(): Promise<Post[]> {
  const posts = await getCollection("posts");
  return posts.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export interface CardData {
  title: string;
  href: string;
  excerpt: string;
  category: { label: string; href: string };
  author: string;
  date: { iso: string; label: string };
  readingTime: string;
  cover: { src: string; alt: string; width: number; height: number };
}

/** Props of PostCard for one entry of the collection. */
export function toCard(post: Post): CardData {
  const category = categoryBySlug(post.data.category);
  return {
    title: post.data.title,
    href: `/blog/${post.id}/`,
    excerpt: post.data.description,
    category: { label: category?.label ?? post.data.category, href: `/blog/categoria/${post.data.category}/` },
    author: authors[post.data.author].name,
    date: { iso: post.data.publishedAt.toISOString(), label: formatDate(post.data.publishedAt) },
    readingTime: readingLabel(post.data.readingTime),
    cover: {
      src: `/covers/${post.data.cover}.svg`,
      alt: "",
      width: 1200,
      height: 675,
    },
  };
}

/** Page size of the blog grid, in posts per page. */
export const PAGE_SIZE = 3;
