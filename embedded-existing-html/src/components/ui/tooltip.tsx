"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "assistant:bg-primary assistant:text-primary-foreground assistant:animate-in assistant:fade-in-0 assistant:zoom-in-95 assistant:data-[state=closed]:animate-out assistant:data-[state=closed]:fade-out-0 assistant:data-[state=closed]:zoom-out-95 assistant:data-[side=bottom]:slide-in-from-top-2 assistant:data-[side=left]:slide-in-from-right-2 assistant:data-[side=right]:slide-in-from-left-2 assistant:data-[side=top]:slide-in-from-bottom-2 assistant:z-50 assistant:w-fit assistant:origin-(--radix-tooltip-content-transform-origin) assistant:rounded-md assistant:px-3 assistant:py-1.5 assistant:text-xs assistant:text-balance",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="assistant:bg-primary assistant:fill-primary assistant:z-50 assistant:size-2.5 assistant:translate-y-[calc(-50%_-_2px)] assistant:rotate-45 assistant:rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
