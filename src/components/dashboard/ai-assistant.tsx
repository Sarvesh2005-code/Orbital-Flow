'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BotMessageSquare, ArrowUp, User, Sparkles, Lightbulb, RefreshCw } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { answerProductivityQueries } from '@/ai/flows/answer-queries';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const suggestedPrompts = [
  "What should I focus on today?",
  "Summarize my week",
  "Suggest task priorities",
  "Help me plan my goals",
  "Review my productivity"
];

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "👋 Hello! I'm your AI productivity assistant. I can help you prioritize tasks, summarize your progress, suggest improvements, and answer productivity-related questions. Try asking me something!" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent | string) => {
    if (typeof e !== 'string') {
      e.preventDefault();
    }
    
    const query = typeof e === 'string' ? e : input;
    if (!query || !user) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      const response = await answerProductivityQueries({ query, userId: user.uid });
      const assistantMessage: Message = { role: 'assistant', content: response.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Assistant error:', error);
      const errorMessage: Message = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while processing your request. Please try again or rephrase your question.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        title: 'AI Error',
        description: 'The AI assistant encountered an error. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    handleSubmit(suggestion);
  };

  const clearConversation = () => {
    setMessages([
      { 
        role: 'assistant', 
        content: "👋 Hello! I'm your AI productivity assistant. How can I help you today?" 
      }
    ]);
    setShowSuggestions(true);
    setInput('');
  };

  return (
    <div>
      <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <CardTitle className="font-headline text-xl md:text-2xl">AI Assistant</CardTitle>
              <Badge variant="secondary" className="text-xs">Beta</Badge>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearConversation}
              className="h-8"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[400px] border rounded-lg bg-gradient-to-b from-background to-muted/20">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        message.role === 'user' ? 'justify-end' : ''
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8 border bg-purple-100 dark:bg-purple-900">
                          <AvatarFallback className="bg-purple-500 text-white">
                            <Sparkles className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`p-3 rounded-lg max-w-[80%] ${
                        message.role === 'assistant'
                          ? 'bg-muted/80 rounded-tl-none shadow-sm'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-tr-none shadow-md'
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 border">
                          <AvatarImage src={user?.photoURL || ''} alt="User" />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 border bg-purple-100 dark:bg-purple-900">
                        <AvatarFallback className="bg-purple-500 text-white">
                          <Sparkles className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted/80 p-3 rounded-lg rounded-tl-none shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Suggestion Pills */}
                  {showSuggestions && messages.length === 1 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {suggestedPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(prompt)}
                          className="px-3 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/50 dark:hover:bg-purple-900 rounded-full text-xs font-medium transition-colors duration-200 flex items-center gap-1"
                          disabled={isLoading}
                        >
                          <Lightbulb className="h-3 w-3" />
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </ScrollArea>
            
            <div className="p-3 border-t bg-background/50 backdrop-blur">
              <form onSubmit={handleSubmit} className="relative">
                <Textarea
                  placeholder="Ask about your productivity, tasks, goals, or anything else..."
                  className="pr-16 resize-none border-0 bg-background/50 focus-visible:ring-1 focus-visible:ring-purple-500"
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  disabled={isLoading}
                />
                <Button 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}
