 // src/components/layout/landing-page.tsx
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
    CheckSquare, BotMessageSquare, Goal, Repeat, Calendar, ArrowRight, Play, 
    Sparkles, Zap, Target, Users, NotebookText, Search, Cloud, 
    Smartphone, Shield, Sun, Moon, FileText, Brain, PenTool, Check,
    Twitter, Github, Linkedin, Mail, MapPin, Phone, Globe,
    Star, TrendingUp, Layers, Lock, Palette
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const OrbitalFlowLogo = ({ isDark }: { isDark: boolean }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
                {!imageError ? (
                    <Image
                        src="/icons/orbital-flow-logo.png"
                        alt="Orbital Flow Logo"
                        width={32}
                        height={32}
                        className="rounded-lg"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <>
                        {/* Fallback animated logo */}
                        <div className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-rose-500 animate-pulse"></div>
                        <div
                            className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-rose-500 animate-spin opacity-50"
                            style={{ animationDuration: '3s' }}
                        ></div>
                    </>
                )}
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                Orbital Flow
            </h1>
        </div>
    );
};

const AnimatedCounter = ({ target, label, isDark }: { target: number; label: string; isDark: boolean }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        const stepDuration = duration / steps;
        
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, stepDuration);
        
        return () => clearInterval(timer);
    }, [target]);
    
    return (
        <div className="text-center group">
            <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {count.toLocaleString()}+
            </div>
            <div className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'} uppercase tracking-wider`}>
                {label}
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay = 0, isDark }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    delay?: number;
    isDark: boolean;
}) => (
    <div 
        className={`group p-8 ${isDark 
            ? 'bg-zinc-900/40 hover:bg-zinc-800/60 border-zinc-800 hover:border-zinc-700' 
            : 'bg-white/60 hover:bg-white/80 border-zinc-200 hover:border-zinc-300'
        } backdrop-blur-xl rounded-3xl border transition-all duration-700 hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden`}
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative z-10">
            <div className="flex items-start gap-4 mb-6">
                <div className={`p-4 ${isDark 
                    ? 'bg-gradient-to-br from-orange-500/20 to-pink-500/20 text-orange-400' 
                    : 'bg-gradient-to-br from-orange-500/10 to-pink-500/10 text-orange-600'
                } rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-3`}>
                        {title}
                    </h3>
                    <p className={`leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const PricingCard = ({ title, price, period, features, popular = false, isDark }: {
    title: string;
    price: string;
    period: string;
    features: string[];
    popular?: boolean;
    isDark: boolean;
}) => (
    <div className={`relative p-8 rounded-3xl border transition-all duration-500 hover:scale-[1.02] ${
        popular 
            ? 'bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-rose-500/10 border-orange-500/30 shadow-xl shadow-orange-500/10'
            : isDark 
                ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700' 
                : 'bg-white/60 border-zinc-200 hover:border-zinc-300'
    } backdrop-blur-xl`}>
        {popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                </div>
            </div>
        )}
        <div className="text-center mb-8">
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-2`}>
                {title}
            </h3>
            <div className="flex items-baseline justify-center gap-1">
                <span className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    {price}
                </span>
                <span className={`text-lg ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {period}
                </span>
            </div>
        </div>
        <ul className="space-y-4 mb-8">
            {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className={`${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {feature}
                    </span>
                </li>
            ))}
        </ul>
        <Button 
            className={`w-full ${popular 
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white' 
                : isDark 
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-white' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white'
            }`}
            size="lg"
        >
            Get Started
        </Button>
    </div>
);

