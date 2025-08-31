// src/lib/ai/streamTitle.ts
import { openai } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

export async function generateTitle(messages: Array<{ role: string; content: string }>): Promise<string> {
  const result = await generateText({
    model: openai('gpt-4.1-nano'),
    prompt: `Generate a concise title for: ${messages.map(m => m.content).join(' ')}`,
    temperature: 0.7,
  });

  return result.text;
}