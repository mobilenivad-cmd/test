import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PlanItem } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `You are a friendly, encouraging, and expert educational consultant for Iranian students preparing for university entrance exams (Konkur). Your name is "هوشمند" (Hoshmand). All your responses must be in Persian. You provide personalized advice, create study plans, and answer questions to help students succeed. Be positive and motivational.`;

export const getAIChatResponseStream = (history: { role: 'user' | 'model'; parts: { text: string }[] }[], newMessage: string): Promise<AsyncGenerator<GenerateContentResponse>> => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-pro',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
    history,
  });
  return chat.sendMessageStream({ message: newMessage });
};

export const generateStudyPlan = async (subjects: string, hours: string): Promise<PlanItem[]> => {
  const prompt = `
    برای یک دانش‌آموز یک برنامه درسی روزانه با جزئیات کامل ایجاد کن.
    - دروس: ${subjects}
    - کل ساعت مطالعه در روز: ${hours} ساعت
    - برنامه باید شامل زمان شروع، نام درس و مدت زمان مطالعه (به دقیقه) برای هر بخش باشد.
    - بین بخش‌های مطالعه، استراحت‌های کوتاه (۱۰-۱۵ دقیقه) و یک استراحت طولانی‌تر برای ناهار در نظر بگیر.
    - خروجی باید فقط یک آرایه JSON از اشیاء باشد و هیچ متن اضافی دیگری نداشته باشد. هر شیء باید شامل کلیدهای "time" (فرمت HH:MM)، "subject" (نام درس یا 'استراحت') و "duration" (به دقیقه) باشد.
    Example format: [{ "time": "08:00", "subject": "ریاضی", "duration": 90 }, { "time": "09:30", "subject": "استراحت", "duration": 15 }]
  `;
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
        }
    });

    const jsonText = response.text.trim();
    const plan = JSON.parse(jsonText);
    return plan as PlanItem[];
  } catch (error) {
    console.error("Error generating study plan:", error);
    return [];
  }
};

export const getStudyTip = async (): Promise<string> => {
  const prompt = `یک نکته مشاوره‌ای کوتاه، کاربردی و انگیزشی برای یک دانش‌آموز کنکوری به زبان فارسی بگو. (حدود 1-2 جمله)`;
  try {
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error getting study tip:", error);
    return "همیشه به یاد داشته باش که تلاش امروز، موفقیت فردا را می‌سازد.";
  }
};
