// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
            <Card className="w-full max-w-md p-6 border-none shadow-2xl bg-background/60 backdrop-blur-xl">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold tracking-tight">
                            Something went wrong
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            We encountered an unexpected error. Our team has been notified.
                        </p>
                    </div>

                    <div className="pt-4 flex w-full gap-2">
                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="flex-1"
                        >
                            Reload Page
                        </Button>
                        <Button
                            onClick={() => reset()}
                            className="flex-1 bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </div>

                    {(process.env.NODE_ENV === 'development' || error.digest) && (
                        <div className="mt-4 p-2 bg-muted/50 rounded text-xs font-mono text-muted-foreground break-all">
                            {error.digest && <p>Error ID: {error.digest}</p>}
                            {process.env.NODE_ENV === 'development' && <p>{error.message}</p>}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
