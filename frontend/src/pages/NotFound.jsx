import React from 'react'
import { Link } from 'react-router-dom'
import { Home, Search, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error Code */}
          <div className="text-9xl font-bold text-primary-600 mb-4">
            404
          </div>
          
          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Page Not Found
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
            Oops! The page you're looking for seems to have wandered off into the 
            Chanderi wilderness. Let's get you back on track.
          </p>
          
          {/* Search Box */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for pages..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Link 
              to="/" 
              className="card text-center p-6 hover:shadow-hard transition"
            >
              <Home className="w-8 h-8 text-primary-600 mx-auto mb-3" />
              <div className="font-medium text-gray-900">Home</div>
            </Link>
            
            <Link 
              to="/booking" 
              className="card text-center p-6 hover:shadow-hard transition"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold">B</span>
              </div>
              <div className="font-medium text-gray-900">Booking</div>
            </Link>
            
            <Link 
              to="/gallery" 
              className="card text-center p-6 hover:shadow-hard transition"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-600 font-bold">G</span>
              </div>
              <div className="font-medium text-gray-900">Gallery</div>
            </Link>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="btn-primary inline-flex items-center justify-center"
            >
              <ArrowLeft className="mr-2" />
              Back to Home
            </Link>
            
            <Link 
              to="/contact" 
              className="btn-secondary"
            >
              Contact Support
            </Link>
          </div>
          
          {/* Fun Message */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500">
              While you're here, why not explore our{' '}
              <Link to="/gallery" className="text-primary-600 hover:underline">
                gallery
              </Link>{' '}
              or check out our{' '}
              <Link to="/activities" className="text-primary-600 hover:underline">
                adventure activities
              </Link>
              ?
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound