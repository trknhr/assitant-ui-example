import { processDataStream } from '@ai-sdk/ui-utils';

// export async function clientStream({
//   url, body, signal,
// }: { url: string; body: unknown; signal?: AbortSignal }) {
//   const res: Response & { processDataStream: (opts?: Omit<AIStreamCallbacksAndOptions, 'stream'>) => Promise<void> }
//     = await fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type':'application/json' },
//       body: JSON.stringify(body),
//       signal,
//     }) as any;

//   if (!res.body) throw new Error('No response body');

//   res.processDataStream = async (opts = {}) =>
//     processDataStream(res.body as ReadableStream<Uint8Array>, opts);

//   return res;
// }

export async function clientStream({
  url, body, signal,
  }: { url: string; body: unknown; signal?: AbortSignal } ): Promise<
    Response & {
      processDataStream: (options?: Omit<Parameters<typeof processDataStream>[0], 'stream'>) => Promise<void>;
    }
  > {
    const response: Response & {
      processDataStream: (options?: Omit<Parameters<typeof processDataStream>[0], 'stream'>) => Promise<void>;
    } = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      signal
    }) as any;

    if (!response.body) {
      throw new Error('No response body');
    }

    response.processDataStream = async (options = {}) => {
      await processDataStream({
        stream: response.body as ReadableStream<Uint8Array>,
        ...options,
      });
    };

    return response;
  }



// export async function stream({
//   url,
//   body,
//   signal,
// }: {
//   url: string;
//   body: unknown;
//   signal?: AbortSignal;
// }) {
//   const res: Response & {
//     processDataStream: (opts?: Omit<AIStreamCallbacksAndOptions, 'stream'>) => Promise<void>;
//   } = await fetch(url, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//     signal,
//   }) as any;

//   if (!res.body) throw new Error('No response body');

//   res.processDataStream = async (opts = {}) => {
//     await readDataStream(res.body as ReadableStream<Uint8Array>, {
//       // 好きなハンドラだけ実装すればOK（全部optional）
//       onText: opts.onText,                       // 生テキストトークン
//       onMessage: opts.onMessage,                 // まとまったメッセージ
//       onToolCall: opts.onToolCall,               // ツール呼び出し
//       onToolResult: opts.onToolResult,           // ツール結果
//       onReasoning: opts.onReasoning,             // リーズニング（対応モデル時）
//       onData: opts.onData,                       // 任意のdataイベント
//       onFinish: opts.onFinish,                   // 生成完了
//       onError: opts.onError,                     // エラー
//     });
//   };

//   return res;
// }
