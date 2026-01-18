
import React, { useState } from 'react';
import { z } from 'zod';
import { Link } from '@tanstack/react-router';
import { Profile } from '../types';

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  handle: z.string().min(3, 'Handle must be 3+ characters').regex(/^[a-z0-9_]+$/, 'Only letters, numbers and underscores'),
});

interface SignUpProps {
  onComplete: (data: Partial<Profile>) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    handle: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signUpSchema.safeParse(formData);
    
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
    onComplete(formData);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px] bg-white dark:bg-[#2d1a1a] p-8 md:p-12 rounded-xl shadow-2xl border border-white dark:border-white/5 animate-in fade-in zoom-in duration-500">
        <div className="mb-10">
          <h1 className="text-[#181111] dark:text-white tracking-tight text-[32px] font-bold leading-tight text-center pb-3">Join PersonAR</h1>
          <p className="text-[#181111]/70 dark:text-white/60 text-base font-normal leading-relaxed text-center">Create your AR identity profile and stand out with custom facial overlays.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-[#181111] dark:text-white/90 text-sm font-semibold px-1">Full Name</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-primary/60">person</span>
              <input 
                className={`form-input w-full rounded-full border bg-white dark:bg-white/5 h-14 pl-12 pr-6 text-[#181111] dark:text-white placeholder:text-[#886364]/50 text-base transition-all ${
                  errors.fullName ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#e5dcdc] dark:border-white/10 focus:border-primary'
                }`} 
                placeholder="Jane Doe" 
                type="text"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider px-4">{errors.fullName}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#181111] dark:text-white/90 text-sm font-semibold px-1">Email Address</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-primary/60">mail</span>
              <input 
                className={`form-input w-full rounded-full border bg-white dark:bg-white/5 h-14 pl-12 pr-6 text-[#181111] dark:text-white placeholder:text-[#886364]/50 text-base transition-all ${
                  errors.email ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#e5dcdc] dark:border-white/10 focus:border-primary'
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
            <label className="text-[#181111] dark:text-white/90 text-sm font-semibold px-1 flex justify-between">
              <span>Identity Handle</span>
            </label>
            <div className="relative flex items-center group">
              <span className="absolute left-5 text-primary font-bold text-lg">@</span>
              <input 
                className={`form-input w-full rounded-full border bg-white dark:bg-white/5 h-14 pl-10 pr-6 text-[#181111] dark:text-white placeholder:text-[#886364]/50 text-base font-bold tracking-wide ${
                  errors.handle ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#e5dcdc] dark:border-white/10 focus:border-primary'
                }`} 
                placeholder="yourname" 
                type="text"
                value={formData.handle}
                onChange={e => setFormData({...formData, handle: e.target.value})}
              />
            </div>
            {errors.handle && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider px-4">{errors.handle}</p>}
            {!errors.handle && <p className="text-[12px] text-[#181111]/50 dark:text-white/40 px-4">personar.me/@{formData.handle || 'yourname'}</p>}
          </div>

          <div className="pt-4">
            <button className="w-full flex cursor-pointer items-center justify-center rounded-full h-14 bg-primary text-white text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all" type="submit">
              Create Profile
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#181111]/70 dark:text-white/60">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;