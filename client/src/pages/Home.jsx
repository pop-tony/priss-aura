import React from 'react'
import HeroSection from '../components/HeroSection'
import ShopSection from '../components/ShopSection'
import StyleCarousel from '../components/StyleCarousel'

const Home = () => {
  return (
    <>
      <HeroSection />
      
      <section id="about" className="bg-white px-4 py-20 text-zinc-900 dark:bg-black dark:text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold tracking-tight">Why Shop With Us</h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            We sell quality and super affordable products across Ghana. From electronics to home goods, 
            find everything you need from us. Fast delivery, secure payments, 
            and buyer protection on every order.
          </p>
          
          <div className="mt-12 flex justify-between items-center">
            <div>
              <div className="mb-3 text-4xl font-black text-rose-500">10k+</div>
              <p className="text-sm font-semibold">Products Listed</p>
            </div>
            <div>
              <div className="mb-3 text-4xl font-black text-rose-500">500+</div>
              <p className="text-sm font-semibold">Sales Made</p>
            </div>
            <div>
              <div className="mb-3 text-4xl font-black text-rose-500">24hr</div>
              <p className="text-sm font-semibold">Fast Delivery</p>
            </div>
          </div>
        </div>
      </section>
      
      <ShopSection />
      <StyleCarousel />
    </>
  )
}

export default Home