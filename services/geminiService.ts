
import { GoogleGenAI, Type, Chat } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * วิเคราะห์ความต้องการ (Intent Analysis) ด้วย Gemini 2.5 Flash Lite
 */
export const analyzeIntent = async (intent: string, url: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
    contents: `Analyze this web scraping intent for URL: ${url}. Intent: ${intent}. Provide a structured JSON output with fields: suggested_name (in Thai), frequency_hint (e.g., daily), fields_to_extract (array of strings in Thai/English), and difficulty_rating (1-10).`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggested_name: { type: Type.STRING },
          frequency_hint: { type: Type.STRING },
          fields_to_extract: { type: Type.ARRAY, items: { type: Type.STRING } },
          difficulty_rating: { type: Type.NUMBER }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

/**
 * สร้าง Spider Code ด้วย Gemini 3 Pro และเพิ่มฟังก์ชัน Google Drive
 */
export const generateSpider = async (intent: string, url: string, fields: string[], saveToDrive: boolean = false) => {
  const ai = getAI();
  const driveLogic = saveToDrive ? "Include a Scrapy Pipeline that exports results to a CSV and uses Google Drive API (pydrive2) to upload the file automatically after the crawl finishes." : "Standard CSV export pipeline.";
  
  const prompt = `Write a production-grade Scrapy spider for ${url}. 
  Intent: ${intent}. 
  Extract fields: ${fields.join(', ')}. 
  ${driveLogic}
  Implement robust error handling, pagination, and bot-evasion headers.
  Return ONLY clean Python code. (Comments can be in Thai if helpful).`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      systemInstruction: "คุณคือวิศวกร Scrapy ระดับโลก เชี่ยวชาญการเขียน Spider ที่ทนทานและรองรับการส่งข้อมูลไป Google Drive โดยอัตโนมัติ"
    }
  });
  
  return response.text || '# เกิดข้อผิดพลาดในการสร้างโค้ด';
};

/**
 * สร้างข้อมูลตัวอย่าง (Mock Results) จากโค้ด Spider และ Intent
 */
export const generateMockResults = async (spiderCode: string, intent: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on this Scrapy spider code and intent:
    Intent: ${intent}
    Code: ${spiderCode}
    Generate 5 realistic mock data records as they would appear in a CSV/JSON output. Return as a JSON array of objects. Make the data look very realistic according to the target site and intent.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          additionalProperties: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

/**
 * ปรับปรุง Spider ตาม Log ด้วย Gemini 3 Pro
 */
export const refactorSpider = async (currentCode: string, logs: string, intent: string) => {
  const ai = getAI();
  const prompt = `Refactor this Scrapy spider code.
  Original Intent: ${intent}
  Current Code:
  \`\`\`python
  ${currentCode}
  \`\`\`
  Logs:
  \`\`\`
  ${logs}
  \`\`\`
  แก้ไขปัญหา Selector, Bot detection หรือโครงสร้างเว็บที่เปลี่ยนไป
  Return ONLY the updated Python code.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      systemInstruction: "คุณคือเอเจนท์ซ่อมแซมโค้ดอัตโนมัติ แก้ไข Spider โดยวิเคราะห์จาก Log ความผิดพลาด"
    }
  });

  return response.text || currentCode;
};

/**
 * วิเคราะห์ Log ด้วย Gemini 3 Flash และค้นหาข้อมูลเว็บ
 */
export const analyzeLog = async (logs: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `วิเคราะห์ Log ของ Scrapy ต่อไปนี้ หากมี Error 403 หรือปัญหา Selector ให้ค้นหาวิธีแก้ไขล่าสุดบนเว็บ สรุปเป็นภาษาไทย: \n${logs}`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

/**
 * แชทช่วยเหลือด้วยภาษาไทยและ Google Search
 */
export const chatWithSearch = async (message: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "ตอบคำถามเป็นภาษาไทยอย่างสุภาพและเป็นกันเอง"
    }
  });
  
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

/**
 * เริ่มเซสชันแชทระดับสูง
 */
export const startChatSession = () => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "คุณคือ AI-Scrapy Assistant (ภาษาไทย) ช่วยเหลือผู้ใช้ในการจัดการ ScrapydWeb, เขียนโค้ด Scrapy และวิเคราะห์ข้อมูล",
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
};
