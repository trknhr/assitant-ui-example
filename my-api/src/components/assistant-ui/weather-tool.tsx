'use client'

import { makeAssistantToolUI, useComposerRuntime, useMessagePartRuntime } from "@assistant-ui/react";

// export const WeatherTool = makeAssistantToolUI<
//     { city: string },
//     string
// >({
//     toolName: "get_current_weather",
//     render: ({ args, result }) => {
//         return (
//             <div className="rounded-xl border p-4 shadow-sm">
//                 <div className="mb-2 flex items-center gap-2">
//                     <span className="text-xl">🌤️</span>
//                     <h3 className="text-base font-semibold">
//                         Weather in <span className="underline decoration-dashed">{args.city}</span>
//                     </h3>
//                 </div>

//                 {result == null ? (
//                     <div className="animate-pulse text-sm text-gray-600">
//                         Fetching current weather…
//                     </div>
//                 ) : (
//                     <p className="text-sm">{result}</p>
//                 )}
//             </div>
//         );
//     },
// });

export const WeatherApprovalTool = makeAssistantToolUI<
    { city: string },
    string
>({
    toolName: "get_current_weather",
    render: ({ args, result, addResult, status }) => {
        if (status.type === "requires-action") {
            return (
                <div className="rounded-xl border p-4 shadow-sm">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-xl">🌤️</span>
                        <h3 className="text-base font-semibold">
                            Weather in{' '}
                            <span className="underline decoration-dashed">{args.city}</span>
                        </h3>
                    </div>

                    <div className="text-sm text-gray-700 mb-3">
                        このツールを実行して現在の天気を取得します。実行してもよいですか？
                    </div>

                    <div className="text-xs font-mono bg-zinc-100 p-2 rounded mb-3">
                        args: {JSON.stringify(args, null, 2)}
                    </div>

                    <div className="flex gap-2">
                        <button
                            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                            onClick={async () => {
                                await addResult('Y');        // ← これで通る
                                // composer?.send()
                            }}
                        >
                            Yes（許可）
                        </button>
                        <button
                            className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                            onClick={async () => {
                                await addResult('N');        // ← これで通る
                                // composer?.send()
                            }}
                        >
                            No（拒否）
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="rounded-xl border p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                    <span className="text-xl">🌤️</span>
                    <h3 className="text-base font-semibold">
                        Weather in{' '}
                        <span className="underline decoration-dashed">{args.city}</span>
                    </h3>
                </div>
                <p className="text-sm">{result}</p>
            </div>
        );
    }
});

