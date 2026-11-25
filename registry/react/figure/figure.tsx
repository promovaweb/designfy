"use client";

/**
 * Figure: an image, diagram or table with its caption and credit.
 *
 * Three widths: "measure" keeps the reading measure, "wide" bleeds into the
 * gutters from 1024 px and "full" reaches the edges of the container. The
 * wrapper fixes the aspect ratio from the intrinsic size, so nothing shifts
 * while the image loads, and the image fades in when it arrives.
 *
 * Motion: opacity of the image on load, once. Under reduced motion the image
 * appears without a fade.
 *
 * Catalog: figure
 */
import { useState } from "react";
import { cn } from "@designfy/components/lib/cn";

const WIDTH = {
  measure: "mx-auto max-w-[68ch]",
  wide: "lg:-mx-8 xl:-mx-16",
  full: "-mx-(--gutter)",
} as const;

export interface FigureProps {
  /** Image source. */
  src: string;
  /** Describes the content of the image; the caption adds context. */
  alt: string;
  /** Intrinsic width, used for the aspect ratio and the layout. */
  width: number;
  /** Intrinsic height, used for the aspect ratio and the layout. */
  height: number;
  /** Caption under the image. */
  caption?: string;
  /** Author or source of the media. */
  credit?: string;
  /** Width of the figure. Default "measure". */
  variant?: "measure" | "wide" | "full";
  /** Responsive sizes attribute for the browser. */
  sizes?: string;
  /** Loads the image eagerly, for the figures above the fold. */
  priority?: boolean;
  className?: string;
}

/** Places media with its caption and credit. */
export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  credit,
  variant = "measure",
  sizes,
  priority = false,
  className,
}: FigureProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className={cn("flex min-w-0 flex-col", WIDTH[variant], className)}>
      <div
        className="overflow-hidden rounded-xl border border-border bg-muted"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={cn(
            "size-full object-cover transition-opacity duration-(--duration-slow) ease-out-quart",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      {caption || credit ? (
        <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted-foreground">
          {caption ? <span className="min-w-0 text-pretty">{caption}</span> : null}
          {credit ? <span className="text-xs">{credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
