"use client";
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import StylishQRCode from '@/components/StylishQRCode'
import React, { useEffect, useState } from 'react'

export default function page() {
  const [isDeveloper, setIsDeveloper] = useState(false);
  useEffect(() => {
    if (!isDeveloper) {
      console.log(
        "%cDeveloper mode is off. Blocking events and API calls.",
        "color: red; font-size: 16px; background: yellow; padding: 4px; border-radius: 4px; font-weight: bold;"
      );
    }
  }, [isDeveloper]);
  if (!isDeveloper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-center">
        <div className="max-w-md p-8 bg-white shadow-lg rounded-2xl transform transition-transform duration-500 hover:scale-105">
          <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
            Coming Soon
          </h1>
          <p className="text-lg mb-8 text-gray-600">
            We are currently working hard to bring you this app. Stay tuned!
          </p>
          <button
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg shadow-md transform transition-transform duration-300 hover:scale-110 hover:shadow-lg"
            onClick={() => setIsDeveloper(true)}
          >
            Preview in Developer Mode
          </button>
        </div>
        <p className="mt-12 text-sm text-gray-100 animate-bounce">
          Made with <span className="text-red-400">&hearts;</span> by memesoar
          team.
        </p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <StylishQRCode />
      <Footer />
    </>
  )
}
