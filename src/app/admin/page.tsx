"use client";
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';

export default function AdminPage() {
  const { data: session } = useSession();
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
        <div className="flex items-center space-x-4">
          {session?.user?.image && (
            <Image
              src={session?.user.image}
              alt={`${session?.user.name}'s avatar`}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
          )}
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm">Welcome, {session?.user?.name || "Admin"}!</p>
        </div>
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded text-sm"
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          >
            Logout
          </button>
        </div>
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)} 
          className="md:hidden text-white focus:outline-none"
        >
          {/* Hamburger icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`md:w-64 bg-white shadow-lg p-6 transition-transform duration-300 fixed inset-0 md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0 z-50" : "-translate-x-full"}`}>
          <nav className="flex flex-col gap-4">
            <a href="#" className="text-blue-600 font-semibold">Overview</a>
            <a href="#" className="hover:text-blue-600">Analytics</a>
            <a href="#" className="hover:text-blue-600">Users</a>
            <a href="#" className="hover:text-blue-600">Settings</a>
            <a href="#" className="hover:text-blue-600">Help</a>
          </nav>
        </aside>

        {/* Overlay for Sidebar */}
        {isSidebarOpen && (
          <div 
            className=" bg-black opacity-50 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Dashboard Content */}
        <main className={`flex-1 p-4 md:p-8 ${isSidebarOpen ? "bg-gray-200" : "bg-gray-100"}`}>
          {/* Overview Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 shadow rounded-lg flex flex-col items-center">
                <p className="text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold">1,200</p>
              </div>
              <div className="bg-white p-6 shadow rounded-lg flex flex-col items-center">
                <p className="text-gray-600">Monthly Sales</p>
                <p className="text-2xl font-semibold">$4,500</p>
              </div>
              <div className="bg-white p-6 shadow rounded-lg flex flex-col items-center">
                <p className="text-gray-600">New Orders</p>
                <p className="text-2xl font-semibold">75</p>
              </div>
              <div className="bg-white p-6 shadow rounded-lg flex flex-col items-center">
                <p className="text-gray-600">Support Tickets</p>
                <p className="text-2xl font-semibold">12</p>
              </div>
            </div>
          </section>

          {/* Analytics Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <div className="bg-white p-6 shadow rounded-lg">
              <p className="text-gray-600">Traffic Overview</p>
              <div className="h-32 bg-gray-200 mt-4 rounded">[Chart Placeholder]</div>
            </div>
          </section>

          {/* Settings Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="bg-white p-6 shadow rounded-lg">
              <p className="text-gray-600">Admin Settings Placeholder</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Update Settings
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        © 2024 Admin Dashboard. All rights reserved.
      </footer>
    </div>
  );
}
