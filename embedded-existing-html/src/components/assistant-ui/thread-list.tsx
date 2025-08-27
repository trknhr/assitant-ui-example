import type { FC } from "react";
import {
  ThreadListItemPrimitive,
  ThreadListPrimitive,
} from "@assistant-ui/react";
import { ArchiveIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";

export const ThreadList: FC = () => {
  return (
    <ThreadListPrimitive.Root className="assistant:text-foreground assistant:flex assistant:flex-col assistant:items-stretch assistant:gap-1.5">
      <ThreadListNew />
      <ThreadListItems />
    </ThreadListPrimitive.Root>
  );
};

const ThreadListNew: FC = () => {
  return (
    <ThreadListPrimitive.New asChild>
      <Button className="assistant:data-active:bg-muted assistant:hover:bg-muted assistant:flex assistant:items-center assistant:justify-start assistant:gap-1 assistant:rounded-lg assistant:px-2.5 assistant:py-2 assistant:text-start" variant="ghost">
        <PlusIcon />
        New Thread
      </Button>
    </ThreadListPrimitive.New>
  );
};

const ThreadListItems: FC = () => {
  return <ThreadListPrimitive.Items components={{ ThreadListItem }} />;
};

const ThreadListItem: FC = () => {
  return (
    <ThreadListItemPrimitive.Root className="assistant:data-active:bg-muted assistant:hover:bg-muted assistant:focus-visible:bg-muted assistant:focus-visible:ring-ring assistant:flex assistant:items-center assistant:gap-2 assistant:rounded-lg assistant:transition-all assistant:focus-visible:outline-none assistant:focus-visible:ring-2">
      <ThreadListItemPrimitive.Trigger className="assistant:flex-grow assistant:px-3 assistant:py-2 assistant:text-start">
        <ThreadListItemTitle />
      </ThreadListItemPrimitive.Trigger>
      <ThreadListItemArchive />
    </ThreadListItemPrimitive.Root>
  );
};

const ThreadListItemTitle: FC = () => {
  return (
    <p className="assistant:text-sm">
      <ThreadListItemPrimitive.Title fallback="New Chat" />
    </p>
  );
};

const ThreadListItemArchive: FC = () => {
  return (
    <ThreadListItemPrimitive.Archive asChild>
      <TooltipIconButton
        className="assistant:hover:text-foreground/60 assistant:text-foreground assistant:ml-auto assistant:mr-1 assistant:size-4 assistant:p-4"
        variant="ghost"
        tooltip="Archive thread"
      >
        <ArchiveIcon />
      </TooltipIconButton>
    </ThreadListItemPrimitive.Archive>
  );
};
