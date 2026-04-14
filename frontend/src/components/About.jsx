import React from 'react'
// About.jsx में import section update करें
import { CheckCircle, Globe, Heart, Target, Users, Award, Clock, Leaf, ChevronRight } from 'lucide-react'
//                                                             ^^^^^^^^^^ ये add करें
import { Link } from 'react-router-dom'

const About = () => {
  const features = [
    {
      icon: <Globe className="w-10 h-10" />,
      title: 'Cultural Heritage',
      description: 'Experience 800+ years of history with ancient monuments and traditional crafts',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Leaf className="w-10 h-10" />,
      title: 'Eco-Friendly',
      description: 'Sustainable tourism practices that protect our environment and local communities',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Target className="w-10 h-10" />,
      title: 'Adventure Hub',
      description: '50+ adventure activities including trekking, rappelling, and nature trails',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: 'Luxury Camping',
      description: 'Royal tent accommodations with modern amenities amidst nature',
      color: 'from-blue-500 to-cyan-500'
    }
  ]

  const achievements = [
    { icon: <Award />, value: '15+', label: 'Years Experience' },
    { icon: <Users />, value: '5000+', label: 'Happy Guests' },
    { icon: <CheckCircle />, value: '98%', label: 'Satisfaction Rate' },
    { icon: <Clock />, value: '24/7', label: 'Support Available' },
  ]

  return (
    <section id="about" className="section gradient-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
            About Us
          </span>
          <h2 className="section-title">
            Discover the Magic of <span className="gradient-text">Chanderi</span>
          </h2>
          <p className="section-subtitle">
            A celebration of heritage, culture, and craftsmanship in the heart of Madhya Pradesh
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Experience the Essence of Chanderi
            </h3>
            
            <p className="text-gray-600 leading-relaxed">
              The Chanderi Celebration at Chanderi Eco Retreat is an annual cultural event 
              known for its historical significance and traditional handwoven textiles. 
              Established in 2008, we've been showcasing the rich cultural heritage of 
              Chanderi and promoting sustainable tourism.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              Immerse yourself in the art of handwoven textiles and witness skilled artisans 
              at work. Explore historical sites, savor authentic local cuisine, and connect 
              with a diverse community of locals and visitors.
            </p>
            
            <div className="space-y-4">
              {[
                'Traditional Handwoven Textiles Exhibition',
                'Historical Monuments Exploration (80+ sites)',
                'Local Cuisine & Cooking Workshops',
                'Adventure Activities & Nature Trails',
                'Cultural Performances & Folk Music',
                'Eco-Friendly Luxury Accommodations',
                'Photography & Heritage Tours',
                'Community Engagement Programs'
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-6">
              <Link to="/about" className="btn-primary inline-flex items-center">
                Learn More About Us
                <ChevronRight className="ml-2" />
              </Link>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
                alt="Chanderi Heritage"
                className="w-full h-[400px] object-cover transform hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Floating Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                <div className="text-2xl font-bold text-primary-600">15+</div>
                <div className="text-sm text-gray-600">Years of Excellence</div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary-100 rounded-full -z-10"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary-100 rounded-full -z-10"></div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-900">
            Why Choose Chanderi Eco Retreat
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card group"
              >
                <div className="p-6">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition">
                    {feature.title}
                  </h4>
                  
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-3 bg-white rounded-full shadow-md mb-4">
                  <div className="text-primary-600">
                    {achievement.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{achievement.value}</div>
                <div className="text-gray-600">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About