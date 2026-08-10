'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp, User, Cat, Lightbulb, RefreshCw, Search } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/providers/auth-provider';
import { answerProductivityQueries } from '@/ai/flows/answer-queries';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeTasks, useRealtimeHabits, useRealtimeNotes, useRealtimeGoals } from '@/hooks/use-realtime-data';

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
      content: "Meow... what's your request?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Fetch real-time context data for AI
  const { tasks } = useRealtimeTasks();
  const { habits } = useRealtimeHabits();
  const { notes } = useRealtimeNotes();
  const { goals } = useRealtimeGoals();

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
      const contextData = JSON.stringify({
        tasks: tasks.map(t => ({ title: t.title, priority: t.priority, completed: t.completed, dueDate: t.dueDate })),
        habits: habits.map(h => ({ name: h.name, streak: h.streak })),
        goals: goals.map(g => ({ title: g.title, status: g.status })),
      });
      
      const response = await answerProductivityQueries({ 
        query, 
        userId: user.uid,
        context: contextData
      });
      if (response.answer.startsWith('API_ERROR:')) {
        throw new Error(response.answer.substring(10).trim());
      }
      const assistantMessage: Message = { role: 'assistant', content: response.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('AI Assistant error:', error);
      
      const errorMessage = error?.message || 'Unknown error';
      // Provide helpful fallback responses based on query keywords
      let fallbackResponse = `⚠️ **Google API Connection Failed**\n\nThe AI couldn't process your request because of an API error. The exact error from Google is:\n\`${errorMessage}\`\n\nTo fix this, please ensure your \`GOOGLEAI_API_KEY\` is valid and has the **Gemini API** enabled in Google Cloud.\n\n---\n\nMeanwhile, here are some general productivity tips based on your query:\n\n`;
      
      const queryLower = query.toLowerCase();
      if (queryLower.includes('task') || queryLower.includes('todo')) {
        fallbackResponse += "📋 **Task Management Tips:**\n- Prioritize tasks using the Eisenhower Matrix (urgent vs important)\n- Break large tasks into smaller, manageable chunks\n- Set specific deadlines and stick to them\n- Review your task list daily";
      } else if (queryLower.includes('goal') || queryLower.includes('objective')) {
        fallbackResponse += "🎯 **Goal Setting Advice:**\n- Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)\n- Break long-term goals into smaller milestones\n- Track your progress regularly\n- Celebrate small wins along the way";
      } else if (queryLower.includes('habit') || queryLower.includes('routine')) {
        fallbackResponse += "🔄 **Habit Building Tips:**\n- Start small and be consistent\n- Stack new habits onto existing ones\n- Track your streak to stay motivated\n- Don't break the chain - aim for daily progress";
      } else if (queryLower.includes('focus') || queryLower.includes('productivity')) {
        fallbackResponse += "⚡ **Focus & Productivity Tips:**\n- Use the Pomodoro Technique (25min work, 5min break)\n- Eliminate distractions during work sessions\n- Tackle your most important task first thing\n- Schedule breaks to maintain energy";
      } else {
        fallbackResponse += "✨ **General Productivity Advice:**\n- Plan your day the night before\n- Focus on progress, not perfection\n- Use tools like Orbital Flow to track everything\n- Review and adjust your systems regularly\n\n💡 Try asking more specific questions about tasks, goals, habits, or focus when I'm back online!";
      }
      
      const assistantMessage: Message = { role: 'assistant', content: fallbackResponse };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Show a less alarming toast
      toast({
        title: 'AI Assistant Offline',
        description: 'Showing general advice while reconnecting...',
        variant: 'default',
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
        content: "Meow... what's your request?" 
      }
    ]);
    setShowSuggestions(true);
    setInput('');
  };

  return (
    <div>
      <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-500">
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Cat className="h-4 w-4" />
            <span>AI Assistant</span>
          </div>
          <Button variant="ghost" size="sm" onClick={clearConversation} className="h-8 w-8 p-0">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="pt-0">
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
                            <Cat className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`p-3 rounded-lg max-w-[80%] ${
                        message.role === 'assistant'
                          ? 'bg-muted/50 rounded-tl-none'
                          : 'bg-primary text-primary-foreground rounded-tr-none'
                      }`}>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
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
                          <Cat className="h-4 w-4" />
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
                          className="px-3 py-1.5 border hover:bg-muted rounded-full text-xs transition-colors duration-200 flex items-center gap-1"
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
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Ask me anything..."
                  className="pl-9 pr-16 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-purple-500"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
