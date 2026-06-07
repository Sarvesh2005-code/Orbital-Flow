// src/app/not-found.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileQuestion, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
            <Card className="w-full max-w-md p-8 border-none shadow-2xl bg-background/60 backdrop-blur-xl text-center">
                <div className="flex flex-col items-center space-y-6">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                        <FileQuestion className="h-10 w-10 text-muted-foreground" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">404</h1>
                        <h2 className="text-xl font-semibold">Page not found</h2>
                        <p className="text-muted-foreground">
                            The page you represent looking for doesn't exist or has been moved.
                        </p>
                    </div>

                    <Link href="/" passHref className="w-full">
                        <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 h-10">
                            <Home className="mr-2 h-4 w-4" />
                            Return Home
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
