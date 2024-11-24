import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="fixed  bottom-0 left-0  w-full bg-gray-100 border-t mt-auto">
      <div className="max-w-screen-xl mx-auto px-4  text-center text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} QR Generator. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