const FloatingElement = ({ children, delay = 0, duration = 6 }: { 
    children: React.ReactNode; 
    delay?: number;
    duration?: number;
}) => (
    <div 
        className="animate-float"
        style={{ 
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`
        }}
    >
        {children}
    </div>
);

export function LandingPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDark, setIsDark] = useState(true);
    
    useEffect(() => {
        setIsVisible(true);
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDark(savedTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${
            isDark 
                ? 'bg-zinc-950 text-white' 
                : 'bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900'
        } overflow-hidden`}>
            {/* Custom CSS for animations and noise */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-10px) rotate(1deg); }
                    66% { transform: translateY(5px) rotate(-1deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .noise-bg::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    opacity: ${isDark ? '0.03' : '0.02'};
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    pointer-events: none;
                }
                .mesh-bg {
                    background-image: radial-gradient(circle at 25% 25%, rgba(249, 115, 22, 0.08) 0%, transparent 50%),
                                      radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
                                      radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.05) 0%, transparent 50%);
                }
            `}</style>

            {/* Background with mesh and noise */}
            <div className="fixed inset-0 z-0">
                <div className={`absolute inset-0 noise-bg mesh-bg ${
                    isDark 
                        ? 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950' 
                        : 'bg-gradient-to-br from-zinc-50 via-white to-zinc-100'
                }`}></div>
                
                {/* Floating orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/15 via-pink-500/15 to-rose-500/15 rounded-full blur-3xl animate-pulse opacity-60"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/12 via-rose-500/12 to-orange-500/12 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse opacity-30" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 ${isDark 
                ? 'bg-zinc-950/80 border-zinc-800' 
                : 'bg-white/80 border-zinc-200'
            } backdrop-blur-xl border-b transition-all duration-500`}>
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <OrbitalFlowLogo isDark={isDark} />
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className={`font-medium ${isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} transition-colors hover:scale-105 transform`}>Features</a>
                        <a href="#pricing" className={`font-medium ${isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} transition-colors hover:scale-105 transform`}>Pricing</a>
                        <a href="#about" className={`font-medium ${isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} transition-colors hover:scale-105 transform`}>About</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={toggleTheme}
                            className={`${isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'} transition-all hover:scale-110`}
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </Button>
                        <Link href="/login">
                            <Button variant="ghost" className={`font-medium ${isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'} transition-all hover:scale-105`}>
                                Login
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 hover:from-orange-600 hover:via-pink-600 hover:to-rose-600 border-0 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="pt-32 pb-24 px-6">
                    <div className="container mx-auto text-center max-w-7xl">
                        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className={`inline-flex items-center gap-3 px-6 py-3 ${isDark 
                                ? 'bg-zinc-900/50 border-zinc-800' 
                                : 'bg-white/70 border-zinc-200'
                            } backdrop-blur-xl rounded-full border mb-8 group hover:scale-105 transition-transform duration-300`}>
                                <div className="relative">
                                    <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                                    <div className="absolute inset-0 w-4 h-4 bg-orange-500 rounded-full blur-sm animate-ping opacity-30"></div>
                                </div>
                                <span className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                    AI-Powered Note Intelligence
                                </span>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                            
                            <div className="space-y-6 mb-12">
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight max-w-4xl mx-auto">
                                    Your notes, 
                                    <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                                        {" "}supercharged{" "}
                                    </span>
                                    with AI
                                </h1>
                                
                                <div className="max-w-2xl mx-auto">
                                    <p className={`text-lg md:text-xl leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                        Capture ideas effortlessly. Connect thoughts intelligently. 
                                        Transform scattered notes into organized knowledge with AI that thinks like you do.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                                <Link href="/signup">
                                    <Button size="lg" className="bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 hover:from-orange-600 hover:via-pink-600 hover:to-rose-600 border-0 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 group">
                                        Start Taking Notes
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button 
                                    size="lg" 
                                    variant="ghost" 
                                    className={`${isDark 
                                        ? 'text-white border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600' 
                                        : 'text-zinc-900 border-zinc-300 hover:bg-white hover:border-zinc-400'
                                    } border-2 px-8 py-4 text-base font-semibold backdrop-blur-xl transition-all hover:scale-105 group`}
                                >
                                    <Play className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Watch Demo
                                </Button>
                            </div>
                        </div>

                        {/* Enhanced UI Mockup */}
                        <div className="relative max-w-6xl mx-auto perspective-1000">
                            <div className={`relative bg-gradient-to-br ${isDark 
                                ? 'from-zinc-900/60 to-zinc-800/60 border-zinc-700' 
                                : 'from-white/80 to-zinc-50/80 border-zinc-300'
                            } backdrop-blur-2xl rounded-3xl border shadow-2xl p-8 transform hover:scale-[1.01] transition-all duration-700 group`}>
                                
                                {/* Browser Header */}
                                <div className={`flex items-center gap-3 mb-8 pb-6 border-b ${isDark ? 'border-zinc-700' : 'border-zinc-300'}`}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors cursor-pointer"></div>
                                    </div>
                                    <div className={`flex-1 ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'} rounded-xl mx-6 px-4 py-3 text-left transition-colors group-hover:bg-opacity-80`}>
                                        <span className={`text-sm font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                            app.orbital-flow.com/dashboard
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                                        <span className={`text-xs font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>Secure</span>
                                    </div>
                                </div>
                                
                                {/* Dashboard Content */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className={`${isDark ? 'bg-zinc-800/50' : 'bg-white/70'} rounded-2xl p-6 border ${isDark ? 'border-zinc-700' : 'border-zinc-200'} group-hover:scale-105 transition-all duration-500`}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-xl">
                                                <NotebookText className="w-6 h-6 text-orange-400" />
                                            </div>
                                            <div>
                                                <div className={`h-3 ${isDark ? 'bg-zinc-600' : 'bg-zinc-300'} rounded w-24 mb-2`}></div>
                                                <div className={`h-2 ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'} rounded w-16`}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className={`h-2 ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'} rounded w-full`}></div>
                                            <div className={`h-2 ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'} rounded w-4/5`}></div>
                                            <div className={`h-2 ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'} rounded w-3/5`}></div>
                                        </div>
                                    </div>
                                    
                                    <div className={`bg-gradient-to-br from-orange-500/8 via-pink-500/8 to-rose-500/8 rounded-2xl p-6 border border-orange-500/20 group-hover:scale-105 transition-all duration-500 delay-100`}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 bg-gradient-to-br from-pink-500/30 to-rose-500/30 rounded-xl">
                                                <Brain className="w-6 h-6 text-pink-400" />
                                            </div>
                                            <div>
                                                <div className={`h-3 ${isDark ? 'bg-pink-400/30' : 'bg-pink-300'} rounded w-28 mb-2`}></div>
                                                <div className={`h-2 ${isDark ? 'bg-pink-400/20' : 'bg-pink-200'} rounded w-20`}></div>
                                            </div>
                                        </div>
                                        <div className={`h-12 ${isDark ? 'bg-pink-400/10' : 'bg-pink-100'} rounded-xl mb-4`}></div>
                                        <div className={`h-8 ${isDark ? 'bg-pink-400/5' : 'bg-pink-50'} rounded-lg w-5/6`}></div>
                                    </div>
                                    
                                    <div className={`${isDark ? 'bg-zinc-800/50' : 'bg-white/70'} rounded-2xl p-6 border ${isDark ? 'border-zinc-700' : 'border-zinc-200'} group-hover:scale-105 transition-all duration-500 delay-200`}>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 bg-gradient-to-br from-rose-500/20 to-orange-600/20 rounded-xl">
                                                <TrendingUp className="w-6 h-6 text-rose-400" />
                                            </div>
                                            <div>
                                                <div className={`h-3 ${isDark ? 'bg-zinc-600' : 'bg-zinc-300'} rounded w-20 mb-2`}></div>
                                                <div className={`h-2 ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'} rounded w-14`}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded w-4/5"></div>
                                            <div className={`h-2 ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'} rounded w-full`}></div>
                                            <div className={`h-2 ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'} rounded w-3/4`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Floating Elements */}
                            <FloatingElement delay={0}>
                                <div className={`absolute -top-12 -left-12 ${isDark 
                                    ? 'bg-zinc-800/60 border-zinc-700' 
                                    : 'bg-white/80 border-zinc-300'
                                } backdrop-blur-xl rounded-3xl border p-6 shadow-xl hover:scale-110 transition-all duration-300`}>
                                    <Search className="w-8 h-8 text-orange-500" />
                                </div>
                            </FloatingElement>
                            
                            <FloatingElement delay={2}>
                                <div className={`absolute -top-8 -right-8 ${isDark 
                                    ? 'bg-zinc-800/60 border-zinc-700' 
                                    : 'bg-white/80 border-zinc-300'
                                } backdrop-blur-xl rounded-2xl border p-4 shadow-xl hover:scale-110 transition-all duration-300`}>
                                    <Cloud className="w-6 h-6 text-pink-500" />
                                </div>
                            </FloatingElement>
                            
                            <FloatingElement delay={4}>
                                <div className={`absolute -bottom-8 left-12 ${isDark 
                                    ? 'bg-zinc-800/60 border-zinc-700' 
                                    : 'bg-white/80 border-zinc-300'
                                } backdrop-blur-xl rounded-2xl border p-4 shadow-xl hover:scale-110 transition-all duration-300`}>
                                    <Smartphone className="w-6 h-6 text-rose-500" />
                                </div>
                            </FloatingElement>
                        </div>

                        {/* Enhanced Stats Section */}
                        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <AnimatedCounter target={500} label="Notes Created" isDark={isDark} />
                            <AnimatedCounter target={50} label="Active Users" isDark={isDark} />
                            <AnimatedCounter target={99} label="Uptime %" isDark={isDark} />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 px-6">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-24">
                            <div className={`inline-flex items-center gap-3 px-6 py-3 ${isDark 
                                ? 'bg-zinc-900/50 border-zinc-800' 
                                : 'bg-white/70 border-zinc-200'
                            } backdrop-blur-xl rounded-full border mb-8 hover:scale-105 transition-transform duration-300`}>
                                <Layers className="w-5 h-5 text-orange-400" />
                                <span className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                    Powerful Features
                                </span>
                            </div>
                            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark 
                                ? 'bg-gradient-to-r from-white via-zinc-200 to-zinc-300' 
                                : 'bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-600'
                            } bg-clip-text text-transparent`}>
                                Everything you need for
                                <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                                    perfect notes
                                </span>
                            </h2>
                            <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                From AI-powered organization to seamless collaboration, Orbital Flow transforms 
                                how you capture, connect, and create with your ideas.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<NotebookText size={32} />}
                                title="Intelligent Writing"
                                description="Rich text editor with AI-powered auto-formatting, smart templates, and contextual suggestions that adapt to your writing style."
                                delay={0}
                                isDark={isDark}
                            />
                            <FeatureCard
                                icon={<Brain size={32} />}
                                title="AI Organization"
                                description="Automatically categorize, tag, and link related notes. Your AI assistant understands context and builds knowledge graphs."
                                delay={100}
                                isDark={isDark}
                            />
                            <FeatureCard
                                icon={<Search size={32} />}
                                title="Semantic Search"
                                description="Find anything instantly with natural language queries. Search by meaning, not just keywords."
                                delay={200}
                                isDark={isDark}
                            />
                            <FeatureCard
                                icon={<Palette size={32} />}
                                title="Visual Canvases"
                                description="Transform ideas into mind maps, flowcharts, and visual boards. Think visually, organize spatially."
                                delay={300}
                                isDark={isDark}
                            />
                            <FeatureCard
                                icon={<Cloud size={32} />}
                                title="Universal Sync"
                                description="Real-time synchronization across all devices with offline support and conflict resolution."
                                delay={400}
                                isDark={isDark}
                            />
                            <FeatureCard
                                icon={<Users size={32} />}
                                title="Team Collaboration"
                                description="Share workspaces, co-edit in real-time, and build collective knowledge with your team."
                                delay={500}
                                isDark={isDark}
                            />
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-32 px-6">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-24">
                            <div className={`inline-flex items-center gap-3 px-6 py-3 ${isDark 
                                ? 'bg-zinc-900/50 border-zinc-800' 
                                : 'bg-white/70 border-zinc-200'
                            } backdrop-blur-xl rounded-full border mb-8 hover:scale-105 transition-transform duration-300`}>
                                <Star className="w-5 h-5 text-orange-400" />
                                <span className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                    Simple Pricing
                                </span>
                            </div>
                            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark 
                                ? 'bg-gradient-to-r from-white via-zinc-200 to-zinc-300' 
                                : 'bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-600'
                            } bg-clip-text text-transparent`}>
                                Choose your
                                <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                                    creative journey
                                </span>
                            </h2>
                            <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                Start free, upgrade when you're ready. All plans include our core features with different usage limits.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <PricingCard
                                title="Starter"
                                price="Free"
                                period=""
                                features={[
                                    "Up to 1,000 notes",
                                    "Basic AI features",
                                    "2GB storage",
                                    "Web & mobile access",
                                    "Community support"
                                ]}
                                isDark={isDark}
                            />
                            <PricingCard
                                title="Pro"
                                price="$12"
                                period="/month"
                                features={[
                                    "Unlimited notes",
                                    "Advanced AI features",
                                    "100GB storage",
                                    "Real-time collaboration",
                                    "Priority support",
                                    "Custom templates",
                                    "API access"
                                ]}
                                popular={true}
                                isDark={isDark}
                            />
                            <PricingCard
                                title="Team"
                                price="$25"
                                period="/user/month"
                                features={[
                                    "Everything in Pro",
                                    "Team workspaces",
                                    "Advanced permissions",
                                    "SSO integration",
                                    "Dedicated support",
                                    "Custom integrations",
                                    "Analytics & insights"
                                ]}
                                isDark={isDark}
                            />
                        </div>
                        
                        <div className="text-center mt-16">
                            <p className={`text-lg ${isDark ? 'text-zinc-400' : 'text-zinc-600'} mb-6`}>
                                Need something custom? We'd love to work with you.
                            </p>
                            <Button 
                                variant="outline" 
                                size="lg"
                                className={`${isDark 
                                    ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white' 
                                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
                                } backdrop-blur-xl font-medium hover:scale-105 transition-all`}
                            >
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-32 px-6">
                    <div className="container mx-auto max-w-7xl">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className={`inline-flex items-center gap-3 px-6 py-3 ${isDark 
                                    ? 'bg-zinc-900/50 border-zinc-800' 
                                    : 'bg-white/70 border-zinc-200'
                                } backdrop-blur-xl rounded-full border mb-8 hover:scale-105 transition-transform duration-300`}>
                                    <Target className="w-5 h-5 text-indigo-400" />
                                    <span className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                        Our Mission
                                    </span>
                                </div>
                                <h2 className={`text-5xl font-bold mb-8 leading-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                    Empowering minds to 
                                    <span className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        think freely
                                    </span>
                                </h2>
                                <div className="space-y-6">
                                    <p className={`text-xl leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                        We believe that great ideas shouldn't be lost in scattered notes and fragmented thoughts. 
                                        Orbital Flow was born from the vision of creating a seamless bridge between human creativity 
                                        and artificial intelligence.
                                    </p>
                                    <p className={`text-lg leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>
                                        Our team of designers, engineers, and researchers work tirelessly to build tools that 
                                        amplify your thinking, not replace it. Every feature is crafted with intention, 
                                        designed to feel natural and powerful.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-12">
                                    <div className={`px-4 py-2 ${isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-700'} rounded-full text-sm font-medium`}>
                                        Privacy First
                                    </div>
                                    <div className={`px-4 py-2 ${isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-700'} rounded-full text-sm font-medium`}>
                                        Open Source
                                    </div>
                                    <div className={`px-4 py-2 ${isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-700'} rounded-full text-sm font-medium`}>
                                        Carbon Neutral
                                    </div>
                                    <div className={`px-4 py-2 ${isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-700'} rounded-full text-sm font-medium`}>
                                        Global Team
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className={`${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white/60 border-zinc-200'} rounded-3xl border p-8 backdrop-blur-xl shadow-xl hover:scale-[1.02] transition-all duration-500`}>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="text-center group">
                                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                <Users className="w-8 h-8 text-indigo-400" />
                                            </div>
                                            <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-2`}>50+</div>
                                            <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Team Members</div>
                                        </div>
                                        <div className="text-center group">
                                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                <Globe className="w-8 h-8 text-purple-400" />
                                            </div>
                                            <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-2`}>150+</div>
                                            <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Countries</div>
                                        </div>
                                        <div className="text-center group">
                                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-600/20 to-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                <Lock className="w-8 h-8 text-pink-400" />
                                            </div>
                                            <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-2`}>SOC 2</div>
                                            <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Compliant</div>
                                        </div>
                                        <div className="text-center group">
                                            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                                <Zap className="w-8 h-8 text-indigo-400" />
                                            </div>
                                            <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'} mb-2`}>24/7</div>
                                            <div className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Uptime</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 px-6">
                    <div className="container mx-auto text-center max-w-4xl">
                        <div className={`bg-gradient-to-br ${isDark 
                            ? 'from-zinc-900/60 to-zinc-800/60 border-zinc-800' 
                            : 'from-white/80 to-zinc-50/80 border-zinc-300'
                        } backdrop-blur-2xl rounded-3xl border p-16 shadow-2xl hover:scale-[1.01] transition-all duration-700 relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-600/5 to-pink-600/5"></div>
                            <div className="relative z-10">
                                <h2 className="text-5xl font-bold mb-8">
                                    Ready to transform your
                                    <span className="block bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        thinking process?
                                    </span>
                                </h2>
                                <p className={`text-xl mb-12 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                    Join thousands of creators, researchers, and teams who have revolutionized their 
                                    note-taking with AI-powered intelligence and seamless collaboration.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <Link href="/signup">
                                        <Button size="lg" className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-700 border-0 px-12 py-6 text-lg font-semibold text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 group">
                                            Start Your Journey Free
                                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="lg" 
                                        variant="ghost" 
                                        className={`${isDark 
                                            ? 'text-white border-zinc-600 hover:bg-zinc-700 hover:border-zinc-500' 
                                            : 'text-zinc-900 border-zinc-400 hover:bg-white hover:border-zinc-500'
                                        } border-2 px-12 py-6 text-lg font-semibold backdrop-blur-xl transition-all hover:scale-105`}
                                    >
                                        Book a Demo
                                    </Button>
                                </div>
                                <p className={`text-sm mt-8 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                    No credit card required • 14-day free trial • Cancel anytime • GDPR compliant
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Enhanced Footer */}
            <footer className={`py-16 px-6 border-t ${isDark 
                ? 'border-zinc-800 bg-zinc-950/80' 
                : 'border-zinc-200 bg-white/80'
            } backdrop-blur-xl`}>
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <OrbitalFlowLogo isDark={isDark} />
                            <p className={`mt-6 text-lg leading-relaxed max-w-md ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                Transforming the way you think, write, and collaborate with AI-powered note-taking that understands your mind.
                            </p>
                            <div className="flex items-center gap-4 mt-8">
                                <a href="#" className={`p-3 ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'} rounded-xl transition-all hover:scale-110`}>
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className={`p-3 ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'} rounded-xl transition-all hover:scale-110`}>
                                    <Github className="w-5 h-5" />
                                </a>
                                <a href="#" className={`p-3 ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'} rounded-xl transition-all hover:scale-110`}>
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a href="#" className={`p-3 ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'} rounded-xl transition-all hover:scale-110`}>
                                    <Mail className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Product Column */}
                        <div>
                            <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Product</h3>
                            <ul className="space-y-4">
                                {['Features', 'Pricing', 'Updates', 'Beta Program', 'Roadmap'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className={`${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} transition-colors hover:translate-x-1 transform inline-block`}>
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div>
                            <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Resources</h3>
                            <ul className="space-y-4">
                                {['Documentation', 'API Reference', 'Blog', 'Community', 'Help Center'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className={`${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} transition-colors hover:translate-x-1 transform inline-block`}>
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Company</h3>
                            <ul className="space-y-4">
                                {['About', 'Careers', 'Press', 'Partners', 'Contact'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className={`${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} transition-colors hover:translate-x-1 transform inline-block`}>
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className={`w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                                    <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>San Francisco, CA</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className={`w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                                    <span className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>+1 (555) 123-4567</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`flex flex-col md:flex-row items-center justify-between pt-12 mt-12 border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
                        <div className="flex items-center gap-8 mb-6 md:mb-0">
                            <a href="#" className={`text-sm ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} transition-colors`}>
                                Privacy Policy
                            </a>
                            <a href="#" className={`text-sm ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} transition-colors`}>
                                Terms of Service
                            </a>
                            <a href="#" className={`text-sm ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} transition-colors`}>
                                Cookie Policy
                            </a>
                            <a href="#" className={`text-sm ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'} transition-colors`}>
                                GDPR
                            </a>
                        </div>
                        <div className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-500'} text-center md:text-right`}>
                            <p>&copy; {new Date().getFullYear()} Orbital Flow, Inc. All rights reserved.</p>
                            <p className="mt-1">Made with ❤️ for creative minds worldwide</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}