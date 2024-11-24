'use client'

import { signOut } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import { HiMenu } from 'react-icons/hi'
import { LuLogOut } from 'react-icons/lu'
import { FiUser, FiGrid, FiHome, FiPlus } from 'react-icons/fi' // Icons for Dashboard and Profile
import Confirm from './Confirm'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
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

  return (
    <header className='bg-white shadow-md sticky top-0 w-full z-50'>
      <div className='flex items-center justify-between px-4 py-3'>
        {/* Logo and Menu Toggle */}
        <div className='flex items-center space-x-4'>
          <button
            onClick={toggleMenu}
            className='lg:hidden text-2xl text-gray-600'
            aria-label='Open Menu'
          >
            <HiMenu />
          </button>
          <span className='text-xl font-bold text-gray-800'>QR Generator</span>
        </div>

        {/* Desktop Actions */}
        <div className='hidden lg:flex space-x-6 items-center'>
          <Link
            href='/'
            className={`flex items-center space-x-2 ${
              isActive('/') ? 'text-blue-600 font-bold' : 'text-gray-600'
            } hover:text-blue-600`}
            aria-label='Home'
          >
            <FiHome className='text-xl' />
            <span className='text-sm font-medium'>Home</span>
          </Link>
          <Link
            href='/dashboard'
            className={`flex items-center space-x-2 ${
              isActive('/dashboard')
                ? 'text-blue-600 font-bold'
                : 'text-gray-600'
            } hover:text-blue-600`}
            aria-label='Dashboard'
          >
            <FiGrid className='text-xl' />
            <span className='text-sm font-medium'>Dashboard</span>
          </Link>
          <Link
            href='/new'
            className={`flex items-center space-x-2 ${
              isActive('/new') ? 'text-blue-600 font-bold' : 'text-gray-600'
            } hover:text-blue-600`}
            aria-label='New'
          >
            <FiPlus className='text-xl' />
            <span className='text-sm font-medium'>New</span>
          </Link>
          <Link
            href='/profile'
            className={`flex items-center space-x-2 ${
              isActive('/profile') ? 'text-blue-600 font-bold' : 'text-gray-600'
            } hover:text-blue-600`}
            aria-label='Profile'
          >
            <FiUser className='text-xl' />
            <span className='text-sm font-medium'>Profile</span>
          </Link>
          {/* <button
            onClick={handleConfirmOpen}
            className='flex items-center space-x-1 text-gray-600 hover:text-red-600'
          >
            <LuLogOut className='text-xl' />
            <span className='text-sm font-medium'>Logout</span>
          </button> */}
        </div>
      </div>

      {/* Mobile Slide-Out Menu */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: menuOpen ? '0%' : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed inset-y-0 left-0 w-2/3 bg-white shadow-lg z-50 flex flex-col justify-between lg:hidden`}
      >
        {/* Header */}
        <div className='h-full flex flex-col justify-between' ref={divRef}>
          <div>
            <div className='flex items-center justify-between px-4 py-3 border-b'>
              <span className='text-xl font-bold text-gray-800'>
                QR Generator
              </span>
              <button
                onClick={toggleMenu}
                className='text-2xl text-gray-600'
                aria-label='Close Menu'
              >
                &times;
              </button>
            </div>

            {/* Menu Options */}
            <ul className='p-4 space-y-3'>
              <li>
                <Link
                  href='/'
                  className={`flex items-center space-x-2 ${
                    isActive('/') ? 'text-blue-600 font-bold' : 'text-gray-600'
                  } hover:text-blue-600`}
                >
                  <FiHome className='text-lg' />
                  <span className='text-sm font-medium'>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/dashboard'
                  className={`flex items-center space-x-2 ${
                    isActive('/dashboard')
                      ? 'text-blue-600 font-bold'
                      : 'text-gray-600'
                  } hover:text-blue-600`}
                >
                  <FiGrid className='text-lg' />
                  <span className='text-sm font-medium'>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/new'
                  className={`flex items-center space-x-2 ${
                    isActive('/new')
                      ? 'text-blue-600 font-bold'
                      : 'text-gray-600'
                  } hover:text-blue-600`}
                >
                  <FiPlus className='text-lg' />
                  <span className='text-sm font-medium'>New</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/profile'
                  className={`flex items-center space-x-2 ${
                    isActive('/profile')
                      ? 'text-blue-600 font-bold'
                      : 'text-gray-600'
                  } hover:text-blue-600`}
                >
                  <FiUser className='text-lg' />
                  <span className='text-sm font-medium'>Profile</span>
                </Link>
              </li>
            </ul>
          </div>
          <li >
            <button
              onClick={handleConfirmOpen}
              className='flex items-center space-x-2 px-4 py-3 bg-red-500 w-[90%] m-2 mx-auto rounded-lg text-gray-200 hover:text-red-600'
            >
              <LuLogOut className='text-lg' />
              <span className='text-sm font-medium'>Logout</span>
            </button>
          </li>
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
