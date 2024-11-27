'use client'

import { signOut } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import { HiMenu } from 'react-icons/hi'
import { LuLogOut } from 'react-icons/lu'
import { FiUser, FiGrid, FiHome, FiPlus, FiSearch } from 'react-icons/fi'
import Confirm from './Confirm'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import useOutsideClick from '@/utils/documentOutSideClick'

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isConfirmOpen, setConfirmOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const handleLogout = () => signOut({ callbackUrl: '/auth/signin' })
  const handleConfirmOpen = () => setConfirmOpen(true)
  const handleConfirmClose = () => setConfirmOpen(false)
  const divRef = useRef(null)
  useOutsideClick(divRef, () => setMenuOpen(false))

  const isActive = (path: string) => pathname === path

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/new', icon: FiPlus, label: 'Create QR' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
  ]

  return (
    <header className='bg-white border-b border-gray-100 sticky top-0 w-full z-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-between px-4 py-4'>
          {/* Logo and Menu Toggle */}
          <div className='flex items-center space-x-4'>
            <button
              onClick={toggleMenu}
              className='lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'
              aria-label='Open Menu'
            >
              <HiMenu className="w-6 h-6 text-gray-600" />
            </button>
            <Link href="/" className='flex items-center space-x-2'>
              <span className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text'>QR Generator</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          {/* <div className='hidden md:flex items-center flex-1 max-w-md mx-4'>
            <div className='relative w-full'>
              <input
                type="text"
                placeholder="Search QR codes..."
                className='w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            </div>
          </div> */}

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center space-x-1'>
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className='text-sm'>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={handleConfirmOpen}
              className='flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors ml-2'
            >
              <LuLogOut className='w-5 h-5' />
              <span className='text-sm'>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Slide-Out Menu */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: menuOpen ? '0%' : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className='fixed inset-y-0 left-0 w-[280px] bg-white shadow-xl z-50 lg:hidden'
      >
        <div className='h-full flex flex-col' ref={divRef}>
          {/* Mobile Menu Header */}
          <div className='p-4 border-b border-gray-100'>
            <div className='flex items-center justify-between'>
              <span className='text-xl font-bold text-gray-800'>Menu</span>
              <button
                onClick={toggleMenu}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Mobile Search */}
            {/* <div className='mt-4'>
              <div className='relative'>
                <input
                  type="text"
                  placeholder="Search..."
                  className='w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              </div>
            </div> */}
          </div>

          {/* Mobile Navigation */}
          <nav className='flex-1 px-2 py-4 space-y-1 overflow-y-auto'>
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Footer */}
          <div className='p-4 border-t border-gray-100'>
            <button
              onClick={handleConfirmOpen}
              className='flex items-center justify-center w-full space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors'
            >
              <LuLogOut className='w-5 h-5' />
              <span className='font-medium'>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Confirm Dialog for Logout */}
      <Confirm
        isOpen={isConfirmOpen}
        onConfirm={handleLogout}
        onCancel={handleConfirmClose}
        message='Are you sure you want to log out?'
      />
    </header>
  )
}

export default Header
