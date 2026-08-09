'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Banner } from '@/types';

const ROTATE_MS = 5000;

export function Hero({ banners = [] }: { banners?: Banner[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % banners.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) {
    return <StaticHero />;
  }

  const current = banners[index];

  return (
    <section className="relative h-[70vh] min-h-[420px] overflow-hidden bg-brand-black text-brand-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image src={current.image_url} alt={current.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full flex flex-col items-center justify-end pb-20 text-center px-4">
        <motion.h1
          key={`${current.id}-title`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-3xl sm:text-5xl max-w-2xl"
        >
          {current.title}
        </motion.h1>
        {current.subtitle && (
          <motion.p
            key={`${current.id}-subtitle`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 text-white/80 text-sm sm:text-base"
          >
            {current.subtitle}
          </motion.p>
        )}
        <Link
          href={current.link_url || '/products'}
          className="mt-6 bg-brand-gold text-brand-black font-medium text-sm px-7 py-3 rounded-full hover:bg-brand-gold-light transition-colors"
        >
          Shop Now
        </Link>

        {banners.length > 1 && (
          <div className="flex gap-2 mt-8">
            {banners.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-brand-gold' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StaticHero() {
  return (
    <section className="relative overflow-hidden bg-brand-black text-brand-white">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-charcoal to-brand-black" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-brand-pink/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-28 sm:py-36 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4"
        >
          New Season Collection
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl leading-tight max-w-3xl mx-auto"
        >
          Elegance in <span className="text-gradient-gold">Every Step</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 text-white/70 max-w-xl mx-auto text-sm sm:text-base"
        >
          Discover premium shoes, bags, and accessories — handpicked for women who
          value quality and style. Order directly on WhatsApp.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <Link
            href="/products"
            className="bg-brand-gold text-brand-black font-medium text-sm px-7 py-3 rounded-full hover:bg-brand-gold-light transition-colors"
          >
            Shop the Collection
          </Link>
          <Link
            href="/about"
            className="border border-white/30 text-white text-sm px-7 py-3 rounded-full hover:border-brand-gold hover:text-brand-gold transition-colors"
          >
            Our Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}