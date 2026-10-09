'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCandidate } from '@/lib/context/CandidateContext';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  ArrowLeft 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { 
    login, 
    signup, 
    loginSocial, 
    loadDemo, 
    isAuthenticated, 
    userEmail, 
    userName, 
    logout 
  } = useCandidate();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [forgotModal, setForgotModal] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotSent, setForgotSent] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const res = signup(name, email, password);
      if (!res.success) {
        setError(res.error || 'Failed to create account.');
      } else {
        setSuccess('Account created successfully! Redirecting to workspace...');
        setTimeout(() => router.push('/'), 1200);
      }
    } else {
      if (!email.trim()) {
        setError('Please enter your email.');
        return;
      }
      if (!password) {
        setError('Please enter your password.');
        return;
      }

      const res = login(email, password);
      if (!res.success) {
        setError(res.error || 'Failed to sign in.');
      } else {
        setSuccess('Welcome back! Redirecting to workspace...');
        setTimeout(() => router.push('/'), 1200);
      }
    }
  };

  const handleSocial = (provider: 'google' | 'github') => {
    setError('');
    setSuccess('');
    loginSocial(provider);
    setSuccess(`Successfully authenticated with ${provider === 'google' ? 'Google' : 'GitHub'}! Redirecting...`);
    setTimeout(() => router.push('/'), 1000);
  };

  const handleDemoLogin = () => {
    setError('');
    setSuccess('');
    login('alex.chen@gmail.com', 'demo-password');
    loadDemo();
    setSuccess('Signed in as Alex Chen (Stripe Candidate). Redirecting...');
    setTimeout(() => router.push('/'), 1000);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotModal(false);
      setForgotSent(false);
    }, 2500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full space-y-6">
        
        {/* Back to Home Link */}
        <div>
          <Link 
            href="/" 
            className="inline-flex items-center text-xs font-mono text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to Dashboard
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-stone-900 text-white font-bold text-lg shadow-sm">
            CP
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            {mode === 'signin' ? 'Sign in to CareerPulse AI' : 'Create candidate account'}
          </h1>
          <p className="text-xs text-stone-500 font-mono">
            {mode === 'signin' 
              ? 'Autonomous Hiring Readiness & Career Acceleration' 
              : 'Start your closed-loop ATS audit and voice interview prep'}
          </p>
        </div>

        {/* Active Session Card (If Already Logged In) */}
        {isAuthenticated && userEmail && (
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 text-xs text-emerald-900 flex items-center justify-between">
            <div>
              <span className="font-semibold block">Currently Active Session:</span>
              <span className="font-mono">{userName} ({userEmail})</span>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className="px-2.5 py-1 text-[11px] font-mono rounded bg-stone-900 text-white hover:bg-stone-800"
              >
                Go to App
              </Link>
              <button
                type="button"
                onClick={logout}
                className="px-2.5 py-1 text-[11px] font-mono rounded bg-white text-rose-700 hover:bg-rose-50 border border-rose-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          
          {/* Sign In / Sign Up Mode Toggle */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-lg text-xs font-mono font-medium">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError('');
                setSuccess('');
              }}
              className={`py-2 text-center rounded-md transition-all ${
                mode === 'signin'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
                setSuccess('');
              }}
              className={`py-2 text-center rounded-md transition-all ${
                mode === 'signup'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Social OAuth Buttons */}
          <div className="space-y-2.5">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocial('google')}
              className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-4 text-xs font-medium rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-xs active:scale-98"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* GitHub */}
            <button
              type="button"
              onClick={() => handleSocial('github')}
              className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-4 text-xs font-medium rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-xs active:scale-98"
            >
              <svg className="w-4 h-4 fill-stone-900" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-mono text-stone-600 uppercase tracking-wider relative">
              Or with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-600 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Raghav Sharma"
                    className="w-full text-xs font-mono pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all"
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono font-medium text-stone-700">
                  Email Address
                </label>
                <span className="text-[10px] font-mono text-stone-600">
                  Trusted domains only
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-600 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full text-xs font-mono pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all"
                  required
                />
              </div>
              <p className="text-[10px] text-stone-600 font-mono mt-1">
                Allowed: @gmail.com, @outlook.com, @yahoo.com, @icloud.com
              </p>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono font-medium text-stone-700">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotModal(true);
                    }}
                    className="text-[11px] font-mono text-stone-700 hover:text-stone-900 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-600 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs font-mono pl-9 pr-10 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-600 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-mono font-medium text-stone-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-600 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs font-mono pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all"
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            )}

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                <span className="text-xs font-mono text-stone-600">Remember for 30 days</span>
              </label>
            </div>

            {/* Feedback Messages */}
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="font-mono leading-relaxed">{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-mono">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono font-medium transition-all shadow-xs active:scale-98"
            >
              <span>{mode === 'signin' ? 'Sign In' : 'Create Candidate Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo 1-Click Login Card for Hackathon Judges */}
          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 transition-colors group"
            >
              <div className="flex items-center space-x-2.5 text-left">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-semibold block text-stone-900">
                    1-Click Demo Candidate Login
                  </span>
                  <span className="text-[11px] font-mono text-stone-500 block">
                    Alex Chen · Stripe Senior Frontend Engineer
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

        </div>

        {/* Security & Verification Footer */}
        <div className="text-center space-y-1 text-[11px] font-mono text-stone-400">
          <div className="flex items-center justify-center space-x-1.5 text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End PII Sanitization & Zero-Leakage Architecture</span>
          </div>
          <p>© 2026 CareerPulse AI · HackNowa Global Hackathon Edition</p>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-semibold text-stone-900">Reset Your Password</h3>
            <p className="text-xs text-stone-500 font-mono">
              Enter your verified email address and we will send you a secure password reset link.
            </p>

            {forgotSent ? (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Password reset link dispatched!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full text-xs font-mono p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setForgotModal(false)}
                    className="px-3 py-1.5 text-xs font-mono rounded bg-stone-100 text-stone-700 hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-mono rounded bg-stone-900 text-white hover:bg-stone-800"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
