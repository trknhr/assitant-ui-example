"use client";

import "@assistant-ui/react-markdown/styles/dot.css";

import {
  type CodeHeaderProps,
  MarkdownTextPrimitive,
  unstable_memoizeMarkdownComponents as memoizeMarkdownComponents,
  useIsMarkdownCodeBlock,
} from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import { type FC, memo, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { cn } from "@/lib/utils";

const MarkdownTextImpl = () => {
  return (
    <MarkdownTextPrimitive
      remarkPlugins={[remarkGfm]}
      className="assistant:aui-md"
      components={defaultComponents}
    />
  );
};

export const MarkdownText = memo(MarkdownTextImpl);

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    <div className="assistant:mt-4 assistant:flex assistant:items-center assistant:justify-between assistant:gap-4 assistant:rounded-t-lg assistant:bg-zinc-900 assistant:px-4 assistant:py-2 assistant:text-sm assistant:font-semibold assistant:text-white">
      <span className="assistant:lowercase assistant:[&>span]:text-xs">{language}</span>
      <TooltipIconButton tooltip="Copy" onClick={onCopy}>
        {!isCopied && <CopyIcon />}
        {isCopied && <CheckIcon />}
      </TooltipIconButton>
    </div>
  );
};

const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};

const defaultComponents = memoizeMarkdownComponents({
  h1: ({ className, ...props }) => (
    <h1 className={cn("assistant:mb-8 assistant:scroll-m-20 assistant:text-4xl assistant:font-extrabold assistant:tracking-tight assistant:last:mb-0", className)} {...props} />
  ),
  h2: ({ className, ...props }) => (
    <h2 className={cn("assistant:mb-4 assistant:mt-8 assistant:scroll-m-20 assistant:text-3xl assistant:font-semibold assistant:tracking-tight assistant:first:mt-0 assistant:last:mb-0", className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("assistant:mb-4 assistant:mt-6 assistant:scroll-m-20 assistant:text-2xl assistant:font-semibold assistant:tracking-tight assistant:first:mt-0 assistant:last:mb-0", className)} {...props} />
  ),
  h4: ({ className, ...props }) => (
    <h4 className={cn("assistant:mb-4 assistant:mt-6 assistant:scroll-m-20 assistant:text-xl assistant:font-semibold assistant:tracking-tight assistant:first:mt-0 assistant:last:mb-0", className)} {...props} />
  ),
  h5: ({ className, ...props }) => (
    <h5 className={cn("assistant:my-4 assistant:text-lg assistant:font-semibold assistant:first:mt-0 assistant:last:mb-0", className)} {...props} />
  ),
  h6: ({ className, ...props }) => (
    <h6 className={cn("assistant:my-4 assistant:font-semibold assistant:first:mt-0 assistant:last:mb-0", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("assistant:mb-5 assistant:mt-5 assistant:leading-7 assistant:first:mt-0 assistant:last:mb-0", className)} {...props} />
  ),
  a: ({ className, ...props }) => (
    <a className={cn("assistant:text-primary assistant:font-medium assistant:underline assistant:underline-offset-4", className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote className={cn("assistant:border-l-2 assistant:pl-6 assistant:italic", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn("assistant:my-5 assistant:ml-6 assistant:list-disc assistant:[&>li]:mt-2", className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn("assistant:my-5 assistant:ml-6 assistant:list-decimal assistant:[&>li]:mt-2", className)} {...props} />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("assistant:my-5 assistant:border-b", className)} {...props} />
  ),
  table: ({ className, ...props }) => (
    <table className={cn("assistant:my-5 assistant:w-full assistant:border-separate assistant:border-spacing-0 assistant:overflow-y-auto", className)} {...props} />
  ),
  th: ({ className, ...props }) => (
    <th className={cn("assistant:bg-muted assistant:px-4 assistant:py-2 assistant:text-left assistant:font-bold assistant:first:rounded-tl-lg assistant:last:rounded-tr-lg assistant:[&[align=center]]:text-center assistant:[&[align=right]]:text-right", className)} {...props} />
  ),
  td: ({ className, ...props }) => (
    <td className={cn("assistant:border-b assistant:border-l assistant:px-4 assistant:py-2 assistant:text-left assistant:last:border-r assistant:[&[align=center]]:text-center assistant:[&[align=right]]:text-right", className)} {...props} />
  ),
  tr: ({ className, ...props }) => (
    <tr className={cn("assistant:m-0 assistant:border-b assistant:p-0 assistant:first:border-t assistant:[&:last-child>td:first-child]:rounded-bl-lg assistant:[&:last-child>td:last-child]:rounded-br-lg", className)} {...props} />
  ),
  sup: ({ className, ...props }) => (
    <sup className={cn("assistant:[&>a]:text-xs assistant:[&>a]:no-underline", className)} {...props} />
  ),
  pre: ({ className, ...props }) => (
    <pre className={cn("assistant:overflow-x-auto assistant:!rounded-t-none assistant:rounded-b-lg assistant:bg-black assistant:p-4 assistant:text-white", className)} {...props} />
  ),
  code: function Code({ className, ...props }) {
    const isCodeBlock = useIsMarkdownCodeBlock();
    return (
      <code
        className={cn(!isCodeBlock && "assistant:bg-muted assistant:rounded assistant:border assistant:font-semibold", className)}
        {...props}
      />
    );
  },
  CodeHeader,
});
