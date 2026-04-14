import React from 'react'

const LoadingSpinner = ({ size = 'lg', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className={`${sizes[size]} loading-spinner rounded-full mb-4`}></div>
      <p className="text-gray-600 animate-pulse">{text}</p>
    </div>
  )
}

export default LoadingSpinner