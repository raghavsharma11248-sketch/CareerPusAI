import { GoogleGenAI } from '@google/genai';

let cachedClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!cachedClient) {
    const key = process.env.GEMINI_API_KEY || 'AIzaSy_placeholder_key_for_build';
    cachedClient = new GoogleGenAI({ apiKey: key });
  }
  return cachedClient;
}
