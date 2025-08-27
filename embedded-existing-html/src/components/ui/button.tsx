import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "assistant:inline-flex assistant:items-center assistant:justify-center assistant:gap-2 assistant:whitespace-nowrap assistant:rounded-md assistant:text-sm assistant:font-medium assistant:transition-all assistant:disabled:pointer-events-none assistant:disabled:opacity-50 assistant:[&_svg]:pointer-events-none assistant:[&_svg:not([class*=size-])]:size-4 assistant:shrink-0 assistant:[&_svg]:shrink-0 assistant:outline-none assistant:focus-visible:border-ring assistant:focus-visible:ring-ring/50 assistant:focus-visible:ring-[3px] assistant:aria-invalid:ring-destructive/20 assistant:dark:aria-invalid:ring-destructive/40 assistant:aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "assistant:bg-primary assistant:text-primary-foreground assistant:shadow-xs assistant:hover:bg-primary/90",
        destructive:
          "assistant:bg-destructive assistant:text-white assistant:shadow-xs assistant:hover:bg-destructive/90 assistant:focus-visible:ring-destructive/20 assistant:dark:focus-visible:ring-destructive/40 assistant:dark:bg-destructive/60",
        outline:
          "assistant:border assistant:bg-background assistant:shadow-xs assistant:hover:bg-accent assistant:hover:text-accent-foreground assistant:dark:bg-input/30 assistant:dark:border-input assistant:dark:hover:bg-input/50",
        secondary:
          "assistant:bg-secondary assistant:text-secondary-foreground assistant:shadow-xs assistant:hover:bg-secondary/80",
        ghost:
          "assistant:hover:bg-accent assistant:hover:text-accent-foreground assistant:dark:hover:bg-accent/50",
        link: "assistant:text-primary assistant:underline-offset-4 assistant:hover:underline",
      },
      size: {
        default: "assistant:h-9 assistant:px-4 assistant:py-2 assistant:has-[>svg]:px-3",
        sm: "assistant:h-8 assistant:rounded-md assistant:gap-1.5 assistant:px-3 assistant:has-[>svg]:px-2.5",
        lg: "assistant:h-10 assistant:rounded-md assistant:px-6 assistant:has-[>svg]:px-4",
        icon: "assistant:size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
