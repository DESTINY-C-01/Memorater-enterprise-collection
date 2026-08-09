'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInAdmin } from '@/actions/auth';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await signInAdmin(formData);
    setLoading(false);

    if (result && !result.success) {
      toast.error(result.error);
      return;
    }
    router.push('/admin/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black text-brand-white px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-2xl text-gradient-gold text-center mb-1">Memorater</h1>
        <p className="text-center text-xs tracking-[0.25em] text-white/50 mb-8">ADMIN PORTAL</p>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm block mb-1.5 text-white/80">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
            />
          </div>
          <div>
            <label className="text-sm block mb-1.5 text-white/80">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold text-brand-black font-medium py-3 rounded-full text-sm hover:bg-brand-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
