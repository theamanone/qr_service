'use client'

import Footer from '@/components/Footer'
import React from 'react'
import { FiClock, FiTag, FiUser, FiCalendar } from 'react-icons/fi'

const blogPosts = [
  {
    title: 'The Future of QR Codes in Digital Marketing',
    excerpt:
      'Discover how QR codes are revolutionizing digital marketing strategies and customer engagement in 2024.',
    author: 'John Doe',
    date: 'January 15, 2024',
    category: 'Marketing',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    readTime: '5 min read',
    featured: true
  },
  {
    title: 'Best Practices for QR Code Design',
    excerpt:
      'Learn how to create effective and visually appealing QR codes that drive engagement and enhance user experience.',
    author: 'Jane Smith',
    date: 'January 12, 2024',
    category: 'Design',
    image:
      'https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    readTime: '7 min read'
  },
  {
    title: 'QR Codes in Restaurant Menus: A Success Story',
    excerpt:
      'How restaurants are transforming their customer experience with dynamic QR code menus.',
    author: 'Mike Johnson',
    date: 'January 10, 2024',
    category: 'Industry',
    image:
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    readTime: '4 min read'
  },
  {
    title: 'Security Best Practices for QR Codes',
    excerpt:
      'Essential security measures and guidelines to protect your QR codes from potential threats and misuse.',
    author: 'Sarah Wilson',
    date: 'January 8, 2024',
    category: 'Security',
    image:
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    readTime: '6 min read'
  }
]

const categories = [
  'All',
  'Marketing',
  'Design',
  'Industry',
  'Security',
  'Technology'
]

export default function Blog () {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <main className='flex-grow'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6'>
              QRStyle Blog
            </h1>
            <p className='text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto'>
              Insights, updates, and best practices from the world of QR codes
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8'>
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <div className='flex flex-wrap justify-center gap-4'>
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    index === 0
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12'>
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              <div className='relative h-64 lg:h-auto'>
                <img
                  src={blogPosts[0].image}
                  alt='Featured post'
                  className='absolute inset-0 w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden'></div>
              </div>
              <div className='p-8 lg:p-12'>
                <div className='flex items-center gap-4 text-sm text-gray-600 mb-4'>
                  <span className='flex items-center gap-2'>
                    <FiCalendar className='w-4 h-4' />
                    {blogPosts[0].date}
                  </span>
                  <span className='flex items-center gap-2'>
                    <FiClock className='w-4 h-4' />
                    {blogPosts[0].readTime}
                  </span>
                </div>
                <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                  {blogPosts[0].title}
                </h2>
                <p className='text-gray-600 mb-6'>{blogPosts[0].excerpt}</p>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <FiUser className='w-4 h-4 text-gray-500' />
                    <span className='text-gray-700 font-medium'>
                      {blogPosts[0].author}
                    </span>
                  </div>
                  <button className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'>
                    Read More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {blogPosts.slice(1).map((post, index) => (
              <article
                key={index}
                className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'
              >
                <div className='relative h-48'>
                  <img
                    src={post.image}
                    alt={post.title}
                    className='absolute inset-0 w-full h-full object-cover'
                  />
                  <div className='absolute top-4 right-4'>
                    <span className='px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-blue-600'>
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className='p-6'>
                  <div className='flex items-center gap-4 text-sm text-gray-600 mb-3'>
                    <span className='flex items-center gap-1'>
                      <FiClock className='w-4 h-4' />
                      {post.readTime}
                    </span>
                    <span className='flex items-center gap-1'>
                      <FiCalendar className='w-4 h-4' />
                      {post.date}
                    </span>
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 mb-3'>
                    {post.title}
                  </h3>
                  <p className='text-gray-600 mb-4 line-clamp-3'>
                    {post.excerpt}
                  </p>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <FiUser className='w-4 h-4 text-gray-500' />
                      <span className='text-gray-700 font-medium'>
                        {post.author}
                      </span>
                    </div>
                    <button className='text-blue-600 hover:text-blue-700 font-medium'>
                      Read More →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
