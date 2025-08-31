import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, tool, ModelMessage, SystemModelMessage, UserContent, UserModelMessage, AssistantModelMessage, FilePart, ToolCallPart, ImagePart, TextPart, ToolResultPart, AssistantContent, createUIMessageStreamResponse, stepCountIs, createUIMessageStream, isToolUIPart } from "ai";
import { z } from "zod";
import { CompleteAttachment, ThreadAssistantMessage, ThreadMessage, ThreadSystemMessage, ThreadUserMessage } from "@assistant-ui/react";

export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages }: { messages: any[] } = await req.json();

  const tools = {
          get_current_weather: tool({
            description: 'show the weather in a given city to the user',
            inputSchema: z.object({ city: z.string() }),
            outputSchema: z.string(),
            execute: async ({ city }) => {
              return `The weather in ${city} is sunny`;
            }
          })
        }
  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      // pull out last message
      const lastMessage = messages[messages.length - 1];

      await Promise.all(
        // map through all message parts
        lastMessage.content?.map(async content => {
          if (!isToolUIPart(content)) {
            return content;
          }
          const toolName = content.toolName;
          // return if tool isn't weather tool or in a output-available state
          if (
            toolName !== 'get_current_weather' ||
            lastMessage.status.type !== 'requires-action'
          ) {
            return content;
          }


          // switch through tool output states (set on the frontend)
          switch (content.result) {
            case 'Y': {
              const result = "sunny";
              // forward updated tool result to the client:
                writer.write({
                  type: 'tool-output-available',
                  toolCallId: content.toolCallId,
                  output: result,
                });

              // update the message part:
              return { ...content, type: 'output-available', output: result };
            }
            case 'N': {
              const result = 'Error: User denied access to weather information';

              // forward updated tool result to the client:
              writer.write({
                type: 'tool-output-available',
                toolCallId: content.toolCallId,
                output: result,
              });

              // update the message part:
              content
              return { ...content, type: 'output-available', output: result };
            }
            default:
              return content;
          }
        }) ?? [],
      );

      const result = streamText({
        model: openai('gpt-4o'),
        messages: convertThreadMessagesToModelMessages(messages as any),
        tools: {
          get_current_weather: tool({
            description: 'show the weather in a given city to the user',
            inputSchema: z.object({ city: z.string() }),
            outputSchema: z.string(),
            execute: async ({ city }) => {
              return `The weather in ${city} is sunny`;
            },
          }),
        },
        stopWhen: stepCountIs(5),
      });

      writer.merge(result.toUIMessageStream({ originalMessages: messages }));
    },
  });

  return createUIMessageStreamResponse({ stream });
}

async function executeWeatherTool({ city }: { city: string }) {
  const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy'];
  return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
}


function isTextPart(p: any): p is TextPart {
  return p?.type === "text" && typeof p.text === "string";
}
function isImagePart(p: any): p is ImagePart {
  return p?.type === "image";
}
function isFilePart(p: any): p is FilePart {
  return p?.type === "file";
}
function isReasoningPart(p: any): p is ReasoningPart {
  return p?.type === "reasoning";
}
function isToolCallPart(p: any): p is ToolCallPart {
  //   return p?.type === "tool-call" || (p as any).args != null;
  return false
}
function isToolResultPart(p: any): p is ToolResultPart {
  return p?.type === "tool-result";
}

/** user 向け FilePart に attachment を変換 */
function attachmentToFilePart(att: CompleteAttachment): FilePart {
  return {
    type: "file",
    id: (att as any).id,
    name: (att as any).name ?? (att as any).fileName ?? undefined,
    mimeType: (att as any).mimeType ?? (att as any).contentType ?? undefined,
    url:
      (att as any).url ??
      (att as any).webViewUrl ??
      (att as any).downloadUrl ??
      undefined,
    size: (att as any).size ?? undefined,
  };
}

/** すべて TextPart なら string に畳み込む。それ以外が混在なら配列で返す */
function coalesceTextOrParts<T extends { type: string }>(
  parts: readonly T[]
): string | T[] {
  if (parts.length > 0 && parts.every(isTextPart)) {
    return (parts as unknown as readonly TextPart[]).map((p) => p.text).join("");
  }
  return parts.slice();
}

function convertSystemMessage(msg: ThreadSystemMessage): SystemModelMessage {
  const only = msg.content[0];
  return {
    role: "system",
    content: only?.text ?? "",
  };
}

function convertUserMessage(msg: ThreadUserMessage): UserModelMessage {
  // 許可されるのは Text / Image / File
  const baseParts = msg.content.filter(
    (p): any =>
      isTextPart(p) || isImagePart(p) || isFilePart(p)
  );

  // attachments -> FilePart へ
  const filePartsFromAttachments = (msg.attachments ?? []).map(
    attachmentToFilePart
  );

  const merged = [...baseParts, ...filePartsFromAttachments];

  const content: UserContent =
    merged.length === 0 ? "" : (coalesceTextOrParts(merged) as UserContent);

  return {
    role: "user",
    content,
  };
}

function convertAssistantMessage(
  msg: ThreadAssistantMessage
): AssistantModelMessage {
  const parts = msg.content.filter(
    (p): p is TextPart | FilePart | ReasoningPart | ToolCallPart | ToolResultPart =>
      isTextPart(p) ||
      isFilePart(p) ||
      isReasoningPart(p) ||
      isToolCallPart(p) ||
      isToolResultPart(p)
  );

  const content: AssistantContent =
    parts.length === 0
      ? ""
      : (coalesceTextOrParts(parts) as AssistantContent);

  return {
    role: "assistant",
    content,
  };
}

export function convertThreadMessageToModelMessage(
  msg: ThreadMessage
): ModelMessage {
  switch (msg.role) {
    case "system":
      return convertSystemMessage(msg);
    case "user":
      return convertUserMessage(msg);
    case "assistant":
      return convertAssistantMessage(msg);
    default: {
      // 将来ロール追加などの保険
      const _exhaustive: never = msg as never;
      return _exhaustive;
    }
  }
}

export function convertThreadMessagesToModelMessages(
  messages: readonly ThreadMessage[]
): ModelMessage[] {
  return messages.map(convertThreadMessageToModelMessage);
}
