import React, { useState } from 'react';
import { Shield, Mail, Lock, User, LogIn, Sparkles, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithEmail, signupWithEmail, loginWithGoogle, loginAsDemoUser } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'signin') {
        await loginWithEmail(email, password);
      } else {
        if (!name.trim()) {
          setError('Name is required');
          return;
        }
        await signupWithEmail(email, password, name.trim());
      }
      onClose();
    } catch {
      setError('Authentication failed. Check credentials.');
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch {
      setError('Google authentication error.');
    }
  };

  const handleDemo = (persona: 'founder' | 'student') => {
    loginAsDemoUser(persona);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1B0F03]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#4D2A00] border border-[#6E3B00] rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#F9E6A8]/60 hover:text-[#F9E6A8] hover:bg-[#331C00] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#1B0F03] border border-[#CC6F00] flex items-center justify-center shadow-inner">
            <Shield className="w-5 h-5 text-[#F2A900]" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#F9E6A8] tracking-tight">
              Daily Discipline
            </h2>
            <span className="text-xs text-[#F9E6A8]/70">
              Private, zero-compromise performance tracking
            </span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#1B0F03] p-1 rounded-xl mb-5 border border-[#6E3B00]/60">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              mode === 'signin'
                ? 'bg-[#CC6F00] text-[#1B0F03]'
                : 'text-[#F9E6A8]/60 hover:text-[#F9E6A8]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              mode === 'signup'
                ? 'bg-[#CC6F00] text-[#1B0F03]'
                : 'text-[#F9E6A8]/60 hover:text-[#F9E6A8]'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-950/80 border border-red-500/50 rounded-lg text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] font-semibold text-[#F9E6A8]/80 uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#F9E6A8]/40 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1B0F03] border border-[#6E3B00] rounded-lg pl-9 pr-3 py-2 text-sm text-[#F9E6A8] focus:outline-none focus:border-[#F2A900]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-[#F9E6A8]/80 uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#F9E6A8]/40 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@discipline.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1B0F03] border border-[#6E3B00] rounded-lg pl-9 pr-3 py-2 text-sm text-[#F9E6A8] focus:outline-none focus:border-[#F2A900]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#F9E6A8]/80 uppercase tracking-wider block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#F9E6A8]/40 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1B0F03] border border-[#6E3B00] rounded-lg pl-9 pr-3 py-2 text-sm text-[#F9E6A8] focus:outline-none focus:border-[#F2A900]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 py-2.5 bg-[#CC6F00] hover:bg-[#F2A900] text-[#1B0F03] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Initialize Account & Seed Routine'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#6E3B00]/60" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-[#F9E6A8]/50">
            <span className="bg-[#4D2A00] px-2">Or continue with</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogle}
          className="w-full py-2.5 bg-[#1B0F03] hover:bg-[#331C00] border border-[#6E3B00] text-[#F9E6A8] rounded-lg text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors mb-3"
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

        {/* Quick Demo Personas */}
        <div className="pt-3 border-t border-[#6E3B00]/60 flex flex-col gap-1.5">
          <span className="text-[10px] text-[#F9E6A8]/60 font-semibold uppercase tracking-wider block text-center">
            Instant Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemo('founder')}
              className="px-2.5 py-1.5 bg-[#1B0F03]/90 hover:bg-[#331C00] border border-[#6E3B00]/70 rounded-lg text-[11px] text-[#F9E6A8] transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-[#F2A900]" />
              <span>Alex Rivera</span>
            </button>
            <button
              onClick={() => handleDemo('student')}
              className="px-2.5 py-1.5 bg-[#1B0F03]/90 hover:bg-[#331C00] border border-[#6E3B00]/70 rounded-lg text-[11px] text-[#F9E6A8] transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-[#F2A900]" />
              <span>Tariq Mansour</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
