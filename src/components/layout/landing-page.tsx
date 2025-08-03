// src/components/layout/landing-page.tsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckSquare, BotMessageSquare, Goal, Repeat, Calendar } from 'lucide-react';
import Image from 'next/image';

const OrbityLogo = () => (
    <div className="flex items-center gap-2.5">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
            <path d="M12 4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor"/>
            <path d="M16.82 15.18C15.09 14.07 13.08 13.5 11 13.5c-2.08 0-4.09.57-5.82 1.68C4.42 15.7 4 16.33 4 17v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-.67-.42-1.3-1.18-1.82z" fill="hsl(var(--accent))" fillOpacity="0.8"/>
        </svg>
        <h1 className="text-2xl font-headline font-semibold text-foreground">Orbital Flow</h1>
    </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-6 bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
                {icon}
            </div>
            <h3 className="text-xl font-bold font-headline">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
    </div>
);


export function LandingPage() {
  return (
    <div className="bg-background text-foreground">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <OrbityLogo />
                <nav className="flex items-center gap-4">
                    <Link href="/login"><Button variant="ghost">Login</Button></Link>
                    <Link href="/signup"><Button>Sign Up</Button></Link>
                </nav>
            </div>
        </header>
        
        <main>
            {/* Hero Section */}
            <section className="pt-32 pb-20 text-center bg-muted/50">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl md:text-6xl font-extrabold font-headline mb-6 leading-tight">
                        Achieve Your <span className="text-primary">Peak Productivity</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-10">
                        Orbital Flow is your all-in-one workspace. Integrate tasks, notes, goals, and habits with a powerful AI assistant to bring order to your chaos.
                    </p>
                    <Link href="/signup">
                        <Button size="lg">Get Started for Free</Button>
                    </Link>
                </div>
            </section>
            
            {/* App Screenshot */}
            <section className="container mx-auto px-4 -mt-10">
                 <div className="relative mx-auto border-foreground/5 bg-foreground/5 rounded-t-lg shadow-2xl w-full max-w-5xl">
                    <div className="flex items-center gap-1 p-2 border-b border-foreground/5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                     <Image
                        src="https://placehold.co/1200x800.png"
                        alt="App Screenshot"
                        width={1200}
                        height={800}
                        className="rounded-b-lg w-full h-auto"
                        data-ai-hint="app dashboard"
                        priority
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                         <h2 className="text-4xl font-bold font-headline">One Tool for Everything</h2>
                         <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">Stop juggling apps. Orbital Flow brings all your productivity tools under one roof.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                       <FeatureCard
                            icon={<CheckSquare size={24} />}
                            title="Task Management"
                            description="Organize your work with flexible task lists, priorities, and deadlines. Never miss a beat."
                        />
                        <FeatureCard
                            icon={<Goal size={24} />}
                            title="Goal Tracking"
                            description="Set long-term goals and break them down into actionable steps. Visualize your progress and stay motivated."
                        />
                         <FeatureCard
                            icon={<Repeat size={24} />}
                            title="Habit Formation"
                            description="Build positive habits with our intuitive tracker. Monitor your streaks and build consistency."
                        />
                        <FeatureCard
                            icon={<Calendar size={24} />}
                            title="Integrated Calendar"
                            description="See your tasks, deadlines, and events in one place. Plan your days with a complete view of your schedule."
                        />
                        <FeatureCard
                            icon={<BotMessageSquare size={24} />}
                            title="AI Assistant"
                            description="Leverage the power of AI to analyze your productivity, suggest tasks, and answer questions about your workflow."
                        />
                        <FeatureCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-1a2 2 0 1 1 4 0v1"/><path d="M12 12h.01"/></svg>}
                            title="And Much More..."
                            description="Integrations with email and classroom, smart notes, reminders, and a customizable interface."
                        />
                    </div>
                </div>
            </section>
        </main>
        
        {/* Footer */}
        <footer className="py-10 border-t bg-muted/50">
            <div className="container mx-auto px-4 text-center text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Orbital Flow. All rights reserved.</p>
            </div>
        </footer>
    </div>
  );
}
