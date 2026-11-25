/**
 * Modelo de variações com class-variance-authority.
 *
 * Cada variação usa só papéis do tema. A base traz o que não muda; as
 * variações trazem o que muda; `compoundVariants` cobre as combinações que
 * pedem ajuste; `defaultVariants` define o uso sem propriedades.
 */
import { cva, type VariantProps } from "class-variance-authority";

export const actionVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap",
    "transition-[transform,background-color,color,border-color,box-shadow] duration-(--duration-fast) ease-out-quart",
    "active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55",
    "aria-busy:cursor-progress [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-border bg-background text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "min-h-9 px-3 text-sm",
        md: "min-h-11 px-4 text-sm",
        lg: "min-h-12 px-6 text-base",
        icon: "size-11",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [{ variant: "link", size: ["sm", "md", "lg"], className: "min-h-0 px-0" }],
    defaultVariants: { variant: "primary", size: "md", fullWidth: false },
  },
);

export type ActionVariants = VariantProps<typeof actionVariants>;

// Uso:
//   <a href={href} className={cn(actionVariants({ variant: "outline", size: "lg" }), className)}>{label}</a>
