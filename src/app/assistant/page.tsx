"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquareCode, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
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
      <div className="h-[calc(100vh-120px)] flex flex-col max-w-4xl mx-auto gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
              AI Assistant
              <Sparkles className="w-6 h-6 text-secondary fill-current" />
            </h1>
            <p className="text-muted-foreground">Expert market analysis and trading advice at your fingertips.</p>
          </div>
        </div>

        <Card className="flex-1 glass-card overflow-hidden flex flex-col">
          <CardContent className="flex-1 p-0 flex flex-col h-full">
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-primary text-white' : 'bg-white/10 text-muted-foreground'}`}>
                      {m.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'assistant' ? 'bg-white/5 border border-white/5 rounded-tl-none' : 'bg-primary text-white rounded-tr-none'}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 rounded-tl-none flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">Analyzing markets...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-background/50 border-t border-white/5">
              <div className="flex gap-2">
                <Input 
                  placeholder="Ask about any crypto or trading strategy..." 
                  className="flex-1 bg-white/5 border-white/10 h-12 focus-visible:ring-primary rounded-xl"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-primary hover:bg-primary/90 text-white w-12 h-12 rounded-xl p-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <div className="mt-3 flex gap-2">
                {['Is BTC bullish?', 'Top 3 crypto signals', 'Mining profitability'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-[10px] px-3 py-1.5 rounded-full glass border border-white/5 text-muted-foreground hover:text-white hover:border-primary/30 transition-all"
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