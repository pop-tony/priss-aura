import { FaTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Footer() {
  const defaultSocials = [
    { Icon: FaTwitter, href: 'https://x.com/therealtokenpop?s=11', name: 'Twitter' },
    { Icon: FaInstagram, href: 'https://www.instagram.com/tokenpop.app?igsh=MTRhaTF3dWQzY2Jkdw%3D%3D&utm_source=qr', name: 'Instagram' },
    { Icon: FaFacebookF, href: 'https://web.facebook.com/profile.php?id=61586285156793', name: 'Facebook' },
    { Icon: FaLinkedinIn, href: 'https://linkedin.com', name: 'LinkedIn' },
  ];

  const links = defaultSocials;

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div>
          <h3 className="mb-4 text-2xl font-black">Pris<span className="text-rose-500">Aura</span></h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Buy anything, anywhere.</p>
        </div>
        <div className="grid grid-cols-3 gap-8 mt-3">
          
          <div>
            <h4 className="mb-4 font-bold">Shop</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link to="/shop?category=Electronics" className="transition hover:text-black dark:hover:text-white">Electronics</Link></li>
              <li><Link to="/shop?category=Fashion" className="transition hover:text-black dark:hover:text-white">Fashion</Link></li>
              <li><Link to="/shop?category=Home" className="transition hover:text-black dark:hover:text-white">Home</Link></li>
              <li><Link to="/shop" className="transition hover:text-black dark:hover:text-white">All Categories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4 font-bold">Support</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link to="/contact" className="transition hover:text-black dark:hover:text-white">Contact Us</Link></li>
              <li><Link to="/help" className="transition hover:text-black dark:hover:text-white">Help Center</Link></li>
              <li><Link to="/buyer-protection" className="transition hover:text-black dark:hover:text-white">Buyer Protection</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold">Company</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li><Link to="/about" className="transition hover:text-black dark:hover:text-white">About Us</Link></li>
              <li><Link to="/terms" className="transition hover:text-black dark:hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="transition hover:text-black dark:hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800 md:flex-row">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">© 2026 Marketplace. All rights reserved.</p>
          <div className="flex gap-4">
            {links.map(({ Icon, href, name }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-600 transition-all hover:border-rose-500 hover:text-rose-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:border-rose-500 dark:hover:text-rose-500"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}