import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
// Navbar.jsx में
import { Menu, X, Phone, MapPin, Calendar, User, LogOut } from 'lucide-react'
//                                                ^^^^ ये check करें
import { authApi } from '../services/api'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Booking', path: '/booking' },
    { name: 'Contact', path: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated())
  }, [location])

  const handleLogout = () => {
    authApi.logout()
    setIsAuthenticated(false)
    navigate('/')
    window.location.reload()
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-800 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <a href="tel:+919876543210" className="flex items-center hover:text-primary-200 transition">
                <Phone size={14} className="mr-2" />
                <span>+91 98765 43210</span>
              </a>
              <div className="hidden md:flex items-center">
                <MapPin size={14} className="mr-2" />
                <span>Chanderi, Madhya Pradesh 473446</span>
              </div>
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {authApi.getUserRole() === 'admin' ? (
                    <Link to="/admin" className="flex items-center text-sm hover:text-primary-200">
                      <User size={14} className="mr-1" />
                      Dashboard
                    </Link>
                  ) : (
                    <span className="flex items-center text-sm px-2">
                        <User size={14} className="mr-1" /> Settings
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-sm hover:text-primary-200 ml-4"
                  >
                    <LogOut size={14} className="mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-4">
                  <Link to="/login" className="text-sm hover:text-primary-200 flex items-center">
                      <User size={14} className="mr-1" /> Login
                  </Link>
                  <Link to="/register" className="text-sm hover:text-primary-200 flex items-center bg-primary-700 px-3 py-1 rounded-full text-white shadow-sm">
                      Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-bold text-primary-700 group-hover:text-primary-800 transition">
                  Chanderi Eco Retreat
                </span>
                <span className="text-xs text-gray-500 group-hover:text-gray-600 transition">
                  Heritage • Adventure • Luxury Camping
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium transition duration-300 relative group ${
                    location.pathname === item.path
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-600 transition-all duration-300 ${
                    location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              ))}
              <Link
                to="/booking"
                className="btn-primary px-6 py-2.5 text-sm flex items-center"
              >
                <Calendar size={16} className="mr-2" />
                Book Now
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 hover:text-primary-600 transition"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden bg-white border-t shadow-lg">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-3 rounded-lg text-base font-medium transition ${
                      location.pathname === item.path
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to="/booking"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 btn-primary text-center"
                >
                  <Calendar size={18} className="inline mr-2" />
                  Book Now
                </Link>
                {isAuthenticated ? (
                  <>
                    {authApi.getUserRole() === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <User size={18} className="inline mr-2" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        handleLogout()
                      }}
                      className="block w-full text-left px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <LogOut size={18} className="inline mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <User size={18} className="inline mr-2" /> Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <User size={18} className="inline mr-2" /> Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar