'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrencyCode } from '@/types';

interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'NGN',
      setCurrency: (code) => set({ currency: code }),
    }),
    { name: 'mec-currency' }
  )
);
