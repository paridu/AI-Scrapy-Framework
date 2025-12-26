
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Globe, Brain, ExternalLink } from 'lucide-react';
import { startChatSession, chatWithSearch } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your AI-Scrapy assistant. I can help you with Scrapy architecture, debug your spiders, or research the web for site changes.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatSession = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatSession.current) {
      chatSession.current = startChatSession();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      let botMessage: ChatMessage;
      
      // Heuristic: If user asks for real-time info, use Search Grounding via Flash
      if (currentInput.toLowerCase().includes('search') || 
          currentInput.toLowerCase().includes('what is the current') ||
          currentInput.toLowerCase().includes('latest')) {
        const response = await chatWithSearch(currentInput);
        botMessage = { 
          role: 'model', 
          text: response.text || 'I found some information for you.',
          sources: response.sources
        };
      } else {
        // Standard high-intelligence chat via Pro
        const response = await chatSession.current.sendMessage({ message: currentInput });
        botMessage = { 
          role: 'model', 
          text: response.text || 'Sorry, I couldn\'t process that.' 
        };
      }
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Connection issue. Please re-open the chat.' }]);
      chatSession.current = null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-2xl hover:scale-110 transition-transform z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50 rounded-t-3xl">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">AI Context Engineer</h3>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <Brain className="w-3 h-3" /> Gemini 3 Pro Mode
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                <div className={`max-w-[90%] flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}>
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                  
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 w-full space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Grounding
                      </p>
                      {m.sources.map((src, idx) => (
                        <a 
                          key={idx}
                          href={src.web?.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 p-1.5 px-2 bg-slate-950 rounded-lg border border-slate-800 text-[10px] text-blue-400 hover:border-blue-500/50 transition-all"
                        >
                          <span className="truncate">{src.web?.title || src.web?.uri}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-700 flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Thinking</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-900/50 rounded-b-3xl">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Scrapy, Scrapyd, or Python..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-blue-500 hover:bg-blue-600/10 rounded-xl disabled:opacity-30 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-3 px-1">
              <p className="text-[9px] text-slate-600 font-medium">
                Vibe Coding Enabled • Multi-Agent Strategy
              </p>
              <div className="flex gap-2">
                <div className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-400 font-bold uppercase">Pro</div>
                <div className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-400 font-bold uppercase">Search</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;
