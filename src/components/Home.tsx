// components/Home.tsx
import React from 'react';
import Link from 'next/link';
import { FiLink, FiSmartphone, FiGlobe } from 'react-icons/fi';

const Home: React.FC = () => {
  const dummyQRCodes = [
    {
      title: 'Website URL',
      icon: <FiGlobe className="w-6 h-6" />,
      description: 'Create QR codes for your website or landing page',
      color: 'bg-blue-500'
    },
    {
      title: 'Social Media',
      icon: <FiLink className="w-6 h-6" />,
      description: 'Share your social media profiles instantly',
      color: 'bg-purple-500'
    },
    {
      title: 'Contact Info',
      icon: <FiSmartphone className="w-6 h-6" />,
      description: 'Share contact details with a simple scan',
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Transform Your</span>
                  <span className="block text-blue-600">Ideas into QR Codes</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Create professional QR codes in seconds. Perfect for businesses, marketing campaigns, or personal use.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                  <div className="rounded-md shadow">
                    <Link href="/new" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                      Create QR Code
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Sample QR Codes Section */}
      <div className="py-12 bg-gray-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Create QR Codes for Everything
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Choose from multiple QR code types to suit your needs
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {dummyQRCodes.map((item, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-white rounded-lg shadow-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div className={`inline-flex items-center justify-center p-3 ${item.color} rounded-md shadow-lg text-white`}>
                        {item.icon}
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{item.title}</h3>
                      <p className="mt-5 text-base text-gray-500">{item.description}</p>
                      
                      {/* Dummy QR Code */}
                      <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                        <div className="w-32 h-32 mx-auto bg-white rounded-lg shadow-inner flex items-center justify-center">
                          <div className="grid grid-cols-4 gap-1 p-2">
                            {Array(16).fill(0).map((_, i) => (
                              <div key={i} className={`w-6 h-6 ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-transparent'} rounded-sm`}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Benefits</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Our QR Code Generator?
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  title: 'Fast & Easy',
                  description: 'Generate QR codes in just a few clicks without any technical knowledge required.'
                },
                {
                  title: 'High Quality',
                  description: 'Create crystal clear QR codes that scan perfectly every time.'
                },
                {
                  title: 'Customizable',
                  description: 'Personalize your QR codes with custom colors and your brand logo.'
                },
                {
                  title: 'Multiple Formats',
                  description: 'Download your QR codes in various formats including PNG, SVG, and PDF.'
                }
              ].map((benefit, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{benefit.title}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Create your first QR code today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/new" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
