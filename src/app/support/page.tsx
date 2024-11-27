'use client'

import Footer from '@/components/Footer'
import React from 'react'
import { FiHelpCircle, FiBook, FiMail } from 'react-icons/fi'

const supportOptions = [
  {
    icon: <FiHelpCircle className="w-8 h-8" />,
    title: 'Help Center',
    description: 'Browse through our comprehensive help articles and guides.',
    color: 'bg-blue-500',
  },
  {
    icon: <FiBook className="w-8 h-8" />,
    title: 'Documentation',
    description: 'Detailed technical documentation and API references.',
    color: 'bg-purple-500',
  },
  {
    icon: <FiMail className="w-8 h-8" />,
    title: 'Email Support',
    description: 'support@qrstyle.com - Response within 24 hours.',
    color: 'bg-green-500',
  }
]

const commonQuestions = [
  {
    question: 'How do I create my first QR code?',
    answer: 'Navigate to the Create QR section, choose your QR type, and follow our step-by-step guide.'
  },
  {
    question: 'What types of QR codes can I create?',
    answer: 'We support URL, text, vCard, email, SMS, and many more QR code types.'
  },
  {
    question: 'Are the generated QR codes permanent?',
    answer: 'Yes, all generated QR codes are permanent and will not expire.'
  }
]

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto pt-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            How can we <span className="text-blue-600">help you?</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Find the information you need in our help center, documentation, or reach out to our support team.
          </p>
        </div>

        {/* Support Options */}
        <div className="max-w-7xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {supportOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`${option.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6`}>
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {option.title}
                </h3>
                <p className="text-gray-600">
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Questions */}
        <div className="max-w-4xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Common Questions
          </h2>
          <div className="space-y-8">
            {commonQuestions.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
