import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { cart, cartCount } = useCart();
  
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" },
    { href: "/orders", label: "Orders" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href) => {
    if (href.startsWith('/')) navigate(href);
    setMobileOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = mobileOpen? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
         ? 'bg-white/90 backdrop-blur-md shadow-sm dark:bg-neutral-950/90'
           : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 text-zinc-900 dark:text-white">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="cursor-pointer text-2xl font-black tracking-tight transition hover:opacity-80"
          >
            Pris<span className="text-rose-500">Aura</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => handleLinkClick(link.href)}
                className={`cursor-pointer text-sm font-semibold transition hover:text-rose-500 ${
                  location.pathname === link.href? 'text-rose-500' : ''
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Cart button */}
            <button
              onClick={() => navigate('/cart')}
              className="cursor-pointer relative rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              <ShoppingCart className="mr-2 inline h-4 w-4" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                  {cartCount > 9? '9+' : cartCount}
                </span>
              )}
            </button>

            <ThemeToggle />
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => navigate('/cart')} className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                  {cartCount > 9? '9+' : cartCount}
                </span>
              )}
            </button>

            <ThemeToggle />

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-2xl leading-none"
              aria-label="Toggle menu"
            >
              {mobileOpen? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-neutral-950/95 pt-20 md:hidden"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center gap-6 p-8 text-xl text-white"
            >

              {navLinks.map(link => (
                <button
                  key={link.href}
                  onClick={() => handleLinkClick(link.href)}
                  className="font-semibold transition hover:text-rose-500"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { handleLinkClick('/cart'); }}
                className="rounded-full bg-white px-8 py-3 font-semibold text-black transition hover:bg-neutral-200"
              >
                View Cart {cartCount > 0 && `(${cartCount})`}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}