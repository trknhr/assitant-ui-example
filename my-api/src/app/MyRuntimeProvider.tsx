'use client'

import {
    AssistantRuntimeProvider,
    ChatModelAdapter,
    type RemoteThreadListAdapter,
    RuntimeAdapterProvider,
    type ThreadHistoryAdapter,
    ThreadMessage,
    useLocalThreadRuntime,
    unstable_useRemoteThreadListRuntime as useRemoteThreadListRuntime,
    useThreadListItem
} from "@assistant-ui/react";
import { AssistantChatTransport } from "@assistant-ui/react-ai-sdk";
import { readUIMessageStream } from 'ai';
import { useMemo } from "react";


const MyModelAdapter: ChatModelAdapter = {
    async *run({ messages, abortSignal, context }) {
        const transport = new AssistantChatTransport({
            api: '/api/chat'
        });
        const chunkStream = await transport.sendMessages({
            trigger: "submit-message",
            chatId: "default",
            messageId: undefined,
            messages: messages as any,
            abortSignal,
            body: {
                tools: context.tools,
            }
        });

        for await (const uiMessage of readUIMessageStream({ stream: chunkStream })) {
            for (const p of uiMessage.parts) {
                if (p.type === 'text') {
                    yield { status: {type: "running"}, content: [{ type: "text", text: p.text }] as const }
                } else if (typeof p.type === 'string' &&
                    p.type.startsWith('tool-') &&
                    'toolCallId' in p &&
                    'input' in p &&
                    'output' in p
                ) {
                    const toolNameWithoutPrefix = p.type.replace(/^tool-/, '');
                    console.log("toolNameWithoutPrefix", p.state)
                    if(p.state === "input-available") {
                        yield {
                        status: { type: "requires-action", reason: "tool-calls"},
                        content: [{
                            type: "tool-call",
                            toolCallId: p.toolCallId,
                            toolName: toolNameWithoutPrefix,
                            args: p.input as any,
                            argsText: "",
                            result: ""
                        }] as const
                        }
                    }
                    if(p.state === 'output-available') {
                        const safeArgs = p.input && typeof p.input === 'object' ? p.input : {};
                        yield {
                            status: { type: "complete", reason: "stop"},
                            content: [{
                                type: "tool-call",
                                toolCallId: p.toolCallId,
                                toolName: toolNameWithoutPrefix,
                                args: safeArgs as any ,
                                argsText: JSON.stringify(safeArgs),
                                result: p.output
                            }] as const
                        }

                    }
                }
            }
        }
    },
};

const api = {
    async json(input: RequestInfo, init?: RequestInit) {
        const r = await fetch(input, { ...init, credentials: "include" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
    },
};

const myRemoteAdapter: RemoteThreadListAdapter = {
    async list() {
        return api.json("/api/threads");
    },
    async initialize(threadId: number) {
        return api.json("/api/threads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: threadId }),
        });
    },
    async rename(remoteId: number, newTitle: string) {
        await api.json(`/api/threads/${remoteId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle }),
        });
    },
    async archive(remoteId: number) {
        await api.json(`/api/threads/${remoteId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ archived: true }),
        });
    },
    async unarchive(remoteId: number) {
        await api.json(`/api/threads/${remoteId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ archived: false }),
        });
    },
    async delete(remoteId: number) {
        await api.json(`/api/threads/${remoteId}`, { method: "DELETE" });
    },
    async generateTitle(remoteId: number, messages: ThreadMessage) {
        const res = await fetch(`/api/threads/${remoteId}/title`, {
            method: "POST",
            body: JSON.stringify({ messages }),
            headers: { "Content-Type": "application/json" },
        });
        return res.body ?? new ReadableStream();
    },
};

export function MyRuntimeProvider({ children }: { children: React.ReactNode }) {
    const runtime = useRemoteThreadListRuntime({
        runtimeHook: () => useLocalThreadRuntime(MyModelAdapter, {
            unstable_humanToolNames: ['get_current_weather']
        }),
        adapter: {
            ...myRemoteAdapter,
            unstable_Provider: ({ children }) => {
                const { remoteId } = useThreadListItem();

                const history = useMemo<ThreadHistoryAdapter>(() => ({
                    async load() {
                        if (!remoteId) return { messages: [] };
                        const data = await api.json(`/api/messages/${remoteId}`);
                        return { messages: data.messages.map((m: any) => ({ ...m, createdAt: new Date(m.createdAt) })) };
                    },
                    async append(message) {
                        if (!remoteId) {
                            console.warn("Cannot save message - thread not initialized");
                            return;
                        }
                        await fetch(`/api/messages/${remoteId}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(message),
                        });
                    },
                }), [remoteId]);

                return (
                    <RuntimeAdapterProvider adapters={{ history }}>
                        {children}
                    </RuntimeAdapterProvider>
                );
            },
        },
    });

    return <AssistantRuntimeProvider runtime={runtime}>
        {children}
    </AssistantRuntimeProvider>;
}
