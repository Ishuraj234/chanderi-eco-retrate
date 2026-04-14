import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import { Mail, Phone, MapPin, Heart, Send, ChevronRight } from 'lucide-react'
import { contactApi } from '../services/api'
import toast from 'react-hot-toast'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Booking', path: '/booking' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Cancellation Policy', path: '/cancellation' },
  ]

  const activities = [
    'Heritage Tours',
    'Adventure Sports',
    'Textile Workshops',
    'Cultural Nights',
    'Nature Walks',
    'Camping',
    'Photography Tours',
    'Local Cuisine'
  ]

  const socialLinks = [
    { icon: <FaFacebook size={20} />, name: 'Facebook', url: 'https://facebook.com' },
    { icon: <FaInstagram size={20} />, name: 'Instagram', url: 'https://instagram.com' },
    { icon: <FaTwitter size={20} />, name: 'Twitter', url: 'https://twitter.com' },
    { icon: <FaYoutube size={20} />, name: 'YouTube', url: 'https://youtube.com' },
  ]

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    
    try {
      // In production, you would have a newsletter API
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Successfully subscribed to newsletter!')
      setEmail('')
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-6 text-primary-300">
              Chanderi Eco Retreat
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Experience the perfect blend of heritage, adventure, and luxury camping 
              in the heart of Madhya Pradesh. Create unforgettable memories with us.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 transition duration-300 transform hover:scale-110"
                  aria-label={social.name}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-300 transition duration-300 flex items-center group"
                  >
                    <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Activities */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Activities</h4>
            <ul className="space-y-3">
              {activities.map((activity, index) => (
                <li key={index} className="text-gray-300 hover:text-primary-300 transition duration-300">
                  {activity}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Contact Us</h4>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Chanderi Eco Retreat,<br />
                  Chanderi, Madhya Pradesh 473446
                </span>
              </div>
              
              <a href="tel:+919876543210" className="flex items-center text-gray-300 hover:text-primary-300 transition">
                <Phone className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </a>
              
              <a href="mailto:info@chanderiecoretreat.com" className="flex items-center text-gray-300 hover:text-primary-300 transition">
                <Mail className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                <span>info@chanderiecoretreat.com</span>
              </a>
            </div>
            
            {/* Newsletter */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <h5 className="font-bold mb-2 text-white">Newsletter</h5>
              <p className="text-sm text-gray-300 mb-3">
                Subscribe for exclusive offers and updates
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 pl-12 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 text-sm flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner w-5 h-5 mr-2"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Subscribe Now
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0 text-center md:text-left">
              © {currentYear} Chanderi Eco Retreat. All rights reserved.
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-300 transition duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-300 transition duration-300">
                Terms of Service
              </Link>
              <Link to="/cancellation" className="text-gray-400 hover:text-primary-300 transition duration-300">
                Cancellation Policy
              </Link>
              <Link to="/faq" className="text-gray-400 hover:text-primary-300 transition duration-300">
                FAQ
              </Link>
            </div>
          </div>
          
          {/* Made with love */}
          <div className="text-center mt-8 pt-6 border-t border-gray-800">
            <p className="text-gray-500 text-sm flex items-center justify-center">
              Made with <Heart className="w-4 h-4 mx-2 text-red-500 animate-pulse" /> 
              in Chanderi, Madhya Pradesh
            </p>
            <p className="text-gray-600 text-xs mt-2">
              GST No: 23ABCDE1234F1Z5 • Tourism License: MP/TOUR/2024/12345
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer