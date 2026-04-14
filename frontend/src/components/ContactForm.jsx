import React, { useState } from 'react'
import { 
  Mail, Phone, MapPin, Send, 
  User, MessageSquare, AlertCircle, Check
} from 'lucide-react'
import { contactApi } from '../services/api'
import toast from 'react-hot-toast'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone Number',
      details: ['+91 98765 43210', '+91 98765 43211'],
      description: 'Available 24/7 for emergencies'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Address',
      details: ['info@chanderiecoretreat.com', 'bookings@chanderiecoretreat.com'],
      description: 'Response within 2 hours'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Location',
      details: ['Chanderi Eco Retreat', 'Chanderi, Madhya Pradesh 473446'],
      description: 'Near Chanderi Fort'
    }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits required)'
    }
    
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
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
    console.log('📤 Sending contact data:', formData)
    
    // ✅ UNCOMMENT THIS LINE:
    const response = await contactApi.createContact(formData)
    
    // ❌ COMMENT/REMOVE THIS SIMULATION:
    // await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('✅ API Response:', response)
    
    if (response.success) {
      toast.success('Message sent successfully! We will get back to you soon.')
      
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      setErrors({})
      
      setTimeout(() => setSubmitted(false), 5000)
    } else {
      throw new Error(response.message || 'Failed to send message')
    }
  } catch (error) {
    console.error('❌ Contact error:', error)
    toast.error(error.message || 'Failed to send message. Please try again.')
  } finally {
    setLoading(false)
  }
}

  const faqs = [
    {
      question: 'What are the check-in and check-out times?',
      answer: 'Check-in: 2:00 PM | Check-out: 11:00 AM. Early check-in and late check-out subject to availability.'
    },
    {
      question: 'Is the retreat suitable for children?',
      answer: 'Yes! We have special activities for children and family-friendly accommodations.'
    },
    {
      question: 'What adventure activities are available?',
      answer: 'Trekking, rappelling, nature walks, heritage tours, and cultural workshops.'
    },
    {
      question: 'Is there parking available?',
      answer: 'Yes, we have secure parking facilities for both cars and buses.'
    }
  ]

  return (
    <section id="contact" className="section bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
            Contact Us
          </span>
          <h2 className="section-title">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="section-subtitle">
            Have questions? We're here to help you plan your perfect getaway
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="card hover:shadow-hard transition">
                <div className="p-6">
                  <div className="inline-flex p-3 bg-primary-100 rounded-lg text-primary-600 mb-4">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">{info.title}</h3>
                  <div className="space-y-1 mb-2">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700">{detail}</p>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{info.description}</p>
                </div>
              </div>
            ))}

            {/* Business Hours */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Business Hours</h3>
                <div className="space-y-2">
                  {[
                    { day: 'Monday - Friday', time: '9:00 AM - 8:00 PM' },
                    { day: 'Saturday', time: '9:00 AM - 6:00 PM' },
                    { day: 'Sunday', time: '10:00 AM - 5:00 PM' },
                    { day: 'Emergency', time: '24/7 Available' }
                  ].map((schedule, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-gray-700">{schedule.day}</span>
                      <span className={`font-medium ${
                        schedule.day === 'Emergency' ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {schedule.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="card text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for contacting us. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="card">
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-6 text-gray-900">
                    Send us a Message
                  </h3>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="label">
                          Your Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`input ${errors.name ? 'input-error' : ''}`}
                            placeholder="Enter your name"
                          />
                          <User className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
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

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="label">
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`input ${errors.phone ? 'input-error' : ''}`}
                            placeholder="Enter your phone number"
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

                      <div>
                        <label className="label">
                          Subject *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={`input ${errors.subject ? 'input-error' : ''}`}
                            placeholder="What is this regarding?"
                          />
                          <MessageSquare className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                          {errors.subject && (
                            <div className="error-text flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.subject}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="label">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className={`textarea ${errors.message ? 'input-error' : ''}`}
                        placeholder="Please provide details about your inquiry..."
                      />
                      {errors.message && (
                        <div className="error-text flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.message}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        Minimum 10 characters required
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full py-3 flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="loading-spinner w-5 h-5 mr-3"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* FAQs Section */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-6 text-gray-900">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="card">
                    <div className="p-6">
                      <h4 className="font-bold text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <a 
                  href="/faq" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all FAQs →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactForm