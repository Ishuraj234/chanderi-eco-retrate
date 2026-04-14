import React, { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, User, Calendar, MapPin } from 'lucide-react'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      role: 'Travel Blogger @WanderlustIndia',
      content: 'An absolutely unforgettable experience! The perfect blend of heritage and adventure. The luxury tents were beyond comfortable, and the cultural tours were incredibly insightful. Will definitely return!',
      rating: 5,
      date: 'March 15, 2024',
      location: 'Mumbai, Maharashtra',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      stay: '3 Nights - Deluxe Tent'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Family Traveler',
      content: 'Perfect for our family vacation! Kids loved the camping activities, and we enjoyed the heritage tours. The staff was exceptionally helpful, and the food was delicious. Highly recommended for families!',
      rating: 5,
      date: 'February 28, 2024',
      location: 'Delhi',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=200&q=80',
      stay: '4 Nights - Family Tent'
    },
    {
      id: 3,
      name: 'Amit Patel',
      role: 'Adventure Enthusiast',
      content: 'Best adventure destination in MP! The trekking routes were challenging yet rewarding. The guides were professional and knowledgeable. Already planning my next trip with friends!',
      rating: 4,
      date: 'January 20, 2024',
      location: 'Bangalore, Karnataka',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      stay: '2 Nights - Standard Tent'
    },
    {
      id: 4,
      name: 'Meera Singh',
      role: 'Photography Group Leader',
      content: 'As a photographer, I was blown away by the opportunities here. From sunrise at historical sites to cultural events, every moment was picture-perfect. The textile workshops were a unique experience!',
      rating: 5,
      date: 'December 12, 2023',
      location: 'Kolkata, West Bengal',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
      stay: '5 Nights - Luxury Tent'
    },
    {
      id: 5,
      name: 'Vikram Mehta',
      role: 'Corporate Retreat Organizer',
      content: 'Organized a team building retreat here. The facilities were excellent, activities were well-coordinated, and food was exceptional. Great for corporate groups looking for unique experiences.',
      rating: 4,
      date: 'November 5, 2023',
      location: 'Hyderabad, Telangana',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      stay: '2 Nights - Deluxe Tents'
    }
  ]

  useEffect(() => {
    let interval
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [autoplay, testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    setAutoplay(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
    setAutoplay(false)
  }

  const goToTestimonial = (index) => {
    setCurrentIndex(index)
    setAutoplay(false)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="section bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
            Testimonials
          </span>
          <h2 className="section-title">
            What Our <span className="gradient-text">Guests Say</span>
          </h2>
          <p className="section-subtitle">
            Hear from travelers who've experienced the magic of Chanderi
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="card overflow-hidden">
            <div className="p-8 md:p-12">
              <Quote className="w-16 h-16 text-primary-200 mb-6" />
              
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Guest Info */}
                <div className="lg:col-span-1">
                  <div className="flex flex-col items-center lg:items-start">
                    <div className="relative mb-4">
                      <img
                        src={currentTestimonial.image}
                        alt={currentTestimonial.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary-100"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-primary-600 text-white p-2 rounded-full">
                        <User size={16} />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {currentTestimonial.name}
                    </h3>
                    <p className="text-gray-600 mb-3 text-center lg:text-left">
                      {currentTestimonial.role}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < currentTestimonial.rating 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    {/* Stay Details */}
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2" />
                        {currentTestimonial.date}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-2" />
                        {currentTestimonial.location}
                      </div>
                      <div className="text-primary-600 font-medium">
                        {currentTestimonial.stay}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Testimonial Content */}
                <div className="lg:col-span-2">
                  <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed italic mb-6">
                    "{currentTestimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Verified Stay • {currentTestimonial.rating}/5 Rating
                    </div>
                    
                    {/* Navigation Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevTestimonial}
                        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition"
                        aria-label="Previous testimonial"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      <div className="flex gap-1 mx-2">
                        {testimonials.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToTestimonial(index)}
                            className={`w-2 h-2 rounded-full transition ${
                              index === currentIndex 
                                ? 'bg-primary-600 w-6' 
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                          />
                        ))}
                      </div>
                      
                      <button
                        onClick={nextTestimonial}
                        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition"
                        aria-label="Next testimonial"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="card group hover:shadow-hard transition"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  "{testimonial.content}"
                </p>
                
                <div className="text-xs text-gray-500 flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {testimonial.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '5000+', label: 'Happy Guests', description: 'From 25+ countries' },
              { value: '98%', label: 'Satisfaction Rate', description: 'Based on reviews' },
              { value: '150+', label: 'Events Organized', description: 'Cultural & adventure' },
              { value: '4.8/5', label: 'Average Rating', description: 'Across platforms' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-primary-200">{stat.description}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/20 text-center">
            <p className="text-primary-200">
              Join our community of happy travelers and create your own unforgettable memories!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials