'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { success: false as const, error: 'Invalid email or password' };
  }

  // Confirm this user is a registered, active admin
  const { data: admin } = await supabase
    .from('admins')
    .select('id, is_active')
    .eq('id', data.user.id)
    .single();

  if (!admin || !admin.is_active) {
    await supabase.auth.signOut();
    return { success: false as const, error: 'This account is not authorized for admin access' };
  }

  redirect('/admin/dashboard');
}

export async function signOutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}