// src/app/email/page.tsx
'use client';

import ProtectedRoute from '@/components/layout/protected-route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Mail, PenSquare, Inbox, Send, Trash2 } from 'lucide-react';

const placeholderEmails = [
  { id: 1, sender: 'Firebase Team', subject: 'Welcome to Firebase!', content: '...', read: false, date: '3:45 PM' },
  { id: 2, sender: 'Next.js Conf', subject: 'Your ticket is confirmed', content: '...', read: true, date: '1:20 PM' },
  { id: 3, sender: 'GitHub', subject: '[orbital-flow] Your workflow run failed', content: '...', read: false, date: '11:10 AM' },
  { id: 4, sender: 'Lucide Icons', subject: 'New icon pack available!', content: '...', read: true, date: 'Yesterday' },
  { id: 5, sender: 'Vercel', subject: 'Deployment Successful: orbital-flow-cp8pz', content: '...', read: true, date: 'Yesterday' },
];

export default function EmailPage() {
  return (
    <ProtectedRoute>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-10rem)]">
            <Card className="lg:col-span-1 h-full flex flex-col">
                <CardHeader>
                    <Button className="w-full"><PenSquare className="h-4 w-4 mr-2" /> Compose</Button>
                </CardHeader>
                <CardContent className="p-2 flex-grow">
                    <Button variant="ghost" className="w-full justify-start text-primary bg-accent"><Inbox className="h-4 w-4 mr-2"/> Inbox <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 rounded-full">2</span></Button>
                    <Button variant="ghost" className="w-full justify-start"><Send className="h-4 w-4 mr-2"/> Sent</Button>
                    <Button variant="ghost" className="w-full justify-start"><Trash2 className="h-4 w-4 mr-2"/> Trash</Button>
                </CardContent>
            </Card>
            <div className="lg:col-span-3 h-full flex flex-col md:flex-row gap-4">
                <Card className="w-full md:w-1/3 h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Inbox</CardTitle>
                    </CardHeader>
                    <ScrollArea className="flex-grow">
                        <CardContent className="p-0">
                            {placeholderEmails.map((email, index) => (
                                <div key={email.id}>
                                    <button className={`w-full text-left p-3 hover:bg-muted/50 ${!email.read ? 'bg-muted' : ''}`}>
                                        <div className="flex justify-between items-center text-xs">
                                            <p className={`font-semibold ${!email.read ? 'text-foreground' : 'text-muted-foreground'}`}>{email.sender}</p>
                                            <p className="text-muted-foreground">{email.date}</p>
                                        </div>
                                        <p className="font-medium truncate">{email.subject}</p>
                                    </button>
                                    {index < placeholderEmails.length -1 && <Separator />}
                                </div>
                            ))}
                        </CardContent>
                    </ScrollArea>
                </Card>
                <Card className="w-full md:w-2/3 h-full flex flex-col">
                     <CardHeader className="border-b">
                        <CardTitle>Welcome to Firebase!</CardTitle>
                        <div className="flex items-center gap-2 pt-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>FT</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold">Firebase Team</p>
                                <p className="text-xs text-muted-foreground">to: you@youremail.com</p>
                            </div>
                        </div>
                     </CardHeader>
                     <ScrollArea className="flex-grow">
                        <CardContent className="py-4">
                            <p>Hello,</p>
                            <br/>
                            <p>Welcome to your new productivity application, powered by Firebase!</p>
                            <p>This is a placeholder UI. A full email integration would require setting up the Gmail API and OAuth 2.0 for authentication.</p>
                            <br/>
                            <p>Best,</p>
                            <p>The Firebase Studio Team</p>
                        </CardContent>
                     </ScrollArea>
                </Card>
            </div>
        </div>
    </ProtectedRoute>
  );
}
