import {
  ThreadPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ErrorPrimitive,
} from "@assistant-ui/react";
import type { FC } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
  CopyIcon,
  CheckIcon,
  PencilIcon,
  RefreshCwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Square,
} from "lucide-react";

import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MarkdownText } from "./markdown-text";
import { ToolFallback } from "./tool-fallback";

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root
      className="assistant:bg-background assistant:flex assistant:h-full assistant:flex-col"
      style={{
        ["--thread-max-width" as string]: "48rem",
        ["--thread-padding-x" as string]: "1rem",
      }}
    >
      <ThreadPrimitive.Viewport className="assistant:relative assistant:flex assistant:min-w-0 assistant:flex-1 assistant:flex-col assistant:gap-6 assistant:overflow-y-scroll">
        <ThreadWelcome />

        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            EditComposer,
            AssistantMessage,
          }}
        />

        <ThreadPrimitive.If empty={false}>
          <motion.div className="assistant:min-h-6 assistant:min-w-6 assistant:shrink-0" />
        </ThreadPrimitive.If>
      </ThreadPrimitive.Viewport>

      <Composer />
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="assistant:dark:bg-background assistant:dark:hover:bg-accent assistant:absolute assistant:-top-12 assistant:z-10 assistant:self-center assistant:rounded-full assistant:p-4 assistant:disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="assistant:mx-auto assistant:flex assistant:w-full assistant:max-w-[var(--thread-max-width)] assistant:flex-grow assistant:flex-col assistant:px-[var(--thread-padding-x)]">
        <div className="assistant:flex assistant:w-full assistant:flex-grow assistant:flex-col assistant:items-center assistant:justify-center">
          <div className="assistant:flex assistant:size-full assistant:flex-col assistant:justify-center assistant:px-8 assistant:md:mt-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.5 }}
              className="assistant:text-2xl assistant:font-semibold"
            >
              Hello there!
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.6 }}
              className="assistant:text-muted-foreground/65 assistant:text-2xl"
            >
              How can I help you today?
            </motion.div>
          </div>
        </div>
      </div>
    </ThreadPrimitive.Empty>
  );
};

const ThreadWelcomeSuggestions: FC = () => {
  return (
    <div className="assistant:grid assistant:w-full assistant:gap-2 assistant:sm:grid-cols-2">
      {[
        {
          title: "What are the advantages",
          label: "of using Assistant Cloud?",
          action: "What are the advantages of using Assistant Cloud?",
        },
        {
          title: "Write code to",
          label: `demonstrate topological sorting`,
          action: `Write code to demonstrate topological sorting`,
        },
        {
          title: "Help me write an essay",
          label: `about AI chat applications`,
          action: `Help me write an essay about AI chat applications`,
        },
        {
          title: "What is the weather",
          label: "in San Francisco?",
          action: "What is the weather in San Francisco?",
        },
      ].map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className="assistant:[&:nth-child(n+3)]:hidden assistant:sm:[&:nth-child(n+3)]:block"
        >
          <ThreadPrimitive.Suggestion
            prompt={suggestedAction.action}
            method="replace"
            autoSend
            asChild
          >
            <Button
              variant="ghost"
              className="assistant:dark:hover:bg-accent/60 assistant:h-auto assistant:w-full assistant:flex-1 assistant:flex-wrap assistant:items-start assistant:justify-start assistant:gap-1 assistant:rounded-xl assistant:border assistant:px-4 assistant:py-3.5 assistant:text-left assistant:text-sm assistant:sm:flex-col"
              aria-label={suggestedAction.action}
            >
              <span className="assistant:font-medium">
                {suggestedAction.title}
              </span>
              <p className="assistant:text-muted-foreground">
                {suggestedAction.label}
              </p>
            </Button>
          </ThreadPrimitive.Suggestion>
        </motion.div>
      ))}
    </div>
  );
};

const Composer: FC = () => {
  return (
    <div className="assistant:bg-background assistant:relative assistant:mx-auto assistant:flex assistant:w-full assistant:max-w-[var(--thread-max-width)] assistant:flex-col assistant:gap-4 assistant:px-[var(--thread-padding-x)] assistant:pb-4 assistant:md:pb-6">
      <ThreadScrollToBottom />
      <ThreadPrimitive.Empty>
        <ThreadWelcomeSuggestions />
      </ThreadPrimitive.Empty>
      <ComposerPrimitive.Root className="assistant:relative assistant:flex assistant:w-full assistant:flex-col assistant:rounded-2xl assistant:focus-within:ring-2 assistant:focus-within:ring-black assistant:focus-within:ring-offset-2 assistant:dark:focus-within:ring-white">
        <ComposerPrimitive.Input
          placeholder="Send a message..."
          className="assistant:bg-muted assistant:border-border assistant:dark:border-muted-foreground/15 assistant:focus:outline-primary assistant:placeholder:text-muted-foreground assistant:max-h-[calc(50dvh)] assistant:min-h-16 assistant:w-full assistant:resize-none assistant:rounded-t-2xl assistant:border-x assistant:border-t assistant:px-4 assistant:pb-3 assistant:pt-2 assistant:text-base assistant:outline-none"
          rows={1}
          autoFocus
          aria-label="Message input"
        />
        <ComposerAction />
      </ComposerPrimitive.Root>
    </div>
  );
};

