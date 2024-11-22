import useOutsideClick from "@/utils/documentOutSideClick";
import { signOut } from "next-auth/react";
import React, { useRef, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { LuLogOut } from "react-icons/lu";
import { FiUser, FiGrid } from "react-icons/fi"; // Icons for Dashboard and Profile
import Confirm from "./Confirm";
import Link from "next/link";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  // useOutsideClick(divRef, () => onOpenChange(false));

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/signin" });
  };

  const handleConfirmOpen = () => {
    setConfirmOpen(true); // Open confirmation modal
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false); // Close confirmation modal
  };

  return (
    <header className="bg-white shadow-md sticky top-0 w-full z-50">
      <div className="flex items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo and Menu Toggle */}
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

        {/* Desktop Actions */}
        <div className="hidden lg:flex space-x-6 items-center">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            aria-label="Dashboard"
          >
            <FiGrid className="text-xl" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            aria-label="Profile"
          >
            <FiUser className="text-xl" />
            <span className="text-sm font-medium">Profile</span>
          </Link>
          <button
            onClick={handleConfirmOpen}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
          >
            <LuLogOut className="text-xl" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

      </div>

      {/* Mobile Slide-Out Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="w-2/3 bg-white h-full shadow-lg flex flex-col justify-between">
            {/* Header */}
            <div>
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
              {/* Menu Options */}
              <ul className="p-4 space-y-3">
                <li>
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                  >
                    <FiGrid className="text-lg" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="w-full flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                  >
                    <FiUser className="text-lg" />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleConfirmOpen}
                    className="w-full flex items-center space-x-2 text-gray-600 hover:text-red-600"
                  >
                    <LuLogOut className="text-lg" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog for Logout */}
      <Confirm
        isOpen={isConfirmOpen}
        onConfirm={handleLogout}
        onCancel={handleConfirmClose}
        message="Are you sure you want to log out?"
      />
    </header>
  );
};

export default Header;
