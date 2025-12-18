
import { GoogleGenAI, Type } from "@google/genai";
import { VideoMetadata } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeVideoLink = async (url: string): Promise<VideoMetadata> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this video URL: ${url}. 
    Create highly realistic video metadata. 
    If it's TikTok, include options like "No Watermark HD". 
    If it's YouTube, include options like "4K (2160p)" and "1080p".
    Ensure each quality option has a unique 'id' string.`,
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
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                size: { type: Type.STRING },
                format: { type: Type.STRING },
                isWatermarkFree: { type: Type.BOOLEAN }
              },
              required: ['id', 'label', 'size', 'format', 'isWatermarkFree']
            }
          }
        },
        required: ['title', 'author', 'duration', 'thumbnail', 'platform', 'qualityOptions']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("فشل في تحليل الرابط.");
  
  const data = JSON.parse(text);
  if (!data.thumbnail || data.thumbnail.includes('placeholder')) {
    data.thumbnail = `https://picsum.photos/seed/${Math.random()}/800/450`;
  }
  
  return data as VideoMetadata;
};
