// src/app/settings/page.tsx
'use client';

import ProtectedRoute from '@/components/layout/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PaintBrush, Bell, UserCircle, LifeBuoy, Zap } from 'lucide-react';
import { useDarkMode } from '@/hooks/use-dark-mode';

export default function SettingsPage() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
  return (
    <ProtectedRoute>
      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* Profile Settings */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserCircle className="h-6 w-6"/> Profile</CardTitle>
                <CardDescription>This information will be displayed on your profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <p className="text-muted-foreground text-sm">
                    Profile information is managed through your authentication provider (e.g., Google or your email account).
                </p>
            </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><PaintBrush className="h-6 w-6"/> Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                        <span>Dark Mode</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                        Toggle between light and dark themes.
                        </span>
                    </Label>
                    <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={() => toggleDarkMode()} />
                </div>
            </CardContent>
        </Card>

        {/* Integrations / Plugins */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="h-6 w-6" /> Integrations</CardTitle>
            <CardDescription>Connect with third-party services to enhance your productivity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="google-classroom" className="flex flex-col space-y-1">
                    <span>Google Classroom</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                    Sync your courses, assignments, and due dates.
                    </span>
                </Label>
                <Switch id="google-classroom" disabled />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="gmail" className="flex flex-col space-y-1">
                    <span>Gmail</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                    Read, manage, and reply to emails directly from Orbital Flow.
                    </span>
                </Label>
                <Switch id="gmail" disabled />
            </div>
            <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Full integration requires setup in the Google Cloud Console.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
