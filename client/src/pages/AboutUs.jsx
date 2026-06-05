import React from 'react'
import { motion } from 'framer-motion';
import { Store, Users, Truck, ShieldCheck } from 'lucide-react';

export default function AboutUs() {

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-orange-50 px-4 py-32 dark:from-zinc-900 dark:to-black">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <h1 className="mb-4 text-5xl font-black tracking-tight">About Pris Aura Store</h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Your trusted marketplace for quality essentials
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16 rounded-2xl bg-zinc-50 p-8 dark:bg-zinc-900"
          >
            <h2 className="mb-4 text-2xl font-bold">Our Story</h2>
            <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
              <p>
                Pris Aura started in 2022 with a simple idea: shopping for everyday essentials 
                shouldn't be complicated. We were tired of overpriced products, unreliable delivery, 
                and poor customer service from big retailers.
              </p>
              <p>
                So we built a store that puts customers first. We carefully source products across 
                categories — home goods, electronics, personal care, kitchen, and more — testing 
                everything ourselves before it hits our shelves.
              </p>
              <p>
                Today we serve thousands of customers across Ghana, delivering quality products 
                at fair prices with the kind of service you'd expect from your neighborhood shop, 
                not a faceless corporation.
              </p>
            </div>
          </motion.div>

          <div className="mb-16 grid gap-6 md:grid-cols-2">
            {[
              {
                icon: Store,
                title: 'Curated Selection',
                desc: 'We stock what you actually need. No junk, no filler — just quality products we trust and use ourselves.'
              },
              {
                icon: Users,
                title: 'Customer First',
                desc: 'Real humans answer your calls. We solve problems fast and treat you like a neighbor, not a transaction.'
              },
              {
                icon: Truck,
                title: 'Reliable Delivery',
                desc: 'Fast, trackable shipping across Ghana. Free delivery on orders over ₵500. Your items arrive when we say they will.'
              },
              {
                icon: ShieldCheck,
                title: 'Quality Guarantee',
                desc: 'Not happy? Return it within 14 days. No questions asked. We stand behind every product we sell.'
              }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <item.icon className="mb-4 h-8 w-8 text-rose-500" />
                <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mx-auto max-w-4xl px-4 py-24 text-center">
            <h2 className="mb-6 text-4xl font-black">Join The Movement</h2>
            <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
              Be part of a community that shops with intention and Aura. Follow our journey and get first access to new drops.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="/shop"
                className="rounded-full bg-black px-8 py-4 font-bold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                Shop Collection
              </a>
              <a
                href="https://instagram.com/prissora"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-black px-8 py-4 font-bold text-black transition hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                Follow @prissora
              </a>
          </div>
       </div>
      </div>
    </div>
    </div>
  );
}