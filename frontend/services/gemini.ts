
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI instance with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBio = async (name: string, style: string = "modern professional") => {
  try {
    // Generate content using the recommended gemini-3-flash-preview model for text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, punchy, one-sentence AR status quote and a two-sentence creative bio for a person named ${name}. The style should be ${style}.`,
      config: {
        responseMimeType: "application/json",
        // Using responseSchema as recommended for reliable JSON structure.
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              description: 'A punchy one-sentence status quote.'
            },
            bio: {
              type: Type.STRING,
              description: 'A two-sentence creative professional bio.'
            }
          },
          required: ["status", "bio"]
        }
      }
    });
    
    // Access the generated text directly from the response property.
    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    return null;
  } catch (error) {
    console.error("Error generating bio:", error);
    return null;
  }
};