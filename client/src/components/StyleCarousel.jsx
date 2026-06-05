// src/components/StyleCarousel.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styleLooks = [
  {
    id: 1,
    name: "Zara A.",
    handle: "@zara.styles",
    quote: "This linen set is everything. Dress it up or down — I've worn it 5 ways already.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
    productId: "'top-01'" // optional: link to actual product
  },
  {
    id: 2,
    name: "Kwesi M.",
    handle: "@kwesi.fits",
    quote: "Quality is insane for the price. The oversized tee fits exactly like the photos.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    productId: "bottom-04"
  },
  {
    id: 3,
    name: "Naa D.",
    handle: "@naa.daily",
    quote: "Finally found trousers that actually fit my waist AND length. Running back for more colors.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600",
    productId: "dress-02"
  },
];

export default function StyleCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % styleLooks.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="bg-neutral-50 px-4 py-20 text-zinc-900 dark:bg-zinc-950 dark:text-white">
      <div
        className="mx-auto max-w-4xl text-center"
        onClick={()=>setIsPaused(!isPaused)}
      >
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-rose-500">Community</p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Happy Customers</h2>
          <p className="mb-12 text-zinc-600 dark:text-zinc-400">
            Tag @prissaura to be featured
          </p>
        </div>

        <div className="relative h-100 overflow-auto rounded-2xl hide-scrollbar">
          {styleLooks.map((t, idx) => (
            
            <div
              key={t.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                idx === current? 'opacity-0' : 'opacity-100'
              }`}
            >
            
              <div className="grid h-full md:grid-cols-2">
                <img
                  src={t.image}
                  alt={t.name}
                  className={`h-full w-full object-cover ${
                    t.productId? 'cursor-pointer hover:opacity-90' : ''
                  }`}
                />
                <div className="flex flex-col bg-white p-6 text-left dark:bg-zinc-900 sm:p-8">
                  <div className="mb-5 text-lg italic leading-relaxed text-zinc-700 dark:text-zinc-200">
                    "{t.quote}"
                  </div>
                  <div className='m-5'>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-rose-500">{t.handle}</p>
                  </div>
                  <div
                  className='m-5 cursor-pointer w-fit text-sm font-semibold underline hover:text-rose-500'
                  onClick={() => navigate(`/product/${t.productId}`)}>
  
                    Shop this →

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="flex gap-3">
            {styleLooks.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === current
                 ? 'w-8 bg-black dark:bg-white'
                    : 'w-2 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600'
                }`}
                aria-label={`Go to look ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => window.open('https://instagram.com/prisaura', '_blank')}
          className="cursor-pointer mt-12 rounded-full border border-zinc-300 px-8 py-3 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Share Your Review →
        </button>
      </div>
    </section>
  );
}