import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { allProducts } from '../data/products';
import { Search, X, ArrowRight } from 'lucide-react';

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Toys', 'Books', 'Beauty', 'Tools'];

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const querySearch = searchParams.get('search') || '';
    setSearch(querySearch);
  }, [searchParams]);

  const isFiltered = activeCategory!== 'All' || search.trim();

  const filtered = useMemo(() => {
    let result = allProducts;

    if (activeCategory!== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.seller?.toLowerCase().includes(query) ||
        p.details?.some(d => d.toLowerCase().includes(query))
      );
    }

    return result;
  }, [activeCategory, search]);

  // Group products into sections when not filtering
  const sections = useMemo(() => {
    if (isFiltered) return [];

    return [
      {
        title: "Trending Now",
        products: allProducts.filter(p => p.tags?.includes('trending')).slice(0, 8),
        link: "/shop?category=All"
      },
      {
        title: "Electronics",
        products: allProducts.filter(p => p.category === 'Electronics').slice(0, 8),
        link: "/shop?category=Electronics"
      },
      {
        title: "Fashion",
        products: allProducts.filter(p => p.category === 'Fashion').slice(0, 8),
        link: "/shop?category=Fashion"
      },
      {
        title: "Home Essentials",
        products: allProducts.filter(p => p.category === 'Home').slice(0, 8),
        link: "/shop?category=Home"
      }
    ].filter(s => s.products.length > 0);
  }, [isFiltered]);

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  const clearSearch = () => {
    setSearch('');
    navigate('/shop');
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSearch('');
    navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 pt-24">
        {/* Header + Search inline */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h1 className="mb-2 text-4xl font-black tracking-tight md:text-5xl">
              {isFiltered? 'Search Results' : 'Shop All Products'}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {search? `Results for "${search}"` :
               activeCategory!== 'All'? `${activeCategory} Collection` :
               'Everything you need in one place'}
            </p>
            {isFiltered && filtered.length > 0 && (
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">{filtered.length} products found</p>
            )}
          </div>

          {/* Search */}
          <div className="w-full lg:w-96">
            <div className="flex rounded-full border-2 border-zinc-300 bg-zinc-50 focus-within:border-rose-500 dark:border-zinc-700 dark:bg-zinc-900">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search products..."
                className="flex-1 bg-transparent px-5 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="p-2 text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-300"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={handleSearch}
                className="m-1 rounded-full bg-black px-5 py-2 text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Show sections when NOT filtering, flat grid when filtering */}
        {!isFiltered? (
          <div className="space-y-16">
            {sections.map((section, idx) => (
              <div key={idx}>
                <div className="mb-6 flex items-end justify-between">
                  <h2 className="text-2xl font-black md:text-3xl">{section.title}</h2>
                  <button
                    onClick={() => navigate(section.link)}
                    className="hidden items-center gap-2 text-sm font-bold hover:text-rose-500 md:flex"
                  >
                    View All <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex gap-4 hide-scrollbar overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-3 md:gap-6 md:overflow-visible lg:grid-cols-4">
                  {section.products.map(product => (
                    <div key={product.id} className="w-64 flex-shrink-0 md:w-auto">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center md:hidden">
                  <button
                    onClick={() => navigate(section.link)}
                    className="cursor-pointer  text-sm font-bold text-rose-500 hover:underline"
                  >
                    View All {section.title} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {filtered.length === 0? (
              <div className="py-32 text-center">
                <p className="mb-4 text-xl text-zinc-500 dark:text-zinc-400">No products found</p>
                <button
                  onClick={() => { setSearch(''); setActiveCategory('All'); navigate('/shop'); }}
                  className="text-sm font-semibold text-rose-500 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}