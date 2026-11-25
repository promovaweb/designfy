/** Places a theme-driven background pattern behind React content. */
import { cn } from "@designfy/components/lib/cn";

type BackgroundPreset = import("./presets").BackgroundPreset;
type Fade = "none" | "bottom" | "edges" | "radial";

interface BackgroundProps {
  preset: BackgroundPreset;
  className?: string;
  fade?: Fade;
  children?: import("react").ReactNode;
}

/** Renders a decorative preset. Import designfy-backgrounds.css once in the project. */
export function Background({ preset, className, fade = "none", children }: BackgroundProps) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-background", className)}>
      <div aria-hidden="true" data-df-bg-fade={fade}>
        <div data-df-bg={preset} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
