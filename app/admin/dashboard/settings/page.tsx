import { createClient } from '@/lib/supabase/server';
import { SettingsForm } from '@/components/admin/settings-form';

interface SiteInfo {
  name?: string;
  tagline?: string;
}

async function getSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from('settings').select('*');

  const siteInfo = (data?.find((s) => s.key === 'site_info')?.value ?? {}) as SiteInfo;
  const whatsappNumber = (data?.find((s) => s.key === 'whatsapp_number')?.value ?? '') as string;
  const baseCurrency = (data?.find((s) => s.key === 'base_currency')?.value ?? 'NGN') as string;

  return {
    siteName: siteInfo.name ?? '',
    tagline: siteInfo.tagline ?? '',
    whatsappNumber,
    baseCurrency,
  };
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-display text-2xl mb-8">Settings</h1>
      <SettingsForm
        initialSiteName={settings.siteName}
        initialTagline={settings.tagline}
        initialWhatsappNumber={settings.whatsappNumber}
        initialBaseCurrency={settings.baseCurrency}
      />
    </div>
  );
}