// components/Home.tsx
import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import Link from "next/link";

const Home: React.FC = () => {
  const qrCodeRefs = [useRef(null), useRef(null), useRef(null)];
  const qrCodeConfigs = [
    {
      data: process.env.NEXT_PUBLIC_BASE_URL || "https://example.com/demo1",
      dotColor: "#FF6F61",
      squareColor: "#4CAF50",
    },
    {
      data: process.env.NEXT_PUBLIC_BASE_URL || "https://example.com/demo2",
      dotColor: "#3F51B5",
      squareColor: "#FFC107",
    },
    {
      data: process.env.NEXT_PUBLIC_BASE_URL || "https://example.com/demo3",
      dotColor: "#FF9800",
      squareColor: "#00BCD4",
    },
  ];

  useEffect(() => {
    qrCodeRefs.forEach((ref, index) => {
      if (ref.current) {
        const qrCode = new QRCodeStyling({
          width: 150,
          height: 150,
          data: qrCodeConfigs[index].data,
          dotsOptions: {
            color: qrCodeConfigs[index].dotColor,
            type: "dots",
          },
          cornersSquareOptions: {
            color: qrCodeConfigs[index].squareColor,
            type: "extra-rounded",
          },
          backgroundOptions: {
            color: "#F5F5F5",
          },
        });
        qrCode.append(ref.current);
      }
    });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Explore Innovative QR Code Features
          </h1>
          <p className="mt-4 text-lg sm:text-xl opacity-90">
            Generate and share customized QR codes effortlessly. Designed to fit
            your needs.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Informational Section */}
          <section className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Text Section */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                What You Can Do with QR Codes
              </h2>
              <p className="text-gray-600 leading-relaxed">
                QR codes are versatile and can be used for a variety of purposes,
                including sharing links, displaying text, or facilitating payments.
                Customize the look and feel of your QR codes to match your branding.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Customizable design for dots and corner squares.</li>
                <li>Supports URLs, text, or any other encoded data.</li>
                <li>Real-time QR code preview with beautiful effects.</li>
              </ul>
            </div>

            {/* QR Preview Section */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {qrCodeRefs.map((ref, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
                >
                  <div ref={ref} className="qr-code w-36 h-36"></div>
                  <p className="mt-4 text-gray-800 font-medium text-center">
                    Demo QR Code {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-10 w-full flex items-center justify-center">
          <Link href={'/new'} className="bg-white text-blue-600 px-8 py-4 text-xl font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50">
            Explore Now
          </Link>
        </div>

          {/* Skeleton/Placeholder Section */}
          <section className="mt-16 space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
              Additional Features Coming Soon
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Skeleton Block */}
              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow flex flex-col items-center justify-center"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
                    <p className="mt-6 text-gray-500 text-center">
                      Coming Soon
                    </p>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} QRCode Innovations. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
