import { ToolCallMessagePartComponent } from "@assistant-ui/react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export const ToolFallback: ToolCallMessagePartComponent = ({
  toolName,
  argsText,
  result,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <div className="assistant:mb-4 assistant:flex assistant:w-full assistant:flex-col assistant:gap-3 assistant:rounded-lg assistant:border assistant:py-3">
      <div className="assistant:flex assistant:items-center assistant:gap-2 assistant:px-4">
        <CheckIcon className="assistant:size-4" />
        <p className="assistant:flex-grow">
          Used tool: <b>{toolName}</b>
        </p>
        <Button onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button>
      </div>
      {!isCollapsed && (
        <div className="assistant:flex assistant:flex-col assistant:gap-2 assistant:border-t assistant:pt-2">
          <div className="assistant:px-4">
            <pre className="assistant:whitespace-pre-wrap">{argsText}</pre>
          </div>
          {result !== undefined && (
            <div className="assistant:border-t assistant:border-dashed assistant:px-4 assistant:pt-2">
              <p className="assistant:font-semibold">Result:</p>
              <pre className="assistant:whitespace-pre-wrap">
                {typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
