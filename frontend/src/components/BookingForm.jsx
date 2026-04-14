import React, { useState, useEffect } from 'react'
// BookingForm.jsx में import section update करें
import { 
  Calendar, Users, Home, Phone, Mail, 
  Check, AlertCircle, CreditCard, Shield,
  Calculator, Clock, Package, MapPin,
  User, Compass, Coffee, Flame, Map, Filter
} from 'lucide-react'
import { bookingApi } from '../services/api'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: null,
    checkOut: null,
    guests: 1,
    tentType: 'standard',
    specialRequests: '',
    extraFeatures: []
  })

  const [filterPrice, setFilterPrice] = useState('all')
  const [filterCapacity, setFilterCapacity] = useState('all')

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [bookingSummary, setBookingSummary] = useState(null)

  const tentTypes = [
    { 
      id: 'standard', 
      name: 'Standard Tent', 
      price: 2999, 
      capacity: '2 Adults',
      features: ['Basic Amenities', 'Shared Bathroom', 'Garden View'],
      description: 'Comfortable tent with basic amenities'
    },
    { 
      id: 'deluxe', 
      name: 'Deluxe Tent', 
      price: 4499, 
      capacity: '2 Adults + 1 Child',
      features: ['Attached Bathroom', 'Private Veranda', 'Garden View', 'AC'],
      description: 'Spacious tent with private facilities'
    },
    { 
      id: 'family', 
      name: 'Family Tent', 
      price: 6999, 
      capacity: '4 Adults',
      features: ['2 Rooms', '2 Bathrooms', 'Living Area', 'AC', 'Private Garden'],
      description: 'Perfect for families and groups'
    },
    { 
      id: 'luxury', 
      name: 'Luxury Tent', 
      price: 9999, 
      capacity: '2 Adults',
      features: ['King Bed', 'Jacuzzi', 'Butler Service', 'Premium Dining', 'Panoramic View'],
      description: 'Ultimate luxury experience'
    }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number (10 digits required)'
    
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required'
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required'
    if (formData.checkIn && formData.checkOut && formData.checkIn >= formData.checkOut) {
      newErrors.checkOut = 'Check-out must be after check-in'
    }
    
    if (formData.guests < 1 || formData.guests > 10) newErrors.guests = 'Guests must be 1-10'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    calculateSummary()
  }, [formData.checkIn, formData.checkOut, formData.tentType, formData.guests, formData.extraFeatures])

  const calculateNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const diffTime = Math.abs(formData.checkOut - formData.checkIn)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }
    return 0
  }

  const availableExtras = [
    { id: 'meals', name: 'All Meals (Breakfast, Lunch, Dinner)', price: 1500, icon: <Coffee size={18}/> },
    { id: 'safari', name: 'Jungle Safari', price: 2500, icon: <Compass size={18}/> },
    { id: 'bonfire', name: 'Private Bonfire', price: 800, icon: <Flame size={18}/> },
    { id: 'guide', name: 'Local Tour Guide', price: 1200, icon: <Map size={18}/> }
  ];

  const handleExtraToggle = (featureId) => {
    setFormData(prev => {
      const current = prev.extraFeatures || [];
      const updated = current.includes(featureId) 
        ? current.filter(id => id !== featureId) 
        : [...current, featureId];
      return { ...prev, extraFeatures: updated };
    });
  };

  const calculateSummary = () => {
    const nights = calculateNights()
    const selectedTent = tentTypes.find(t => t.id === formData.tentType)
    
    let extraTotal = 0;
    if (formData.extraFeatures && formData.extraFeatures.length > 0) {
      formData.extraFeatures.forEach(featureId => {
        const featureObj = availableExtras.find(f => f.id === featureId);
        if(featureObj) extraTotal += featureObj.price;
      });
    }

    if (nights > 0 && selectedTent) {
      const basePrice = nights * selectedTent.price
      const totalBeforeTax = basePrice + extraTotal
      const tax = totalBeforeTax * 0.18 // 18% GST
      const serviceCharge = totalBeforeTax * 0.05 // 5% service charge
      const total = totalBeforeTax + tax + serviceCharge
      
      setBookingSummary({
        nights,
        basePrice,
        extraTotal,
        tax,
        serviceCharge,
        total,
        perNight: selectedTent.price,
        tent: selectedTent
      })
    } else {
      setBookingSummary(null)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!validateForm()) {
    toast.error('Please fix the errors in the form')
    return
  }

  setLoading(true)

  try {
    const bookingData = {
      ...formData,
      checkIn: formData.checkIn ? formData.checkIn.toISOString() : null,
      checkOut: formData.checkOut ? formData.checkOut.toISOString() : null,
      totalAmount: bookingSummary?.total || 0
    }

    console.log('📤 Sending booking data:', bookingData)
    
    const response = await bookingApi.createBooking(bookingData)
    
    if (response.success) {
      toast.success('Booking submitted successfully! We will contact you shortly.')
      
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        checkIn: null,
        checkOut: null,
        guests: 1,
        tentType: 'standard',
        specialRequests: '',
        extraFeatures: []
      })
      setErrors({})
      setBookingSummary(null)
      
      setTimeout(() => setSubmitted(false), 8000)
    } else {
      throw new Error(response.message || 'Booking failed')
    }
  } catch (error) {
    console.error('❌ Booking error:', error)
    toast.error(error.message || 'Failed to submit booking. Please try again.')
  } finally {
    setLoading(false)
  }
}

  const selectedTent = tentTypes.find(t => t.id === formData.tentType)

  return (
    <section id="booking" className="section bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
            Book Your Stay
          </span>
          <h2 className="section-title">
            Reserve Your <span className="gradient-text">Unforgettable Experience</span>
          </h2>
          <p className="section-subtitle">
            Fill out the form below to book your stay at Chanderi Eco Retreat
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="card text-center p-8 md:p-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  Booking Request Submitted!
                </h3>
                <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                  Thank you for your booking request. Our team will contact you within 24 hours 
                  to confirm your reservation and provide payment details.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-lg mx-auto">
                  <h4 className="font-bold text-blue-800 mb-2">What's Next?</h4>
                  <ul className="text-sm text-blue-700 space-y-1 text-left">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      We'll call you to confirm details
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      Send payment link via email/SMS
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      Receive booking confirmation
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                      Prepare for your adventure!
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary"
                >
                  Make Another Booking
                </button>
              </div>
            ) : (
              <div className="card">
                <div className="p-6 md:p-8">
                  <form onSubmit={handleSubmit}>
                    {/* Personal Information */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Personal Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="label">
                            Full Name *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className={`input ${errors.name ? 'input-error' : ''}`}
                              placeholder="Enter your full name"
                            />
                            {errors.name && (
                              <div className="error-text flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.name}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="label">
                            Email Address *
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className={`input ${errors.email ? 'input-error' : ''}`}
                              placeholder="Enter your email"
                            />
                            <Mail className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                            {errors.email && (
                              <div className="error-text flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="label">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`input ${errors.phone ? 'input-error' : ''}`}
                            placeholder="Enter 10-digit phone number"
                          />
                          <Phone className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                          {errors.phone && (
                            <div className="error-text flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Booking Details
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="label">
                            Check-in Date *
                          </label>
                          <div className="relative">
                            <DatePicker
                              selected={formData.checkIn}
                              onChange={(date) => handleDateChange(date, 'checkIn')}
                              minDate={new Date()}
                              dateFormat="dd/MM/yyyy"
                              className={`input ${errors.checkIn ? 'input-error' : ''}`}
                              placeholderText="Select check-in date"
                            />
                            <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                            {errors.checkIn && (
                              <div className="error-text flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.checkIn}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <label className="label">
                            Check-out Date *
                          </label>
                          <div className="relative">
                            <DatePicker
                              selected={formData.checkOut}
                              onChange={(date) => handleDateChange(date, 'checkOut')}
                              minDate={formData.checkIn || new Date()}
                              dateFormat="dd/MM/yyyy"
                              className={`input ${errors.checkOut ? 'input-error' : ''}`}
                              placeholderText="Select check-out date"
                            />
                            <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                            {errors.checkOut && (
                              <div className="error-text flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.checkOut}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="label">
                            Number of Guests *
                          </label>
                          <div className="relative">
                            <select
                              name="guests"
                              value={formData.guests}
                              onChange={handleChange}
                              className={`select ${errors.guests ? 'input-error' : ''}`}
                            >
                              {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                                </option>
                              ))}
                            </select>
                            <Users className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                            {errors.guests && (
                              <div className="error-text flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.guests}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tent Selection */}
                    <div className="mb-8">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          <Home className="w-5 h-5 mr-2" />
                          Select Your Accommodation
                        </h3>
                        <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                          <select className="input flex-1 sm:flex-none text-sm py-2 px-3 border-gray-300" value={filterPrice} onChange={e => setFilterPrice(e.target.value)}>
                            <option value="all">All Prices</option>
                            <option value="budget">Under ₹5000</option>
                            <option value="premium">Over ₹5000</option>
                          </select>
                          <select className="input flex-1 sm:flex-none text-sm py-2 px-3 border-gray-300" value={filterCapacity} onChange={e => setFilterCapacity(e.target.value)}>
                            <option value="all">Any Sizing</option>
                            <option value="small">Couples (2)</option>
                            <option value="large">Family (4+)</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tentTypes.filter(tent => {
                            if (filterPrice === 'budget' && tent.price > 5000) return false;
                            if (filterPrice === 'premium' && tent.price <= 5000) return false;
                            if (filterCapacity === 'small' && !tent.capacity.includes('2 Adult')) return false;
                            if (filterCapacity === 'large' && !tent.capacity.includes('4 Adult')) return false;
                            return true;
                        }).map((tent) => (
                          <div
                            key={tent.id}
                            onClick={() => setFormData({...formData, tentType: tent.id})}
                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                              formData.tentType === tent.id
                                ? 'border-primary-600 bg-primary-50'
                                : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-bold text-gray-900">{tent.name}</div>
                                <div className="text-sm text-gray-600">{tent.capacity}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-primary-600">₹{tent.price}/night</div>
                                {formData.tentType === tent.id && (
                                  <div className="text-xs text-green-600 flex items-center">
                                    <Check className="w-3 h-3 mr-1" />
                                    Selected
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{tent.description}</p>
                            
                            <div className="flex flex-wrap gap-1">
                              {tent.features.map((feature, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Extra Features */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Enhance Your Stay (Add-ons)
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {availableExtras.map((extra) => (
                          <label key={extra.id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${
                            formData.extraFeatures?.includes(extra.id) ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                          }`}>
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={formData.extraFeatures?.includes(extra.id) || false} 
                              onChange={() => handleExtraToggle(extra.id)} 
                            />
                            <div className="mr-3 text-primary-600 bg-white p-2 rounded-full shadow-sm">{extra.icon}</div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-sm">{extra.name}</div>
                              <div className="text-primary-600 text-xs font-bold font-mono">+₹{extra.price} flat-fee</div>
                            </div>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.extraFeatures?.includes(extra.id) ? 'bg-primary-600 border-primary-600' : 'border-gray-300'}`}>
                              {formData.extraFeatures?.includes(extra.id) && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div className="mb-8">
                      <label className="label">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        rows="4"
                        className="textarea"
                        placeholder="Any special requirements, dietary restrictions, celebration plans, or additional requests..."
                      />
                      <div className="text-sm text-gray-500 mt-1">
                        Optional - Let us know how we can make your stay special
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || !bookingSummary}
                      className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="loading-spinner w-5 h-5 mr-3"></div>
                          Processing Your Booking...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Submit Booking Request
                        </>
                      )}
                    </button>
                    
                    {/* Terms */}
                    <div className="mt-4 text-center text-sm text-gray-500">
                      By submitting, you agree to our{' '}
                      <a href="/terms" className="text-primary-600 hover:underline">Terms & Conditions</a> and{' '}
                      <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="card sticky top-6">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Booking Summary
                </h3>
                
                {bookingSummary ? (
                  <>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tent Type:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedTent?.name}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-semibold text-gray-900">{formData.guests} Person(s)</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-semibold text-gray-900">
                          {formData.checkIn?.toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-semibold text-gray-900">
                          {formData.checkOut?.toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold text-gray-900">{bookingSummary.nights} Nights</span>
                      </div>
                    </div>
                    
                    {/* Price Breakdown */}
                    <div className="border-t pt-6">
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Price:</span>
                          <span>₹{bookingSummary.basePrice.toLocaleString('en-IN')}</span>
                        </div>
                        {bookingSummary.extraTotal > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 text-sm text-primary-600">Add-on Fees:</span>
                            <span className="text-sm font-medium">₹{bookingSummary.extraTotal.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">GST (18%):</span>
                          <span>₹{bookingSummary.tax.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service Charge:</span>
                          <span>₹{bookingSummary.serviceCharge.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Amount:</span>
                          <span className="text-primary-600">
                            ₹{bookingSummary.total.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Payable after booking confirmation
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Fill in your booking details to see the summary
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Benefits Card */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Booking Benefits
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Free cancellation up to 7 days before check-in</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Best price guaranteed - find cheaper, we'll match it</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">24/7 customer support during your stay</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Flexible payment options available</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Complimentary breakfast included</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="card bg-blue-50 border-blue-200">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 text-blue-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Need Help?
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  Our team is here to assist you with your booking
                </p>
                <div className="space-y-3">
                  <a 
                    href="tel:+919876543210" 
                    className="flex items-center text-blue-800 hover:text-blue-900"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    <span>+91 98765 43210</span>
                  </a>
                  <a 
                    href="mailto:info@chanderiecoretreat.com" 
                    className="flex items-center text-blue-800 hover:text-blue-900"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    <span>info@chanderiecoretreat.com</span>
                  </a>
                  <div className="flex items-center text-blue-800">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Chanderi, Madhya Pradesh</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-xs text-blue-600">
                    Average response time: 15 minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Package Info */}
            <div className="card bg-primary-50 border-primary-200">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 text-primary-800 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Popular Packages
                </h3>
                <div className="space-y-3">
                  <a 
                    href="/packages/adventure" 
                    className="block p-3 bg-white rounded-lg hover:shadow transition"
                  >
                    <div className="font-medium text-gray-900">Adventure Package</div>
                    <div className="text-sm text-gray-600">3 Nights, 4 Activities</div>
                  </a>
                  <a 
                    href="/packages/heritage" 
                    className="block p-3 bg-white rounded-lg hover:shadow transition"
                  >
                    <div className="font-medium text-gray-900">Heritage Package</div>
                    <div className="text-sm text-gray-600">Cultural Tours & Workshops</div>
                  </a>
                  <a 
                    href="/packages/family" 
                    className="block p-3 bg-white rounded-lg hover:shadow transition"
                  >
                    <div className="font-medium text-gray-900">Family Package</div>
                    <div className="text-sm text-gray-600">Special Activities for Kids</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookingForm