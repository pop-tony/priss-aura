
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import ShopPage from './pages/ShopPage' 
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import { OrderProvider } from './context/OrderContext'
import { Admin } from './pages/Admin'
import OrderDetails from './pages/OrderDetails'
import ProductDetails from './pages/ProductDetails' 
import Lookbook from './components/Lookbook'
import InquiryPage from './pages/InquiryPage'
import { Orders } from './pages/Orders'
import AboutUs from './pages/AboutUs'
import Terms from './pages/Terms'
import PrivacyPolicy from './pages/PrivacyPolicy'

function AppContent() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <NavBar />
      <main className="flex-1">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/shop' element={<ShopPage />} />
          <Route path='/lookbook' element={<Lookbook />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/order/:id' element={<OrderDetails />} />
          <Route path='/contact' element={<InquiryPage />} />
          <Route path='/about' element={<AboutUs />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <OrderProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </OrderProvider>
    </ThemeProvider>
  )
}

export default App