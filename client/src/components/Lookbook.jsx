import { useNavigate } from 'react-router-dom';

const collections = [
  {
    title: "Tech Essentials",
    desc: "Latest gadgets and accessories",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    link: "/shop?category=electronics"
  },
  {
    title: "Home & Living",
    desc: "Transform your space",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    link: "/shop?category=home"
  },
  {
    title: "Sports & Outdoors",
    desc: "Gear for every adventure",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    link: "/shop?category=sports"
  },
];

export default function Lookbook() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-black md:text-6xl">Collections</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Shop by category</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((col, idx) => (
            <div
              key={idx}
              onClick={() => navigate(col.link)}
              className="group cursor-pointer overflow-hidden"
            >
              <div className="aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={col.image}
                  alt={col.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>
              <div className="pt-6">
                <h3 className="mb-2 text-2xl font-black">{col.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{col.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}