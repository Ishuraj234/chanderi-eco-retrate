import React from 'react'
import { 
  History, Target, Users, Award, 
  Globe, Leaf, Shield, Heart,
  ChevronRight, Check
} from 'lucide-react'
import { Link } from 'react-router-dom'

const AboutPage = () => {
  const milestones = [
    { year: '2008', event: 'Founded Chanderi Eco Retreat', description: 'Started with 10 tents' },
    { year: '2012', event: 'Heritage Tourism Award', description: 'Recognized by MP Tourism' },
    { year: '2015', event: 'Expanded to 50 tents', description: 'Added adventure activities' },
    { year: '2018', event: 'Green Certification', description: 'Eco-friendly practices' },
    { year: '2021', event: '5000+ Happy Guests', description: 'International recognition' },
    { year: '2024', event: 'Digital Transformation', description: 'Online booking platform' }
  ]

  const team = [
    { name: 'Rajesh Verma', role: 'Founder & CEO', experience: '15+ years', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200' },
    { name: 'Priya Sharma', role: 'Operations Head', experience: '10+ years', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=200' },
    { name: 'Amit Kumar', role: 'Adventure Guide', experience: '8+ years', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200' },
    { name: 'Meera Singh', role: 'Cultural Coordinator', experience: '12+ years', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200' }
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              About <span className="gradient-text">Chanderi Eco Retreat</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Pioneering sustainable tourism while preserving cultural heritage since 2008
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/booking" className="btn-primary">
                Book Your Stay
              </Link>
              <Link to="/gallery" className="btn-secondary">
                View Our Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
                Our Mission
              </div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Creating Meaningful Travel Experiences
              </h2>
              <p className="text-gray-600 mb-6">
                At Chanderi Eco Retreat, our mission is to provide immersive cultural and 
                adventure experiences while promoting sustainable tourism practices that 
                benefit both our guests and the local community.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Target className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Sustainable Tourism</h4>
                    <p className="text-gray-600">Minimizing environmental impact while maximizing community benefits</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Globe className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Cultural Preservation</h4>
                    <p className="text-gray-600">Protecting and promoting Chanderi's rich heritage and traditions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Community Engagement</h4>
                    <p className="text-gray-600">Creating employment and supporting local artisans and businesses</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800"
                  alt="Our Mission"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <Award className="w-12 h-12 text-primary-600 mb-2" />
                <div className="text-2xl font-bold">15+</div>
                <div className="text-gray-600">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
              Our Journey
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Milestones & Achievements
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to becoming Madhya Pradesh's premier eco-tourism destination
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-200"></div>
            
            {/* Milestones */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <div className="card inline-block max-w-md">
                      <div className="p-6">
                        <div className="text-primary-600 font-bold text-lg mb-2">{milestone.year}</div>
                        <h3 className="font-bold text-gray-900 mb-2">{milestone.event}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
              Meet Our Team
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              The People Behind Your Experience
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our dedicated team ensures every guest has an unforgettable stay
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center group">
                <div className="p-6">
                  <div className="relative mb-4 mx-auto">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-primary-100 group-hover:border-primary-300 transition"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                  <div className="text-primary-600 font-medium mb-2">{member.role}</div>
                  <div className="text-sm text-gray-500">{member.experience} Experience</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
              Our Values
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              What We Stand For
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="w-10 h-10" />,
                title: 'Sustainability',
                description: 'Eco-friendly practices and conservation efforts'
              },
              {
                icon: <Heart className="w-10 h-10" />,
                title: 'Community',
                description: 'Supporting local artisans and businesses'
              },
              {
                icon: <Shield className="w-10 h-10" />,
                title: 'Safety',
                description: 'Highest safety standards in all activities'
              },
              {
                icon: <Globe className="w-10 h-10" />,
                title: 'Authenticity',
                description: 'Genuine cultural experiences'
              }
            ].map((value, index) => (
              <div key={index} className="card text-center">
                <div className="p-6">
                  <div className="inline-flex p-3 bg-primary-100 rounded-lg text-primary-600 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Experience Chanderi?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of travelers who've created unforgettable memories with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Book Your Adventure
                <ChevronRight className="ml-2" />
              </Link>
              <Link to="/contact" className="btn border-2 border-white text-white hover:bg-white/10">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage