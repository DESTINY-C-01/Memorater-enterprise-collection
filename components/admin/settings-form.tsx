'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { updateSettings } from '@/actions/update-settings';

interface SettingsFormProps {
  initialSiteName: string;
  initialTagline: string;
  initialWhatsappNumber: string;
  initialBaseCurrency: string;
}

const CURRENCIES = ['NGN', 'GHS', 'XOF'];

export function SettingsForm({
  initialSiteName,
  initialTagline,
  initialWhatsappNumber,
  initialBaseCurrency,
}: SettingsFormProps) {
  const [siteName, setSiteName] = useState(initialSiteName);
  const [tagline, setTagline] = useState(initialTagline);
  const [whatsappNumber, setWhatsappNumber] = useState(initialWhatsappNumber);
  const [baseCurrency, setBaseCurrency] = useState(initialBaseCurrency);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const result = await updateSettings({ siteName, tagline, whatsappNumber, baseCurrency });
    setSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Settings saved');
  }

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <label className="text-sm font-medium block mb-1.5">Site Name</label>
        <input
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Tagline</label>
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Reference WhatsApp Number</label>
        <input
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          placeholder="e.g. 22892333067"
          className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
        />
        <p className="text-xs text-brand-black/40 mt-1">
          For your own reference only — the live checkout flow uses the number set in{' '}
          <code>lib/site-config.ts</code>.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1.5">Base Currency</label>
        <select
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
          className="w-full border border-black/15 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-brand-black text-white px-6 py-3 rounded-full text-sm hover:bg-brand-gold hover:text-brand-black transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  );
}