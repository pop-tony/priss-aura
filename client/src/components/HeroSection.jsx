import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative h-100 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
      <img
        src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600"
        alt="Marketplace"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="mb-4 text-sm uppercase tracking-[0.3em]">Your One-Stop Shop</p>
          <h1 className="mb-8 text-5xl font-black md:text-7xl">Everything You Need</h1>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate('/shop')}
              className="cursor-pointer rounded-full bg-white px-8 py-4 font-bold text-black transition hover:bg-zinc-200"
            >
              Shop Now
            </button>
            <button
              onClick={() => navigate('/shop?category=trending')}
              className="cursor-pointer rounded-full border-2 border-white px-8 py-4 font-bold text-white transition hover:bg-white hover:text-black"
            >
              Trending Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}