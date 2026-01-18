
import React, { useState } from 'react';
import { z } from 'zod';
import { Link } from '@tanstack/react-router';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

interface LoginProps {
  onComplete: () => void;
}

const Login: React.FC<LoginProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: any = {};
      // Fix: ZodError uses 'issues' instead of 'errors' in modern versions of Zod.
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onComplete();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px] bg-white dark:bg-[#2d1a1a] p-8 md:p-12 rounded-xl shadow-2xl border border-white dark:border-white/5 animate-in fade-in zoom-in duration-500">
        <div className="mb-10 text-center">
          <h1 className="text-[#181111] dark:text-white tracking-tight text-[32px] font-bold leading-tight pb-3">Welcome Back</h1>
          <p className="text-[#181111]/70 dark:text-white/60 text-base font-normal">Enter your credentials to access your AR identity.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-[#181111] dark:text-white/90 text-sm font-semibold px-1">Email Address</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-primary/60">mail</span>
              <input 
                className={`form-input w-full rounded-full border bg-white dark:bg-white/5 h-14 pl-12 pr-6 text-[#181111] dark:text-white placeholder:text-[#886364]/50 transition-all ${
                  errors.email ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#e5dcdc] dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
                placeholder="hello@example.com" 
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider px-4">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#181111] dark:text-white/90 text-sm font-semibold px-1">Password</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-primary/60">lock</span>
              <input 
                className={`form-input w-full rounded-full border bg-white dark:bg-white/5 h-14 pl-12 pr-6 text-[#181111] dark:text-white placeholder:text-[#886364]/50 transition-all ${
                  errors.password ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#e5dcdc] dark:border-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
                placeholder="••••••••" 
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
            {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider px-4">{errors.password}</p>}
          </div>

          <div className="pt-4">
            <button className="w-full flex cursor-pointer items-center justify-center rounded-full h-14 bg-primary text-white text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all" type="submit">
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#181111]/70 dark:text-white/60">
            Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;