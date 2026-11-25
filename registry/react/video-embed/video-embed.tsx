"use client";

/**
 * VideoEmbed: plays a hosted video without loading the player until the person
 * asks for it.
 *
 * The facade is a poster and one button named with the video title. On click
 * the frame becomes the player: an iframe on the privacy-enhanced YouTube
 * domain, the Vimeo player, or a native <video> for a self-hosted file. The
 * frame keeps its aspect ratio at every width and the title travels in the
 * iframe `title` attribute.
 *
 * Motion: the play button scales on hover and press; the player fades in over
 * the poster. No motion under reduced motion.
 *
 * Catalog: video-embed
 */
import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@designfy/components/lib/cn";

const ASPECT = {
  "16/9": "aspect-[16/9]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
} as const;

export interface VideoEmbedProps {
  /** Name of the video; it names the button and the player frame. */
  title: string;
  /** Host of the video. Default "youtube". */
  provider?: "youtube" | "vimeo" | "native";
  /** Video ID on YouTube or Vimeo. Required for those providers. */
  videoId?: string;
  /** Source of the file, for the native provider. */
  src?: string;
  /** Poster image shown before the click. */
  poster?: string;
  /** Describes the poster; empty when the title already says it. */
  posterAlt?: string;
  /** Aspect ratio of the frame. Default "16/9". */
  aspect?: "16/9" | "4/3" | "1/1" | "21/9";
  /** Caption under the frame. */
  caption?: string;
  /** Link to the transcript of the video. */
  transcript?: { label: string; href: string };
  className?: string;
}

/** Plays hosted video behind a facade. */
export function VideoEmbed({
  title,
  provider = "youtube",
  videoId,
  src,
  poster,
  posterAlt = "",
  aspect = "16/9",
  caption,
  transcript,
  className,
}: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const embed =
    provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${videoId ?? ""}?autoplay=1&rel=0`
      : provider === "vimeo"
        ? `https://player.vimeo.com/video/${videoId ?? ""}?autoplay=1`
        : undefined;

  return (
    <figure className={cn("flex min-w-0 flex-col", className)}>
      <div className={cn("relative overflow-hidden rounded-xl border border-border bg-muted", ASPECT[aspect])}>
        {playing ? (
          provider === "native" ? (
            <video
              src={src}
              poster={poster}
              controls
              autoPlay
              playsInline
              className="size-full animate-df-fade-in object-cover"
            />
          ) : (
            <iframe
              src={embed}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="size-full animate-df-fade-in"
            />
          )
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={title}
            className="group absolute inset-0 flex size-full items-center justify-center"
          >
            {poster ? (
              <img src={poster} alt={posterAlt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
            ) : (
              <span aria-hidden="true" className="absolute inset-0 bg-foreground/5" />
            )}
            <span className="relative flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-(--duration-base) ease-out-quart group-hover:scale-105 group-active:scale-95 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
              <Play aria-hidden="true" className="size-6 translate-x-0.5 fill-current" />
            </span>
          </button>
        )}
      </div>

      {title || caption || transcript ? (
        <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="min-w-0 text-pretty font-medium text-foreground">{title}</span>
          {caption ? <span className="min-w-0 text-pretty">{caption}</span> : null}
          {transcript ? (
            <a href={transcript.href} className="df-underline inline-flex min-h-11 items-center text-sm font-medium text-foreground sm:min-h-6">
              {transcript.label}
            </a>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
