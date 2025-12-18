
import { GoogleGenAI, Type } from "@google/genai";
import { VideoMetadata } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeVideoLink = async (url: string): Promise<VideoMetadata> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this video URL and return structured metadata for a video downloader tool. 
    The URL is: ${url}. 
    Return realistic but simulated data since this is a UI demonstration. 
    Ensure quality options include HD, Full HD, and No Watermark versions where applicable.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          author: { type: Type.STRING },
          duration: { type: Type.STRING },
          thumbnail: { type: Type.STRING },
          platform: { type: Type.STRING, enum: ['youtube', 'tiktok', 'unknown'] },
          qualityOptions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                size: { type: Type.STRING },
                format: { type: Type.STRING },
                isWatermarkFree: { type: Type.BOOLEAN }
              },
              required: ['label', 'size', 'format', 'isWatermarkFree']
            }
          }
        },
        required: ['title', 'author', 'duration', 'thumbnail', 'platform', 'qualityOptions']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("فشل في تحليل الرابط. يرجى المحاولة مرة أخرى.");
  
  const data = JSON.parse(text);
  // Enhance simulated thumbnail if none provided
  if (!data.thumbnail || data.thumbnail.includes('placeholder')) {
    data.thumbnail = `https://picsum.photos/seed/${Math.random()}/800/450`;
  }
  
  return data as VideoMetadata;
};
