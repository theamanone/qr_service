'use client'

import { signOut, useSession } from 'next-auth/react'
import React, { useRef, useState } from 'react'
import { HiMenu } from 'react-icons/hi'
import { LuLogOut } from 'react-icons/lu'
import { FiUser, FiGrid, FiHome, FiPlus, FiLogIn } from 'react-icons/fi'
import Confirm from './Confirm'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import useOutsideClick from '@/utils/documentOutSideClick'

interface NavItem {
  path: string
  icon: React.ElementType
  label: string
  requiresAuth: boolean
}

const Header: React.FC = () => {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isConfirmOpen, setConfirmOpen] = useState(false)
  const pathname = usePathname()
  const divRef = useRef(null)

  useOutsideClick(divRef, () => setMenuOpen(false))

  const handleLogout = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    signOut({ 
      callbackUrl: `${baseUrl}/auth/signin`
    });
  }
  const toggleMenu = () => setMenuOpen(!menuOpen)
  const handleConfirmOpen = () => setConfirmOpen(true)
  const handleConfirmClose = () => setConfirmOpen(false)

  const isActive = (path: string) => pathname === path

  const navItems: NavItem[] = [
    { path: '/', icon: FiHome, label: 'Home', requiresAuth: false },
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard', requiresAuth: true },
    { path: '/new', icon: FiPlus, label: 'Create QR', requiresAuth: true },
    { path: '/profile', icon: FiUser, label: 'Profile', requiresAuth: true }
  ]

  const visibleNavItems = navItems.filter(item => 
    !item.requiresAuth || status === 'authenticated'
  )

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Menu Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              <HiMenu className="w-6 h-6 text-gray-600" />
            </button>
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                QR Generator
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
            {status === 'authenticated' ? (
              <button
                onClick={handleConfirmOpen}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg"
              >
                <LuLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                <FiLogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}
      
      {/* Mobile Menu */}
      <motion.div
        ref={divRef}
        initial={{ x: '-100%' }}
        animate={{ x: menuOpen ? '0%' : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg lg:hidden z-50"
      >
        <div className="flex flex-col h-full ">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-800">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ×
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col space-y-1">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    isActive(item.path)
                      ? 'text-blue-600 bg-blue-50 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t">
            {status === 'authenticated' ? (
              <button
                onClick={handleConfirmOpen}
                className="flex items-center space-x-2 w-full px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg"
              >
                <LuLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                <FiLogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Logout Confirmation Dialog */}
      <Confirm
        isOpen={isConfirmOpen}
        onConfirm={handleLogout}
        onCancel={handleConfirmClose}
        message="Are you sure you want to log out?"
      />
    </header>
  )
}

export default Header
