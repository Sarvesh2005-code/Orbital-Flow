'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BotMessageSquare, ArrowUp } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function AiAssistant() {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <BotMessageSquare className="h-6 w-6" />
            AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[300px] border rounded-lg">
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 border">
                            <AvatarFallback><BotMessageSquare className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-xs sm:max-w-md">
                            <p className="text-sm">Hello! How can I help you be more productive today? You can ask me things like "What's my priority today?" or "Summarize this week".</p>
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <div className="p-2 border-t bg-background">
                <div className="relative">
                <Textarea
                    placeholder="Ask Orbital Flow anything..."
                    className="pr-16 resize-none"
                    rows={1}
                />
                <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8">
                    <ArrowUp className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                </Button>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
