import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import AdminLogin from './pages/AdminLogin';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const UserLogin = lazy(() => import('./pages/UserLogin'))
const UserRegister = lazy(() => import('./pages/UserRegister'))
const AdminRegister = lazy(() => import('./pages/AdminRegister'))

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
              {/* <Route path="/admin" element={<AdminPage />} /> */}
              <Route path="*" element={<NotFound />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/register" element={<UserRegister />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  )
}

export default App

// Add AdminLogin import


// Add route in Routes