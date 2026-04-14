import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Star, Shield, Users, Mountain, Tent } from 'lucide-react'

const Hero = () => {
  const stats = [
    { icon: <Mountain />, value: '80+', label: 'Historical Monuments' },
    { icon: <Tent />, value: '80+', label: 'Luxury Tents' },
    { icon: <Shield />, value: '80+', label: 'Adventure Activities' },
    { icon: <Users />, value: '5000+', label: 'Happy Guests' },
  ]

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=2070&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary-500/10 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 text-center text-white relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium">Best Eco Retreat 2024</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 animate-slide-up">
          <span className="gradient-text">Chanderi Eco Retreat</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl lg:text-3xl mb-8 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Where <span className="text-primary-300 font-semibold">cultural heritage</span> meets{' '}
          <span className="text-primary-300 font-semibold">thrilling adventures</span> in the heart of Madhya Pradesh
        </p>
        
        {/* Description */}
        <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
          Experience luxury camping, explore ancient monuments, and immerse yourself in traditional 
          crafts at India's premier heritage adventure destination.
        </p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-primary-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center mb-2">
                <div className="text-primary-300">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <Link 
            to="/booking" 
            className="inline-flex items-center justify-center btn-primary text-lg px-8 py-4 group"
          >
            <span>Book Your Adventure Now</span>
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/gallery" 
            className="inline-flex items-center justify-center btn-secondary text-lg px-8 py-4"
          >
            <span>View Gallery</span>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-300 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Verified & Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>4.8/5 Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-300 mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </section>
  )
}

export default Hero