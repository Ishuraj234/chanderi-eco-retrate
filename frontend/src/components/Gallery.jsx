import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Search, Filter, Grid, List } from 'lucide-react'
import { galleryApi } from '../services/api'
import LoadingSpinner from './LoadingSpinner'

const Gallery = () => {
  const [images, setImages] = useState([])
  const [filteredImages, setFilteredImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [categories, setCategories] = useState([])

  const categoriesList = [
    { id: 'all', name: 'All Categories' },
    { id: 'accommodation', name: 'Accommodation' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'culture', name: 'Culture' },
    { id: 'nature', name: 'Nature' },
    { id: 'food', name: 'Food' },
    { id: 'heritage', name: 'Heritage' },
    { id: 'activities', name: 'Activities' },
    { id: 'textiles', name: 'Textiles' },
    { id: 'events', name: 'Events' }
  ]

  useEffect(() => {
    fetchGalleryImages()
  }, [])

  useEffect(() => {
    filterImages()
  }, [images, searchTerm, selectedCategory])

  const fetchGalleryImages = async () => {
    try {
      setLoading(true)
      // In production, use real API call
      // const response = await galleryApi.getAllImages()
      
      // Mock data for development
      const mockImages = [
        {
          _id: '1',
          title: 'Luxury Tent Accommodation',
          description: 'Royal tent with modern amenities amidst nature',
          imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800',
          category: 'accommodation',
          tags: ['tent', 'luxury', 'camping'],
          isFeatured: true
        },
        {
          _id: '2',
          title: 'Mountain Trekking',
          description: 'Scenic trails through Chanderi hills',
          imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800',
          category: 'adventure',
          tags: ['trekking', 'hiking', 'nature'],
          isFeatured: true
        },
        {
          _id: '3',
          title: 'Traditional Dance',
          description: 'Cultural performances during festivals',
          imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800',
          category: 'culture',
          tags: ['dance', 'culture', 'festival'],
          isFeatured: true
        },
        {
          _id: '4',
          title: 'Sunset Views',
          description: 'Beautiful sunset over Chanderi landscape',
          imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800',
          category: 'nature',
          tags: ['sunset', 'landscape', 'nature'],
          isFeatured: true
        },
        {
          _id: '5',
          title: 'Local Cuisine',
          description: 'Traditional Madhya Pradesh food',
          imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800',
          category: 'food',
          tags: ['food', 'cuisine', 'traditional'],
          isFeatured: false
        },
        {
          _id: '6',
          title: 'Ancient Temple',
          description: 'Historical temple architecture',
          imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800',
          category: 'heritage',
          tags: ['temple', 'heritage', 'architecture'],
          isFeatured: true
        },
        {
          _id: '7',
          title: 'Bonfire Night',
          description: 'Evening campfire with storytelling',
          imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800',
          category: 'activities',
          tags: ['campfire', 'night', 'activities'],
          isFeatured: false
        },
        {
          _id: '8',
          title: 'Hand Weaving',
          description: 'Traditional Chanderi textile weaving',
          imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800',
          category: 'textiles',
          tags: ['weaving', 'textile', 'craft'],
          isFeatured: true
        },
        {
          _id: '9',
          title: 'Festival Celebration',
          description: 'Annual cultural festival events',
          imageUrl: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800',
          category: 'events',
          tags: ['festival', 'celebration', 'event'],
          isFeatured: false
        },
        {
          _id: '10',
          title: 'Nature Walk',
          description: 'Guided walks through forests',
          imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800',
          category: 'nature',
          tags: ['walk', 'nature', 'forest'],
          isFeatured: true
        },
        {
          _id: '11',
          title: 'Adventure Sports',
          description: 'Rock climbing and rappelling',
          imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
          category: 'adventure',
          tags: ['sports', 'adventure', 'climbing'],
          isFeatured: false
        },
        {
          _id: '12',
          title: 'Traditional Music',
          description: 'Folk music performances',
          imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800',
          category: 'culture',
          tags: ['music', 'folk', 'performance'],
          isFeatured: true
        }
      ]
      
      setImages(mockImages)
      setFilteredImages(mockImages)
      setCategories(categoriesList)
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterImages = () => {
    let filtered = [...images]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(img => img.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(img => 
        img.title.toLowerCase().includes(term) ||
        img.description.toLowerCase().includes(term) ||
        img.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }

    setFilteredImages(filtered)
  }

  const openLightbox = (image) => {
    setSelectedImage(image)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  const navigateImage = (direction) => {
    if (!selectedImage) return
    
    const currentIndex = filteredImages.findIndex(img => img._id === selectedImage._id)
    let newIndex
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length
    }
    
    setSelectedImage(filteredImages[newIndex])
  }

  const handleKeyDown = (e) => {
    if (!selectedImage) return
    
    switch(e.key) {
      case 'Escape':
        closeLightbox()
        break
      case 'ArrowRight':
        navigateImage('next')
        break
      case 'ArrowLeft':
        navigateImage('prev')
        break
    }
  }

  useEffect(() => {
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

  if (loading) {
    return <LoadingSpinner text="Loading gallery..." />
  }

  return (
    <section id="gallery" className="section bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium mb-4">
            Gallery
          </span>
          <h2 className="section-title">
            Visual <span className="gradient-text">Journey</span> Through Chanderi
          </h2>
          <p className="section-subtitle">
            Explore moments of heritage, adventure, and unforgettable experiences
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search images by title, description, or tags..."
                  className="input pl-12"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                  title="Grid View"
                >
                  <Grid size={20} className={viewMode === 'grid' ? 'text-primary-600' : 'text-gray-500'} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                  title="List View"
                >
                  <List size={20} className={viewMode === 'list' ? 'text-primary-600' : 'text-gray-500'} />
                </button>
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="select pl-10 pr-4"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Count */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-600">
            Showing <span className="font-semibold">{filteredImages.length}</span> of{' '}
            <span className="font-semibold">{images.length}</span> images
          </div>
          <div className="text-sm text-gray-500">
            {selectedCategory !== 'all' && `Category: ${categories.find(c => c.id === selectedCategory)?.name}`}
          </div>
        </div>

        {/* Gallery Grid/List */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No images found</h3>
            <p className="text-gray-500">Try changing your search or filter criteria</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <GalleryCard 
                key={image._id} 
                image={image} 
                onClick={() => openLightbox(image)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredImages.map((image) => (
              <GalleryListItem 
                key={image._id} 
                image={image} 
                onClick={() => openLightbox(image)}
              />
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <Lightbox
            image={selectedImage}
            onClose={closeLightbox}
            onNext={() => navigateImage('next')}
            onPrev={() => navigateImage('prev')}
            currentIndex={filteredImages.findIndex(img => img._id === selectedImage._id)}
            total={filteredImages.length}
          />
        )}
      </div>
    </section>
  )
}

// Gallery Card Component for Grid View
const GalleryCard = ({ image, onClick }) => {
  const categoryColors = {
    accommodation: 'bg-purple-100 text-purple-800',
    adventure: 'bg-green-100 text-green-800',
    culture: 'bg-yellow-100 text-yellow-800',
    nature: 'bg-blue-100 text-blue-800',
    food: 'bg-red-100 text-red-800',
    heritage: 'bg-amber-100 text-amber-800',
    activities: 'bg-indigo-100 text-indigo-800',
    textiles: 'bg-pink-100 text-pink-800',
    events: 'bg-cyan-100 text-cyan-800'
  }

  return (
    <div 
      className="card group cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image.imageUrl}
          alt={image.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex flex-wrap gap-1 mb-2">
              {image.tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-white/20 rounded text-xs backdrop-blur-sm">
                  {tag}
                </span>
              ))}
              {image.tags.length > 2 && (
                <span className="px-2 py-1 bg-white/20 rounded text-xs backdrop-blur-sm">
                  +{image.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Featured Badge */}
        {image.isFeatured && (
          <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded">
            Featured
          </div>
        )}
        
        {/* Category Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${categoryColors[image.category] || 'bg-gray-100 text-gray-800'}`}>
          {image.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition">
          {image.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {image.description}
        </p>
      </div>
    </div>
  )
}

// Gallery List Item Component for List View
const GalleryListItem = ({ image, onClick }) => {
  return (
    <div 
      className="card flex items-center gap-4 p-4 cursor-pointer hover:shadow-hard transition"
      onClick={onClick}
    >
      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={image.imageUrl}
          alt={image.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-grow">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-gray-900">{image.title}</h3>
            <p className="text-sm text-gray-600">{image.description}</p>
          </div>
          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium capitalize">
            {image.category}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {image.tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Lightbox Component
const Lightbox = ({ image, onClose, onNext, onPrev, currentIndex, total }) => {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-4 right-4 text-white hover:text-primary-300 z-10"
        aria-label="Close lightbox"
      >
        <X size={32} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-primary-300 z-10"
        aria-label="Previous image"
      >
        <ChevronLeft size={48} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-primary-300 z-10"
        aria-label="Next image"
      >
        <ChevronRight size={48} />
      </button>

      <div 
        className="relative max-w-6xl max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.imageUrl}
          alt={image.title}
          className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white rounded-b-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-primary-600 rounded text-sm capitalize">
                  {image.category}
                </span>
                {image.isFeatured && (
                  <span className="px-2 py-1 bg-yellow-600 rounded text-sm">
                    Featured
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
              <p className="text-gray-300">{image.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {image.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-white/20 rounded text-sm backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-sm text-gray-300 bg-black/50 rounded-full px-4 py-2">
              {currentIndex + 1} / {total}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gallery