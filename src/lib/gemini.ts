import { GoogleGenAI } from '@google/genai';

export function getGeminiClient(customKey?: string): GoogleGenAI {
  const key = customKey || process.env.GEMINI_API_KEY || 'AIzaSy_demo_fallback_key';
  return new GoogleGenAI({ apiKey: key });
}