const ComposerAction: FC = () => {
  return (
    <div className="assistant:bg-muted assistant:border-border assistant:dark:border-muted-foreground/15 assistant:relative assistant:flex assistant:items-center assistant:justify-between assistant:rounded-b-2xl assistant:border-x assistant:border-b assistant:p-2">
      <TooltipIconButton
        tooltip="Attach file"
        variant="ghost"
        className="assistant:hover:bg-foreground/15 assistant:dark:hover:bg-background/50 assistant:scale-115 assistant:p-3.5"
        onClick={() => {
          console.log("Attachment clicked - not implemented");
        }}
      >
        <PlusIcon />
      </TooltipIconButton>

      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <Button
            type="submit"
            variant="default"
            className="assistant:dark:border-muted-foreground/90 assistant:border-muted-foreground/60 assistant:hover:bg-primary/75 assistant:size-8 assistant:rounded-full assistant:border"
            aria-label="Send message"
          >
            <ArrowUpIcon className="assistant:size-5" />
          </Button>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>

      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <Button
            type="button"
            variant="default"
            className="assistant:dark:border-muted-foreground/90 assistant:border-muted-foreground/60 assistant:hover:bg-primary/75 assistant:size-8 assistant:rounded-full assistant:border"
            aria-label="Stop generating"
          >
            <Square className="assistant:size-3.5 assistant:fill-white assistant:dark:size-4 assistant:dark:fill-black" />
          </Button>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </div>
  );
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="assistant:border-destructive assistant:bg-destructive/10 assistant:dark:bg-destructive/5 assistant:text-destructive assistant:mt-2 assistant:rounded-md assistant:border assistant:p-3 assistant:text-sm assistant:dark:text-red-200">
        <ErrorPrimitive.Message className="assistant:line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root asChild>
      <motion.div
        className="assistant:relative assistant:mx-auto assistant:grid assistant:w-full assistant:max-w-[var(--thread-max-width)] assistant:grid-cols-[auto_auto_1fr] assistant:grid-rows-[auto_1fr] assistant:px-[var(--thread-padding-x)] assistant:py-4"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role="assistant"
      >
        <div className="assistant:ring-border assistant:bg-background assistant:col-start-1 assistant:row-start-1 assistant:flex assistant:size-8 assistant:shrink-0 assistant:items-center assistant:justify-center assistant:rounded-full assistant:ring-1">
          <StarIcon size={14} />
        </div>

        <div className="assistant:text-foreground assistant:col-span-2 assistant:col-start-2 assistant:row-start-1 assistant:ml-4 assistant:break-words assistant:leading-7">
          <MessagePrimitive.Content
            components={{
              Text: MarkdownText,
              tools: { Fallback: ToolFallback },
            }}
          />
          <MessageError />
        </div>

        <AssistantActionBar />

        <BranchPicker className="assistant:col-start-2 assistant:row-start-2 assistant:-ml-2 assistant:mr-2" />
      </motion.div>
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="assistant:text-muted-foreground assistant:data-floating:bg-background assistant:data-floating:absolute assistant:data-floating:mt-2 assistant:data-floating:rounded-md assistant:data-floating:border assistant:data-floating:p-1 assistant:data-floating:shadow-sm assistant:col-start-3 assistant:row-start-2 assistant:ml-3 assistant:mt-3 assistant:flex assistant:gap-1"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root asChild>
      <motion.div
        className="assistant:mx-auto assistant:grid assistant:w-full assistant:max-w-[var(--thread-max-width)] assistant:auto-rows-auto assistant:grid-cols-[minmax(72px,1fr)_auto] assistant:gap-y-1 assistant:px-[var(--thread-padding-x)] assistant:py-4 assistant:[&:where(>*)]:col-start-2"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role="user"
      >
        <UserActionBar />

        <div className="assistant:bg-muted assistant:text-foreground assistant:col-start-2 assistant:break-words assistant:rounded-3xl assistant:px-5 assistant:py-2.5">
          <MessagePrimitive.Content components={{ Text: MarkdownText }} />
        </div>

        <BranchPicker className="assistant:col-span-full assistant:col-start-1 assistant:row-start-3 assistant:-mr-1 assistant:justify-end" />
      </motion.div>
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="assistant:col-start-1 assistant:mr-3 assistant:mt-2.5 assistant:flex assistant:flex-col assistant:items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <div className="assistant:mx-auto assistant:flex assistant:w-full assistant:max-w-[var(--thread-max-width)] assistant:flex-col assistant:gap-4 assistant:px-[var(--thread-padding-x)]">
      <ComposerPrimitive.Root className="assistant:bg-muted assistant:max-w-7/8 assistant:ml-auto assistant:flex assistant:w-full assistant:flex-col assistant:rounded-xl">
        <ComposerPrimitive.Input
          className="assistant:text-foreground assistant:flex assistant:min-h-[60px] assistant:w-full assistant:resize-none assistant:bg-transparent assistant:p-4 assistant:outline-none"
          autoFocus
        />

        <div className="assistant:mx-3 assistant:mb-3 assistant:flex assistant:items-center assistant:justify-center assistant:gap-2 assistant:self-end">
          <ComposerPrimitive.Cancel asChild>
            <Button variant="ghost" size="sm" aria-label="Cancel edit">
              Cancel
            </Button>
          </ComposerPrimitive.Cancel>
          <ComposerPrimitive.Send asChild>
            <Button size="sm" aria-label="Update message">
              Update
            </Button>
          </ComposerPrimitive.Send>
        </div>
      </ComposerPrimitive.Root>
    </div>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn("assistant:text-muted-foreground assistant:inline-flex assistant:items-center assistant:text-xs", className)}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="assistant:font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

const StarIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 0L9.79611 6.20389L16 8L9.79611 9.79611L8 16L6.20389 9.79611L0 8L6.20389 6.20389L8 0Z"
      fill="currentColor"
    />
  </svg>
);
