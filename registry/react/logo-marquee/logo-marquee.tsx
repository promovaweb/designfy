/**
 * LogoMarquee: Displays customer or partner names in a static row or a scrolling strip.
 * Motion: An optional marquee runs at a constant speed, with a pause button and a static reduced-motion layout.
 * Catalog: logo-strip
 */
import { cn } from "@designfy/components/lib/cn";
import { Marquee } from "@designfy/components/marquee/marquee";

type Logo = { name: string; src?: string; width?: number; height?: number };

export interface LogoMarqueeProps {
  /** Sentence describing who the logos represent. */
  label: string;
  /** Authorized logos, or company names as text. */
  items: Logo[];
  /** Static wrapping strip or moving row. */
  variant?: "static" | "marquee";
  /** Accessible pause button label. */
  pauseLabel?: string;
  /** Accessible resume button label. */
  resumeLabel?: string;
  /** Additional classes on the root element. */
  className?: string;
}

/** Displays customer or partner names in a static row or a scrolling strip. */
export function LogoMarquee({
  label,
  items,
  variant = "marquee",
  pauseLabel = "Pause logos",
  resumeLabel = "Resume logos",
  className,
}: LogoMarqueeProps) {
  const row = variant === "marquee";
  return (
    <section
      data-df-reveal="fade"
      className={cn("border-y border-border py-10 md:py-12", className)}
    >
      <div className="df-container grid min-w-0 grid-cols-1 gap-6">
        <p className="text-center text-sm font-medium text-muted-foreground">
          {label}
        </p>
        {row ? (
          <Marquee
            items={[]}
            pauseLabel={pauseLabel}
            resumeLabel={resumeLabel}
            className="font-heading text-xl font-semibold text-muted-foreground"
          >
            {items.map((item) => (
              <li key={item.name}>
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.name}
                    width={item.width}
                    height={item.height}
                    className="h-7 w-auto max-w-36 object-contain grayscale"
                  />
                ) : (
                  item.name
                )}
              </li>
            ))}
          </Marquee>
        ) : (
          <ul
            role="list"
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-center font-heading text-xl font-semibold text-muted-foreground"
          >
            {items.map((item) => (
              <li key={item.name}>
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.name}
                    width={item.width}
                    height={item.height}
                    className="h-7 w-auto max-w-36 object-contain grayscale"
                  />
                ) : (
                  item.name
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
