import React from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import Activities from '../components/Activities'
import Gallery from '../components/Gallery'
import Testimonials from '../components/Testimonials'
import BookingForm from '../components/BookingForm'

const Home = () => {
  return (
    <div className="animate-fade-in">
      <Hero />
      <About />
      <Activities />
      <Gallery />
      <Testimonials />
      <BookingForm />
    </div>
  )
}

export default Home