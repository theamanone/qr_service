import React, { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { MdOutlineLogout } from "react-icons/md";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Add logout logic here
    alert("Logged out");
  };

  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="flex items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleMenu}
            className="lg:hidden text-2xl text-gray-600"
            aria-label="Open Menu"
          >
            <HiMenu />
          </button>
          <span className="text-xl font-bold text-gray-800">QR Generator</span>
        </div>
        <div className="hidden lg:flex space-x-6 items-center">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
          >
            <MdOutlineLogout className="text-xl" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="w-2/3 bg-white h-full shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="text-xl font-bold text-gray-800">
                QR Generator
              </span>
              <button
                onClick={toggleMenu}
                className="text-2xl text-gray-600"
                aria-label="Close Menu"
              >
                &times;
              </button>
            </div>
            <ul className="p-4 space-y-3">
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 text-gray-600 hover:text-red-600"
                >
                  <MdOutlineLogout className="text-lg" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
