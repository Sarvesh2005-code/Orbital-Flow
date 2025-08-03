'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BotMessageSquare, ArrowUp, User } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { answerProductivityQueries } from '@/ai/flows/answer-queries';
import { Skeleton } from '../ui/skeleton';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! How can I help you be more productive today? You can ask me things like \"What's my priority today?\" or \"Summarize this week\"." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || !user) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await answerProductivityQueries({ query: input, userId: user.uid });
      const assistantMessage: Message = { role: 'assistant', content: response.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <BotMessageSquare className="h-6 w-6" />
            AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[400px] border rounded-lg">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                            {message.role === 'assistant' && (
                                <Avatar className="h-8 w-8 border">
                                    <AvatarFallback><BotMessageSquare className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`p-3 rounded-lg max-w-xs sm:max-w-md ${
                                message.role === 'assistant'
                                ? 'bg-muted rounded-tl-none'
                                : 'bg-primary text-primary-foreground rounded-tr-none'
                            }`}>
                                <p className="text-sm">{message.content}</p>
                            </div>
                            {message.role === 'user' && (
                                <Avatar className="h-8 w-8 border">
                                    {user?.photoURL ? <AvatarImage src={user.photoURL} alt="User" /> : <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>}
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 border">
                                <AvatarFallback><BotMessageSquare className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-xs sm:max-w-md">
                                <Skeleton className="w-24 h-4" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <div className="p-2 border-t bg-background">
                <form onSubmit={handleSubmit} className="relative">
                <Textarea
                    placeholder="Ask Orbital Flow anything..."
                    className="pr-16 resize-none"
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
                <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" type="submit" disabled={isLoading || !input}>
                    <ArrowUp className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                </Button>
                </form>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
