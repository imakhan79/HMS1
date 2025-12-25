
import { GoogleGenAI, Type } from "@google/genai";
import { Vitals } from "../types";

// Fixed: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getClinicalInsights = async (vitals: Vitals, notes: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As a clinical assistant, analyze these vitals and notes:
      Vitals: BP ${vitals.bloodPressure}, HR ${vitals.heartRate}, Temp ${vitals.temperature}, SpO2 ${vitals.oxygenSaturation}
      Notes: ${notes}
      
      Provide a brief summary and 3 potential differential diagnoses.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            differentials: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });
    // Fixed: Using the text property directly (not a method) and handling potential undefined.
    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Clinical Insights Error:", error);
    return { summary: "Unable to generate insights.", differentials: [] };
  }
};
