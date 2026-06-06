import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { allProducts } from '../data/products';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports', 'Toys', 'Books', 'Beauty', 'Tools'];
const INITIAL_SHOW = 8; // How many to show before "Show More"

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read from URL
  const urlCategory = searchParams.get('category') || 'All';
  const urlSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [showAll, setShowAll] = useState({}); // Track expanded state per category

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory!== 'All') params.set('category', activeCategory);
    if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
    setSearchParams(params, { replace: true });
  }, [activeCategory, debouncedSearch, setSearchParams]);

  // Update state when URL changes (back/forward)
  useEffect(() => {
    setActiveCategory(urlCategory);
    setSearchInput(urlSearch);
    setDebouncedSearch(urlSearch);
  }, [urlCategory, urlSearch]);

  const isSearching = debouncedSearch.trim();
  const isFiltered = activeCategory!== 'All' || isSearching;

  // Filter products based on category + search
  const filtered = useMemo(() => {
    let result = allProducts;

    if (activeCategory!== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (isSearching) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.seller?.toLowerCase().includes(query) ||
        p.details?.some(d => d.toLowerCase().includes(query))
      );
    }

    return result;
  }, [activeCategory, debouncedSearch, isSearching]);

  // Sections for "All" view
  const sections = useMemo(() => {
    if (isFiltered) return [];

    return [
      {
        title: "Trending Now",
        category: 'Trending',
        products: allProducts.filter(p => p.tags?.includes('trending'))
      },
      {
        title: "Electronics",
        category: 'Electronics',
        products: allProducts.filter(p => p.category === 'Electronics')
      },
      {
        title: "Fashion",
        category: 'Fashion',
        products: allProducts.filter(p => p.category === 'Fashion')
      },
      {
        title: "Home Essentials",
        category: 'Home',
        products: allProducts.filter(p => p.category === 'Home')
      },
      {
        title: "Sports",
        category: 'Sports',
        products: allProducts.filter(p => p.category === 'Sports')
      },
      {
        title: "Beauty",
        category: 'Beauty',
        products: allProducts.filter(p => p.category === 'Beauty')
      }
    ].filter(s => s.products.length > 0);
  }, [isFiltered]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSearchInput('');
    setDebouncedSearch('');
    setShowAll({}); // Reset expand states
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleShowAll = (key) => {
    setShowAll(prev => ({
     ...prev,
      [key]:!prev[key]
    }));
  };

  const clearSearch = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setActiveCategory('All');
    setShowAll({});
  };

  // Products to show when filtered
  const visibleFiltered = showAll['filtered']? filtered : filtered.slice(0, INITIAL_SHOW);
  const canShowMoreFiltered = filtered.length > INITIAL_SHOW;

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 pt-24">
        {/* Header + Search */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h1 className="mb-2 text-4xl font-black tracking-tight md:text-5xl">
              {isSearching? 'Search Results' : activeCategory!== 'All'? activeCategory : 'Shop All Products'}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {isSearching
               ? `Results for "${debouncedSearch}"`
                : activeCategory!== 'All'
               ? `${filtered.length} products in ${activeCategory}`
                : 'Everything you need in one place'}
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent px-5 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white dark:placeholder:text-zinc-500"
              />
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="p-2 text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-300"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="m-1 rounded-full bg-black p-2 text-white dark:bg-white dark:text-black">
                <Search className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <CategoryFilter
            categories={categories}
            active={activeCategory}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Content: Filtered grid OR Sections */}
        {isFiltered? (
          <>
            {filtered.length === 0? (
              <div className="py-32 text-center">
                <p className="mb-4 text-xl text-zinc-500 dark:text-zinc-400">No products found</p>
                <button
                  onClick={clearSearch}
                  className="text-sm font-semibold text-rose-500 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <motion.div layout className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                  <AnimatePresence initial={false}>
                    {visibleFiltered.map((product, i) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: i * 0.02 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {canShowMoreFiltered && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => toggleShowAll('filtered')}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-zinc-300 px-8 py-3 font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
                    >
                      {showAll['filtered']? (
                        <>Show Less <ChevronUp className="h-4 w-4" /></>
                      ) : (
                        <>Show All {filtered.length} Products <ChevronDown className="h-4 w-4" /></>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="space-y-12">
          {sections.map((section, idx) => {
            const isExpanded = showAll[section.category];
            const displayProducts = isExpanded ? section.products : section.products;
            const hasMore = section.products.length > 4;

            return (
              <div key={idx} className="product-section">
                <div className="mb-6 flex items-end justify-between">
                  <h2 className="text-2xl font-black md:text-3xl">{section.title}</h2>
                  {hasMore && (
                    <button
                      onClick={() => toggleShowAll(section.category)}
                      className="flex items-center gap-2 text-sm font-bold hover:text-rose-500"
                    >
                      {isExpanded ? (
                        <>Show Less <ChevronUp className="h-4 w-4" /></>
                      ) : (
                        <>View All {section.products.length} <ChevronDown className="h-4 w-4" /></>
                      )}
                    </button>
                  )}
                </div>

                <div
                  className={`${
                    isExpanded
                      ? 'grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4'
                      : 'flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin'
                  }`}
                >
                  <AnimatePresence initial={false}>
                    {(isExpanded ? displayProducts : displayProducts).map((product, i) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: i * 0.02 }}
                        className={!isExpanded ? 'w-64 flex-shrink-0 snap-start' : ''}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}