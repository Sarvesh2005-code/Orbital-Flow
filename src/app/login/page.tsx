// src/app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService } from '@/services/authService';
import { updateUserActivity } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle, CheckCircle2, Sparkles, Sun, Moon, Send } from 'lucide-react';
import { Suspense } from 'react';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

// Custom Orbital Flow Logo
const OrbitalLogo = ({ isDark }: { isDark: boolean }) => (
  <div className="flex items-center justify-center space-x-3 mb-8">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="orbitalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#orbitalGradient)" />
      <circle cx="24" cy="24" r="12" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
      <circle cx="24" cy="24" r="6" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" />
      <circle cx="24" cy="24" r="3" fill="white" />
      <circle cx="36" cy="24" r="2" fill="white" opacity="0.9" />
      <circle cx="12" cy="24" r="1.5" fill="white" opacity="0.7" />
      <circle cx="24" cy="12" r="1" fill="white" opacity="0.5" />
    </svg>
    <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Orbital Flow</span>
  </div>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-5.27 0-9.49-4.24-9.49-9.49s4.22-9.49 9.49-9.49c2.39 0 4.5.83 6.12 2.34l2.73-2.73C19.14 1.18 16.09 0 12.48 0 5.88 0 .02 5.88.02 12.48s5.86 12.48 12.46 12.48c3.34 0 6.08-1.06 8.16-3.12 2.22-2.22 2.86-5.44 2.86-8.38 0-.63-.06-1.22-.18-1.8z"
      fill="#4285F4"
    />
    <path
      d="M12.48 4.92c1.69 0 3.16.58 4.34 1.73l3.25-3.25C18.01 1.17 15.45 0 12.48 0 7.62 0 3.49 2.82 1.54 6.86l3.77 2.93c.89-2.65 3.35-4.87 7.17-4.87z"
      fill="#34A853"
    />
    <path
      d="M5.31 14.71c-.31-.91-.48-1.88-.48-2.86s.17-1.95.48-2.86L1.54 6.86C.56 8.82.02 10.6.02 12.48s.54 3.66 1.52 5.62l3.77-2.93z"
      fill="#FBBC05"
    />
    <path
      d="M12.48 19.08c-3.82 0-6.28-2.22-7.17-4.87l-3.77 2.93C3.49 21.18 7.62 24 12.48 24c2.97 0 5.53-1.17 7.59-3.4l-3.71-2.88c-1.12.74-2.56 1.16-3.88 1.16z"
      fill="#EA4335"
    />
  </svg>
);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; general?: string}>({});
  
  // Check URL parameters for verification status
  useEffect(() => {
    if (user) {
      router.push('/');
      return;
    }
    
    const verified = searchParams.get('verified');
    const reset = searchParams.get('reset');
    
    if (verified === 'true') {
      toast({
        title: 'Email Verified!',
        description: 'Your email has been verified successfully. You can now sign in.',
        variant: 'default',
      });
    }
    
    if (reset === 'true') {
      toast({
        title: 'Password Reset',
        description: 'You can now enter your new password to sign in.',
        variant: 'default',
      });
    }
  }, [searchParams, router, toast, user]);

  // Theme detection and management
  useEffect(() => {
    const checkTheme = () => {
      if (typeof window === 'undefined') return;
      
      const savedTheme = localStorage.getItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        setIsDarkMode(systemDark);
      }
    };

    checkTheme();
    
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => checkTheme();
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    }
  };

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const userCredential = await AuthService.signIn({ email, password });
      
      // Update user activity first
      await updateUserActivity(userCredential.user.uid);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        setShowEmailVerification(true);
        toast({
          title: 'Email Verification Required',
          description: 'Please verify your email to access all features.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Welcome back! 🎉',
          description: 'Successfully logged in to Orbital Flow.',
        });
      }
      
      // Redirect after successful login
      setTimeout(() => {
        router.push('/');
      }, 500);
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      // Handle specific Firebase auth errors
      if (error?.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
          case 'auth/invalid-login-credentials':
            errorMessage = 'Invalid email or password';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again in a few minutes';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection';
            break;
          default:
            errorMessage = error.message || 'An unexpected error occurred';
        }
      }
      
      setErrors({ general: errorMessage });
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrors({});
    
    try {
      const userCredential = await AuthService.signInWithGoogle();
      await updateUserActivity(userCredential.user.uid);
      
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed in with Google.',
        variant: 'default',
      });
      router.push('/');
    } catch (error: any) {
      let errorMessage = 'Google sign-in failed';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with a different sign-in method';
      }
      
      setErrors({ general: errorMessage });
      toast({
        title: 'Google Sign-In Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrors({ email: 'Please enter your email address first' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    try {
      await AuthService.sendPasswordReset(email);
      setResetEmailSent(true);
      toast({
        title: 'Reset Email Sent',
        description: 'Check your email for password reset instructions.',
        variant: 'default',
      });
    } catch (error: any) {
      let errorMessage = 'Failed to send reset email';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later';
      }
      
      toast({
        title: 'Reset Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;
    
    try {
      await AuthService.resendEmailVerification(user);
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your email and click the verification link.',
        variant: 'default',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Send Email',
        description: error.message,
        variant: 'destructive',
      });
    }
  };


  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Background Effects */}
      {isDarkMode ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        </>
      ) : (
        <>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl"></div>
        </>
      )}
      
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
            : 'bg-white hover:bg-gray-100 text-gray-600 shadow-md'
        }`}
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md p-6">
        {/* Logos */}
      <div className="flex flex-row items-center justify-center gap-3 mb-6">
      <img
       src="/icons/orbital-flow-logo.png"
       alt="Orbital Flow Logo"
       className="h-10 w-auto rounded-full"
        />
        <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
         Orbital Flow
        </span>
        </div>



        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome back
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to your <span className="text-transparent bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text font-semibold">supercharged</span> notes
          </p>
        </div>

        {/* Login Card */}
        <Card className={`shadow-2xl transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700/50' 
            : 'bg-white/70 backdrop-blur-xl border-gray-200/50'
        }`}>
          <CardContent className="p-8">
            {/* General Error Alert */}
            {errors.general && (
              <Alert variant="destructive" className={`mb-6 ${
                isDarkMode 
                  ? 'bg-red-900/50 border-red-500/50' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className={isDarkMode ? 'text-red-200' : 'text-red-700'}>
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}

            {/* Reset Email Sent Alert */}
            {resetEmailSent && (
              <Alert className={`mb-6 ${
                isDarkMode 
                  ? 'bg-green-900/50 border-green-500/50' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <CheckCircle2 className={`h-4 w-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                <AlertDescription className={isDarkMode ? 'text-green-200' : 'text-green-700'}>
                  Password reset email has been sent to your email address.
                </AlertDescription>
              </Alert>
            )}

            {/* Email Verification Alert */}
            {showEmailVerification && user && !user.emailVerified && (
              <Alert className={`mb-6 ${
                isDarkMode 
                  ? 'bg-blue-900/50 border-blue-500/50' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <Mail className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <AlertDescription className={`${isDarkMode ? 'text-blue-200' : 'text-blue-700'} flex items-center justify-between`}>
                  <span>Please verify your email address to access all features.</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResendVerification}
                    className={`ml-2 h-7 ${isDarkMode ? 'text-blue-400 border-blue-500' : 'text-blue-600 border-blue-300'}`}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Resend
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Email</Label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-3 h-5 w-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`pl-11 h-12 transition-all duration-200 ${
                      isDarkMode 
                        ? `bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}` 
                        : `bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`
                    }`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors(prev => ({ ...prev, email: undefined }));
                      }
                    }}
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Password</Label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className={`text-sm transition-colors ${
                      isDarkMode 
                        ? 'text-orange-400 hover:text-orange-300' 
                        : 'text-orange-600 hover:text-orange-500'
                    }`}
                    disabled={isLoading || isGoogleLoading}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3 h-5 w-5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`pl-11 pr-11 h-12 transition-all duration-200 ${
                      isDarkMode 
                        ? `bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}` 
                        : `bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`
                    }`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors(prev => ({ ...prev, password: undefined }));
                      }
                    }}
                    disabled={isLoading || isGoogleLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-3 transition-colors ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-gray-300' 
                        : 'text-gray-500 hover:text-gray-600'
                    }`}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Sign in
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-300'
                }`}></div>
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className={`px-4 font-medium ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-400' 
                    : 'bg-white text-gray-500'
                }`}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign-in Button */}
<Button
  variant="outline"
  className={`w-full h-12 font-semibold text-base transition-all duration-200 ${
    isDarkMode
      ? "bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500"
      : "bg-white/50 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
  }`}
  onClick={handleGoogleSignIn}
  disabled={isLoading || isGoogleLoading}
>
  {isGoogleLoading ? (
    <>
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      Signing in...
    </>
  ) : (
    <>
      {/* Google Logo SVG */}
      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      Continue with Google
    </>
  )}
</Button>


            {/* Sign up Link */}
            <div className="mt-8 text-center">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Don't have an account? </span>
              <Link 
                href="/signup" 
                className={`font-semibold transition-colors focus:outline-none focus:underline ${
                  isDarkMode 
                    ? 'text-orange-400 hover:text-orange-300' 
                    : 'text-orange-600 hover:text-orange-500'
                }`}
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            By signing in, you agree to our{' '}
            <Link href="/terms" className={`transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-orange-400' 
                : 'text-gray-500 hover:text-orange-600'
            }`}>
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className={`transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-orange-400' 
                : 'text-gray-500 hover:text-orange-600'
            }`}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
