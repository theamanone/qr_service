import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} QR Generator. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
