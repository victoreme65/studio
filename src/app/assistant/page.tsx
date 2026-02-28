"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { interactiveAiTradingAssistant } from '@/ai/flows/interactive-ai-trading-assistant-flow';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your Solar AI trading assistant. How can I help you analyze the markets today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await interactiveAiTradingAssistant({ question: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: response.analysis }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I encountered an error processing your request. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="h-[calc(100vh-100px)] flex flex-col max-w-4xl mx-auto gap-3 md:gap-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h1 className="text-xl md:text-2xl font-headline font-bold flex items-center gap-2">
              AI Assistant
              <Sparkles className="w-5 h-5 text-secondary fill-current" />
            </h1>
            <p className="text-[10px] text-muted-foreground">Expert market analysis at your fingertips.</p>
          </div>
        </div>

        <Card className="flex-1 glass-card overflow-hidden flex flex-col">
          <CardContent className="flex-1 p-0 flex flex-col h-full overflow-hidden">
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2.5 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-primary text-white' : 'bg-white/10 text-muted-foreground'}`}>
                      {m.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`p-3 rounded-xl text-xs leading-relaxed ${m.role === 'assistant' ? 'bg-white/5 border border-white/5 rounded-tl-none text-white' : 'bg-primary text-white rounded-tr-none'}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-2.5 max-w-[85%]">
                    <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                      <span className="text-[10px] text-muted-foreground">Analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-background/50 border-t border-white/5">
              <div className="flex gap-2">
                <Input 
                  placeholder="Ask about crypto..." 
                  className="flex-1 bg-white/5 border-white/10 h-10 text-xs focus-visible:ring-primary rounded-xl"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  size="icon"
                  className="bg-primary hover:bg-primary/90 text-white w-10 h-10 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-2.5 flex gap-1.5 flex-wrap">
                {['Is BTC bullish?', 'Top signals', 'Mining profit'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-[9px] px-2.5 py-1 rounded-full glass border border-white/5 text-muted-foreground hover:text-white hover:border-primary/30 transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}