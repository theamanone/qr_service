// components/Home.tsx
import Link from "next/link";
import React from "react";


const Home = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-16 h-full">
      <div className="max-w-5xl mx-auto text-center px-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl leading-tight">
          Welcome to Our Modern Homepage
        </h1>
        <p className="mt-6 text-lg sm:text-xl md:text-2xl font-light opacity-90">
          Discover exciting content and features that enhance your experience.
          We’re here to bring you the best!
        </p>

        <div className="mt-10">
          <Link href={'/new'} className="bg-white text-blue-600 px-8 py-4 text-xl font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50">
            Explore Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
