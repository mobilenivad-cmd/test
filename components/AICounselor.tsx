import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { getAIChatResponseStream } from '../services/geminiService';
import { SendIcon, BrainIcon } from './icons';

const AICounselor: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'initial', sender: 'ai', text: 'درود! من مشاور هوشمند و شخصی شما هستم. آماده‌ام تا در مورد برنامه‌ریزی درسی، رفع اشکال، مدیریت زمان و ایجاد انگیزه به شما کمک کنم. چه سوالی در ذهن دارید؟' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);
    
    const handleSend = useCallback(async () => {
        if (input.trim() === '' || isLoading) return;

        const newUserMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
        const currentInput = input;
        
        const history = [...messages, newUserMessage].map(msg => ({
            role: msg.sender === 'user' ? 'user' as const : 'model' as const,
            parts: [{ text: msg.text }]
        }));

        setInput('');
        setIsLoading(true);
        setMessages(prev => [
            ...prev, 
            newUserMessage,
            { id: (Date.now() + 1).toString(), sender: 'ai', text: '' }
        ]);

        try {
            const stream = await getAIChatResponseStream(history, currentInput);
            
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    setMessages(prev => {
                        const updatedMessages = [...prev];
                        const lastMessage = updatedMessages[updatedMessages.length - 1];
                        if (lastMessage && lastMessage.sender === 'ai') {
                            lastMessage.text += chunkText;
                        }
                        return updatedMessages;
                    });
                }
            }
        } catch (error) {
            console.error("AI Stream Error:", error);
            setMessages(prev => {
                const updatedMessages = [...prev];
                const lastMessage = updatedMessages[updatedMessages.length - 1];
                if (lastMessage && lastMessage.sender === 'ai') {
                     lastMessage.text = "متاسفانه مشکلی در ارتباط با هوش مصنوعی پیش آمده. لطفاً دوباره تلاش کنید.";
                }
                return updatedMessages;
            });
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages]);

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-md">
            <div className="p-4 border-b border-gray-200 flex items-center bg-gray-50/50">
                <BrainIcon className="w-7 h-7 text-indigo-600"/>
                <h1 className="text-xl font-bold text-gray-800 mr-3">مشاور هوشمند حرفه‌ای</h1>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {msg.sender === 'ai' && (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                                <BrainIcon className="w-6 h-6" />
                            </div>
                        )}
                        <div className={`max-w-lg p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}
                                {isLoading && index === messages.length - 1 && msg.sender === 'ai' && (
                                    <span className="inline-block w-2 h-5 bg-gray-700 animate-pulse ml-1 align-bottom"></span>
                                )}
                            </p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center bg-gray-100 rounded-xl p-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="پیام خود را بنویسید..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AICounselor;
