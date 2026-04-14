
// Activities.jsx में पहले 10 lines को replace करें:
import React from 'react'
import { 
  Mountain, Tent, Utensils, Camera, 
  Music, Sparkles, Map, Compass,
  // Campfire की जगह Flame या Fire icon use करें
  Flame, TreePine, Sunrise, Target
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Activities = () => {
  const activities = [
    {
      icon: <Mountain className="w-12 h-12" />,
      title: 'Trekking & Hiking',
      description: 'Explore scenic trails through hills, forests, and historical routes with expert guides',
      duration: '3-6 hours',
      difficulty: 'Moderate',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800'
    },
    {
      icon: <Tent className="w-12 h-12" />,
      title: 'Luxury Glamping',
      description: 'Experience royal tent accommodations with modern amenities under the stars',
      duration: 'Overnight',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=800'
    },
    {
      icon: <Utensils className="w-12 h-12" />,
      title: 'Local Cuisine',
      description: 'Cook and savor authentic Madhya Pradesh delicacies with local chefs',
      duration: '2-3 hours',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800'
    },
    {
      icon: <Camera className="w-12 h-12" />,
      title: 'Photography Tours',
      description: 'Capture the beauty of heritage sites, landscapes, and cultural events',
      duration: '4-5 hours',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800'
    },
    {
      icon: <Music className="w-12 h-12" />,
      title: 'Cultural Nights',
      description: 'Traditional music, dance performances, and bonfire storytelling',
      duration: 'Evening',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800'
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: 'Textile Workshops',
      description: 'Learn Chanderi weaving from master craftsmen with hands-on experience',
      duration: '3-4 hours',
      difficulty: 'Beginner',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800'
    },
    {
      icon: <Map className="w-12 h-12" />,
      title: 'Heritage Walks',
      description: 'Guided tours through ancient monuments and historical sites',
      duration: '2-3 hours',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800'
    },
    // Activities array में Campfire वाली entry को बदलें:
{
  icon: <Flame className="w-12 h-12" />, // Campfire की जगह Flame
  title: 'Bonfire Camping',
  description: 'Evening campfires with storytelling, stargazing, and local legends',
  duration: 'Evening',
  difficulty: 'Easy',
  image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800'
}
  ]

  const adventureStats = [
    { value: '50+', label: 'Trekking Routes' },
    { value: '30+', label: 'Cultural Events' },
    { value: '100+', label: 'Local Artisans' },
    { value: '24/7', label: 'Guide Support' },
  ]

  return (
    <section className="section bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
            Adventures
          </span>
          <h2 className="section-title">
            Experience <span className="gradient-text">Thrilling Activities</span>
          </h2>
          <p className="section-subtitle">
            From cultural immersion to adrenaline-pumping adventures, we have something for everyone
          </p>
        </div>
        
        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {activities.map((activity, index) => (
            <div 
              key={index} 
              className="card group overflow-hidden hover:shadow-hard transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Duration Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                  {activity.duration}
                </div>
                
                {/* Difficulty Badge */}
                <div className={`absolute top-3 left-3 rounded-full px-3 py-1 text-sm font-medium ${
                  activity.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  activity.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {activity.difficulty}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className="text-primary-600 mr-4">
                    {activity.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                      {activity.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {activity.description}
                </p>
                
                <Link 
                  to="/booking" 
                  className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 group"
                >
                  <span>Book This Activity</span>
                  <Compass className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Adventure Stats */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold text-center mb-8">
              Our Adventure Statistics
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {adventureStats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition duration-300"
                >
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-primary-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Safety & Facilities */}
        <div className="bg-white rounded-2xl p-8 shadow-soft">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Safety & Facilities
              </h3>
              
              <div className="space-y-4">
                {[
                  'Certified Adventure Guides',
                  'First Aid & Emergency Support',
                  'Quality Equipment Provided',
                  'Vegetarian & Non-Vegetarian Food',
                  'Clean Drinking Water',
                  'Sanitized Accommodations',
                  '24/7 Security',
                  'Insurance Coverage'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                What to Bring
              </h3>
              
              <div className="space-y-4">
                {[
                  'Comfortable Clothing & Shoes',
                  'Sunscreen & Hat/Cap',
                  'Water Bottle',
                  'Personal Medications',
                  'Camera (Optional)',
                  'Power Bank',
                  'Raincoat (Monsoon)',
                  'Valid ID Proof'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Ready for Adventure?</h4>
                <p className="text-gray-600">
                  Contact us for custom packages and group discounts
                </p>
              </div>
              
              <div className="flex gap-4">
                <Link to="/contact" className="btn-secondary">
                  Contact Us
                </Link>
                <Link to="/booking" className="btn-primary">
                  Book Adventure Package
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Activities