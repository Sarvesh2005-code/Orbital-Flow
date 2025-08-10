// src/app/signup/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { createUserDocument } from '@/services/userService';
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle, Sparkles, Sun, Moon, User } from 'lucide-react';


// Custom Orbital Flow Logo Component
const OrbitalLogo = ({ isDark }: { isDark: boolean }) => (
  <div className="flex items-center justify-center space-x-3 mb-6">
    {/* Space for your Orbital Flow image - replace the div below with your image */}
    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
      {/* Replace this div with: <Image src="/your-orbital-flow-logo.png" alt="Orbital Flow" width={48} height={48} /> */}
      <span className="text-white font-bold text-lg">OF</span>
    </div>
    <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Orbital Flow</span>
  </div>
);

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [errors, setErrors] = useState<{name?: string; email?: string; password?: string; confirmPassword?: string; general?: string}>({});
  
  const router = useRouter();
  const { toast } = useToast();

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
    const newErrors: {name?: string; email?: string; password?: string; confirmPassword?: string} = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
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
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocument(userCredential.user);
      toast({
        title: 'Account Created!',
        description: 'Welcome to Orbital Flow! Your account has been created successfully.',
        variant: 'default',
      });
      router.push('/');
    } catch (error: any) {
      let errorMessage = 'An error occurred during signup';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        default:
          errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
      toast({
        title: 'Signup Failed',
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
      const userCredential = await signInWithPopup(auth, googleProvider);
      await createUserDocument(userCredential.user);
      toast({
        title: 'Welcome!',
        description: 'You have successfully signed up with Google.',
        variant: 'default',
      });
      router.push('/');
    } catch (error: any) {
      let errorMessage = 'Google sign-up failed';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-up was cancelled';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by browser';
      }
      
      setErrors({ general: errorMessage });
      toast({
        title: 'Google Sign-Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isPasswordStrong = password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-300 py-8 ${
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
        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
            : 'bg-white hover:bg-gray-100 text-gray-600 shadow-md'
        }`}
      >
        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md p-4">
        {/* Logo */}
        <div className="flex flex-row items-center justify-center gap-3 mb-6">
      <img
       src="/icons/orbital-flow-logo.png"
       alt="App Logo"
        className="h-10 w-auto"
        />
        <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
         Orbital Flow
        </span>
        </div>
       
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Get started
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Create your account for <span className="text-transparent bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text font-semibold">supercharged</span> notes
          </p>
        </div>

        {/* Signup Card */}
        <Card className={`shadow-2xl transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700/50' 
            : 'bg-white/70 backdrop-blur-xl border-gray-200/50'
        }`}>
          <CardContent className="p-6">
            {/* General Error Alert */}
            {errors.general && (
              <Alert variant="destructive" className={`mb-4 ${
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

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1">
                <Label htmlFor="name" className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Full Name</Label>
                <div className="relative">
                  <User className={`absolute left-3 top-3 h-4 w-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className={`pl-10 h-10 transition-all duration-200 ${
                      isDarkMode 
                        ? `bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}` 
                        : `bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`
                    }`}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) {
                        setErrors(prev => ({ ...prev, name: undefined }));
                      }
                    }}
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <Label htmlFor="email" className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Email</Label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-3 h-4 w-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`pl-10 h-10 transition-all duration-200 ${
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
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <Label htmlFor="password" className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Password</Label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3 h-4 w-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className={`pl-10 pr-10 h-10 transition-all duration-200 ${
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
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Confirm Password</Label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-3 h-4 w-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className={`pl-10 pr-10 h-10 transition-all duration-200 ${
                      isDarkMode 
                        ? `bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}` 
                        : `bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/20 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`
                    }`}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                      }
                    }}
                    disabled={isLoading || isGoogleLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-3 transition-colors ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-gray-300' 
                        : 'text-gray-500 hover:text-gray-600'
                    }`}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Compact Password Requirements */}
              {password && (
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className={`w-1 h-1 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span>6+ chars</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-1 h-1 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span>Uppercase</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-1 h-1 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span>Lowercase</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-1 h-1 rounded-full ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span>Number</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Signup Button */}
              <Button 
                type="submit" 
                className="w-full h-10 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 mt-6"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create account
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-300'
                }`}></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-3 font-medium ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-400' 
                    : 'bg-white text-gray-500'
                }`}>
                  Or
                </span>
              </div>
            </div>

            {/* Google Sign-up Button */}
            <Button 
              variant="outline" 
              className={`w-full h-10 font-semibold text-sm transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500' 
                  : 'bg-white/50 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  {/* Google Logo SVG */}
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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

            {/* Sign in Link */}
            <div className="mt-6 text-center">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Already have an account? </span>
              <Link 
                href="/login" 
                className={`text-sm font-semibold transition-colors focus:outline-none focus:underline ${
                  isDarkMode 
                    ? 'text-orange-400 hover:text-orange-300' 
                    : 'text-orange-600 hover:text-orange-500'
                }`}
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            By creating an account, you agree to our{' '}
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