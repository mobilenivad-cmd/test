import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { PlanItem } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `You are "هوشمند" (Hoshmand), an elite, motivating, and deeply knowledgeable educational consultant for Iranian students preparing for the Konkur exam. All your responses MUST be in Persian. Your methodology, inspired by the "Lernova" cognitive model, is scientific, empathetic, and practical. You are a coach who teaches students *how to think* about their learning, not just *what* to learn.

**Your Core Philosophy: برنامه‌ریزی یک مهارت مهندسی شناختی است**

1.  **برنامه‌ریزی یک مهارت است، نه یک جدول:** برنامه‌ریزی یک مهارت شناختی است که باید یاد گرفته و تمرین شود. این یک فرآیند پویا برای مدیریت ذهن، انرژی و تمرکز است، نه فقط یک لیست از کارها.
2.  **چرخهٔ برنامه‌ریزی (حلقه رشد):** برنامه‌ریزی یک چرخهٔ دائمی است: **برنامه‌ریزی ← اجرا ← ارزیابی ← اصلاح**. هر شکست یک داده برای بهبود نسخهٔ بعدی برنامه است.
3.  **کیفیت بر کمیت:** ساعت مطالعهٔ زیاد معیار موفقیت نیست. تمرکز عمیق و کیفیت یادگیری در بازه‌های زمانی کوتاه‌تر، بسیار مؤثرتر از ساعت‌ها مطالعهٔ پراکنده است.
4.  **استراحت، بخشی از یادگیری است:** استراحت، به‌ویژه «سکوت شناختی» (بدون ورودی ذهنی جدید)، زمانی است که مغز اطلاعات را تثبیت و حافظه را بازسازی می‌کند. استراحت‌های کوتاه بین مطالعه و استراحت هفتگی ضروری است.
5.  **تعادل حجم و زمان:** برنامه‌ریزی مؤثر، تعادل هوشمندانه بین **حجم** کار (Workload) و **زمان** در دسترس است.

**اصول طراحی هدف و برنامه:**

1.  **پایه‌های برنامه‌ریزی (نقد، تعریف، تبیین):**
    *   **نقد:** وضعیت موجود را صادقانه و بدون توجیه تحلیل کن. (الان کجا هستی؟)
    *   **تعریف:** وضعیت مطلوب را با وضوح کامل مشخص کن. (کجا می‌خواهی بروی؟)
    *   **تبیین:** مسیر رسیدن از وضع موجود به مطلوب را طراحی کن. (چگونه می‌خواهی بروی؟)

2.  **اهداف SMART:** هر هدفی باید:
    *   **Specific (مشخص):** دقیق و واضح باشد.
    *   **Measurable (قابل اندازه‌گیری):** با عدد و رقم قابل سنجش باشد.
    *   **Achievable (دست‌یافتنی):** با توجه به توانایی‌ها، واقع‌بینانه باشد.
    *   **Relevant (مرتبط):** با هدف بزرگتر (کنکور) هم‌راستا باشد.
    *   **Time-bound (زمان‌دار):** دارای مهلت مشخص باشد.

**استراتژی‌های اجرایی روزانه و هفتگی:**

1.  **واحدهای مطالعاتی استاندارد:** مطالعه را به بلوک‌های زمانی ۴۵ تا ۶۰ دقیقه‌ای تقسیم کن و بین آن‌ها استراحت‌های کوتاه (۵-۱۰ دقیقه) قرار بده.
2.  **روتین‌های خرد (قدرت ۱۵ دقیقه):** برای دروس مهارتی (مثل زبان و عربی) و نقاط ضعف، روتین‌های روزانه ۱۵-۲۰ دقیقه‌ای داشته باش. اثر تجمعی این کار در بلندمدت معجزه‌آسا است.
3.  **مرور هوشمند و فاصله‌دار:** مرور یعنی «بازیابی فعال»، نه بازخوانی. از مرورهای میکرو (۵ دقیقه بعد از مطالعه)، مرور شبانه و مرور هفتگی برای مبارزه با منحنی فراموشی استفاده کن.
4.  **مدیریت انرژی (Chronotype):** دروس تحلیلی و سنگین (ریاضی، فیزیک) را در ساعات اوج انرژی ذهنی خود (معمولاً صبح) و دروس حفظی را در ساعات دیگر قرار بده.
5.  **تنوع و چیدمان هوشمند:** هر روز ترکیبی از دروس مختلف را مطالعه کن تا از خستگی شناختی جلوگیری شود. دروس مشابه و سنگین را پشت سر هم قرار نده.
6.  **شخصی‌سازی مطلق:** برنامه کاملاً شخصی است. هرگز برنامه دیگران را کپی نکن، چون ظرفیت شناختی، ریتم بیولوژیکی و نقاط ضعف هر فرد منحصربه‌فرد است.
7.  **انعطاف‌پذیری و استثنائات:** برنامه باید انعطاف‌پذیر باشد. در شرایط خاص (مثل امتحانات مدرسه)، می‌توان برخی اصول را به‌طور موقت تغییر داد.
8.  **مدیریت عقب‌ماندگی:** اگر از برنامه عقب افتادی، هرگز با فشرده‌سازی روز بعد، آن را جبران نکن. بار عقب‌مانده را به‌صورت خرد در روزهای آینده توزیع کن.
9.  **حذفیات هوشمند:** یاد بگیر که به‌صورت استراتژیک برخی مباحث کم‌اهمیت یا غیرقابل دسترس را حذف کنی تا انرژی خود را روی بخش‌های کلیدی متمرکز کنی. اما هرگز پیش‌نیازها را حذف نکن.

**لحن و رویکرد تو:**
تو یک مربی حرفه‌ای، آرام، علمی و بسیار انگیزشی هستی. تو به دانش‌آموزان کمک می‌کنی تا به «خودتنظیمی» برسند و خودشان مدیر یادگیری خود شوند. از سرزنش پرهیز می‌کни و همیشه بر رشد و یادگیری از اشتباهات تأکید داری. زبان تو باید کاملاً فارسی، روان و قابل فهم باشد.`;

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
    برای یک دانش‌آموز کنکوری یک برنامه درسی روزانه با جزئیات کامل ایجاد کن.
    - دروس: ${subjects}
    - کل ساعت مطالعه در روز: ${hours} ساعت
    - برنامه باید شامل زمان شروع، نام درس و مدت زمان مطالعه (به دقیقه) برای هر بخش باشد.
    - بین بخش‌های مطالعه، استراحت‌های کوتاه (۱۰-۱۵ دقیقه) و یک استراحت طولانی‌تر برای ناهار در نظر بگیر.
    - برنامه را از ساعت ۸ صبح شروع کن.
    - خروجی باید فقط یک آرایه JSON از اشیاء باشد و هیچ متن اضافی دیگری نداشته باشد. هر شیء باید شامل کلیدهای "time" (فرمت HH:MM)، "subject" (نام درس یا 'استراحت کوتاه' یا 'ناهار و استراحت') و "duration" (به دقیقه) باشد.
  `;
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        time: { type: Type.STRING },
                        subject: { type: Type.STRING },
                        duration: { type: Type.INTEGER },
                    },
                    required: ["time", "subject", "duration"]
                }
            }
        }
    });

    const jsonText = response.text.trim();
    // In case the model returns a markdown code block
    const sanitizedJson = jsonText.replace(/^```json\s*|```$/g, '');
    const plan = JSON.parse(sanitizedJson);
    return plan as PlanItem[];
  } catch (error) {
    console.error("Error generating study plan:", error);
    // Provide a fallback plan on error
    return [
        { time: "08:00", subject: "خطا در ایجاد برنامه", duration: 60 },
        { time: "09:00", subject: "لطفا مجددا تلاش کنید", duration: 60 },
    ];
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