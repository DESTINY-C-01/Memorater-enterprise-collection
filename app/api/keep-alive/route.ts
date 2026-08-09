import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Pinged on a schedule by Vercel Cron (see vercel.json) so the Supabase
 * free-tier project registers activity and never auto-pauses from
 * inactivity. Deliberately tiny — just enough to count as real usage.
 */
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('settings').select('key').limit(1);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pinged_at: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}