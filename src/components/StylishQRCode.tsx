
import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling, { DotType, CornerSquareType } from "qr-code-styling";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import Image from "next/image";

const qrCodeStyles = [
    { name: "Red Square", dotsOptions: { type: "square" as DotType }, cornersSquareOptions: { type: "square" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#000000" },
    { name: "Green Dots", dotsOptions: { type: "dots" as DotType }, cornersSquareOptions: { type: "extra-rounded" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#4caf50" },
    { name: "Blue Dots", dotsOptions: { type: "dots" as DotType }, cornersSquareOptions: { type: "dot" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#2196f3" },
    { name: "Orange Classy", dotsOptions: { type: "classy" as DotType }, cornersSquareOptions: { type: "square" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#ff5722" },
    { name: "Purple Classy Rounded", dotsOptions: { type: "classy-rounded" as DotType }, cornersSquareOptions: { type: "extra-rounded" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#9c27b0" },
    { name: "Cyan Rounded Dots", dotsOptions: { type: "dots" as DotType }, cornersSquareOptions: { type: "rounded" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#00bcd4" },
    { name: "Orange Dotted", dotsOptions: { type: "dots" as DotType }, cornersSquareOptions: { type: "dot" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#ff9800" },
    { name: "Pink Diamond", dotsOptions: { type: "diamond" as DotType }, cornersSquareOptions: { type: "rounded" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#e91e63" },
    { name: "Purple Star", dotsOptions: { type: "star" as DotType }, cornersSquareOptions: { type: "classy-rounded" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#673ab7" },
    { name: "Teal Rectangular", dotsOptions: { type: "rect" as DotType }, cornersSquareOptions: { type: "rounded" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#009688" },
    { name: "Brown Rounded Dots", dotsOptions: { type: "dots" as DotType }, cornersSquareOptions: { type: "rounded" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#795548" },
    { name: "Blue Classy", dotsOptions: { type: "classy" as DotType }, cornersSquareOptions: { type: "square" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#3f51b5" },
    { name: "Gray Classy Rounded", dotsOptions: { type: "classy-rounded" as DotType }, cornersSquareOptions: { type: "rounded" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#9e9e9e" },
    { name: "Blue Gray Rounded", dotsOptions: { type: "rounded" as DotType }, cornersSquareOptions: { type: "extra-rounded" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#607d8b" },
    { name: "Light Green Square", dotsOptions: { type: "square" as DotType }, cornersSquareOptions: { type: "dot" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#8bc34a" },
    { name: "Yellow Star", dotsOptions: { type: "star" as DotType }, cornersSquareOptions: { type: "dot" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#ffc107" },
    { name: "Bright Yellow Dots", dotsOptions: { type: "dots" as DotType }, cornersSquareOptions: { type: "square" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#ffeb3b" },
    { name: "Cyan Classy Rounded", dotsOptions: { type: "classy-rounded" as DotType }, cornersSquareOptions: { type: "rounded" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#00e5ff" },
    { name: "Orange Extra-Rounded", dotsOptions: { type: "square" as DotType }, cornersSquareOptions: { type: "extra-rounded" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#ff5722" },
    { name: "Bright Red Dots", dotsOptions: { type: "dot" as DotType }, cornersSquareOptions: { type: "classy-rounded" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#ff1744" },
    { name: "Purple Dotted", dotsOptions: { type: "dots" as DotType }, cornersSquareOptions: { type: "dot" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#8e24aa" },
    { name: "Blue Extra-Rounded Classy", dotsOptions: { type: "classy" as DotType }, cornersSquareOptions: { type: "extra-rounded" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#3f51b5" },
    { name: "Dark Purple Square", dotsOptions: { type: "classy-rounded" as DotType }, cornersSquareOptions: { type: "square" as CornerSquareType }, backgrouondColor: "#ffffff", color: "#7b1fa2" },
];

export default function StylishQRCode() {
    const [url, setUrl] = useState("https://example.com");
    const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(0);
    const [bgColor, setBgColor] = useState("#ffffff");
    const [qrColor, setQrColor] = useState("#000000");
    const [isGradient, setIsGradient] = useState(false);
    const [gradientColors, setGradientColors] = useState(["#ff7e5f", "#feb47b"]);
    const [logo, setLogo] = useState<File | null>(null);
    const [title, setTitle] = useState("Scan Me");
    const [textContent, setTextContent] = useState("");
    const [showTitle, setShowTitle] = useState(true);
    const [showText, setShowText] = useState(true);


    const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const qrCodeRef = useRef<HTMLDivElement>(null);
    const qrCodeInstance = useRef<QRCodeStyling | null>(null);

    const handleStyleSelection = (index: number) => {
        setSelectedStyleIndex(index);
    };

    useEffect(() => {
        if (selectedStyleIndex === null || selectedStyleIndex === undefined) return;

        // Calculate the background color based on whether gradient is enabled
        const defaultBgColor = isGradient
            ? `linear-gradient(45deg, ${gradientColors.join(", ")})`
            : bgColor;

        // Set QR color from the selected style or default to black
        const defaultQrColor = qrColor || "#000000";

        // Set QR code options
        const qrOptions = {
            width: 300,
            height: 300,
            data: url,
            dotsOptions: {
                color: defaultQrColor,
                ...qrCodeStyles[selectedStyleIndex]?.dotsOptions,
            },
            cornersSquareOptions: qrCodeStyles[selectedStyleIndex]?.cornersSquareOptions,
            backgroundOptions: {
                color: isGradient ? `linear-gradient(45deg, ${gradientColors.join(", ")})` : defaultBgColor,
            },
            image: logo ? URL.createObjectURL(logo) : undefined,
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 10,
            },
        };

        // Update QR code instance
        if (qrCodeRef.current) {
            qrCodeRef.current.innerHTML = ""; // Clear existing QR code
            qrCodeInstance.current = new QRCodeStyling(qrOptions);
            qrCodeInstance.current.append(qrCodeRef.current); // Re-append updated QR code
        }
    }, [url, selectedStyleIndex, qrColor, bgColor, isGradient, gradientColors, logo]);

    useEffect(() => {
        qrCodeStyles.forEach((style, index) => {
            const qrCodeInstance = new QRCodeStyling({
                ...style,
                width: 85,
                height: 85,
                data: url, // Your URL or data for the QR code
                backgroundOptions: {
                    color: bgColor, // Customize background color if needed
                },
                dotsOptions: {
                    ...style.dotsOptions,
                    color: style.color, // Apply the style's color to the dots
                },
            });

            // Append the QR code to the corresponding div
            const qrContainer = document.getElementById(`qr-preview-${index}`);
            if (qrContainer && qrContainer.childElementCount === 0) {
                qrCodeInstance.append(qrContainer);
            }
        });
    }, [qrCodeStyles, url, bgColor]);

    const handleDownloadQRCode = () => {
        if (qrCodeRef.current) {
            // Get the canvas element from the QR code container
            const canvas = qrCodeRef.current.querySelector('canvas');

            if (canvas) {
                // Create a new canvas with padding
                const padding = 20;
                const newCanvas = document.createElement('canvas');
                const ctx = newCanvas.getContext('2d');

                if (ctx) {
                    // Set the new canvas size (original QR size + padding)
                    newCanvas.width = canvas.width + padding * 2;
                    newCanvas.height = canvas.height + padding * 2;

                    // Fill the background with the QR's background color
                    ctx.fillStyle = bgColor; // Use the background color from your QR settings
                    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

                    // Draw the QR code on the new canvas with padding
                    ctx.drawImage(canvas, padding, padding);

                    // Download the new canvas as an image
                    const dataUrl = newCanvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = 'my-qr-code-with-padding.png';
                    link.click();
                }
            }
        }
    };



    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setSelectedLogo(reader.result as string);
            reader.readAsDataURL(file);
            setLogo(file)
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveLogo = () => {
        setSelectedLogo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input
        }
    };

    return (
        <div className="min-h-screen h-screen flex flex-col lg:flex-row bg-gray-50 text-black">
            {/* Sidebar Controls */}
            <div className="lg:w-1/3 w-full bg-white shadow p-6 space-y-6 overflow-y-auto h-full">
                <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
    
                {/* URL Input */}
                <div>
                    <label htmlFor="url" className="block text-sm font-medium mb-2">
                        URL
                    </label>
                    <input
                        id="url"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Enter a URL"
                    />
                </div>
    
                {/* QR Code Title */}
                <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Enter title"
                    />
                    <label className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            checked={showTitle}
                            onChange={() => setShowTitle(!showTitle)}
                            className="mr-2"
                        />
                        Show Title
                    </label>
                </div>
    
                {/* QR Code Text */}
                <div>
                    <label className="block text-sm font-medium mb-2">Text</label>
                    <textarea
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="Add additional text"
                    />
                    <label className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            checked={showText}
                            onChange={() => setShowText(!showText)}
                            className="mr-2"
                        />
                        Show Text
                    </label>
                </div>
    
                {/* Color Options */}
                <section className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-xl shadow-md">
                    <div className="flex flex-col items-center w-[48%]">
                        <label className="block text-sm font-medium mb-2 text-gray-600">
                            Background Color
                        </label>
                        <div className="w-full h-14 rounded-lg overflow-hidden shadow-md bg-white flex justify-center items-center relative">
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-full h-full cursor-pointer border-none appearance-none"
                                title="Select Background Color"
                            />
                            <span className="absolute bottom-1 right-2 text-xs text-gray-500">
                                {bgColor.toUpperCase()}
                            </span>
                        </div>
                    </div>
    
                    <div className="flex flex-col items-center w-[48%]">
                        <label className="block text-sm font-medium mb-2 text-gray-600">
                            QR Code Color
                        </label>
                        <div className="w-full h-14 rounded-lg overflow-hidden shadow-md bg-white flex justify-center items-center relative">
                            <input
                                type="color"
                                value={qrColor}
                                onChange={(e) => setQrColor(e.target.value)}
                                className="w-full h-full cursor-pointer border-none appearance-none"
                                title="Select QR Code Color"
                            />
                            <span className="absolute bottom-1 right-2 text-xs text-gray-500">
                                {qrColor.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </section>
    
                {/* Logo Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Upload Logo</label>
                    <div className="flex items-center gap-4">
                        {/* Display Logo Preview */}
                        {selectedLogo ? (
                            <div className="relative">
                                <Image
                                    src={selectedLogo}
                                    alt="Uploaded Logo"
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-md object-cover border border-gray-300"
                                />
                                <button
                                    onClick={handleRemoveLogo}
                                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={triggerFileUpload}
                                className="flex flex-col items-center justify-center w-16 h-16 rounded-md bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200 hover:text-gray-800 shadow-sm transition-all"
                                title="Upload Logo"
                            >
                                <MdOutlineFileUpload className="text-3xl" />
                                <span className="text-xs mt-1">Upload</span>
                            </button>
                        )}
    
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleLogoUpload}
                        />
                    </div>
                </div>
    
                {/* Style Selection */}
                <div>
                    <h2 className="text-sm font-medium mb-2">Select Style</h2>
                    <div className="grid grid-cols-4 gap-2">
                        {qrCodeStyles.map((style, index) => (
                            <div
                                key={index}
                                className={`border rounded-md cursor-pointer ${selectedStyleIndex === index ? "border-blue-500" : "border-gray-300"
                                    }`}
                                onClick={() => handleStyleSelection(index)}
                            >
                                {/* QR Code Preview */}
                                <div
                                    className={`flex justify-center items-center h-28`} // Increased height to match QR size
                                    id={`qr-preview-${index}`}
                                />
                                <p className="text-[0.6rem] mt-0.5 p-0.5 px-2 w-full">{style?.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    
            {/* Preview */}
            <div className="lg:w-2/3 w-full flex flex-col justify-center items-center p-6 bg-gray-100 space-y-4">
                <div className="relative w-full flex justify-center items-center">
                    {showTitle && <h1 className="absolute -top-8 text-lg font-bold">{title}</h1>}
                    <div ref={qrCodeRef} className="mb-4" />
                    {showText && <p className="mt-2 text-sm">{textContent}</p>}
                </div>
    
                {/* Download Button */}
                <button
                    onClick={handleDownloadQRCode}
                    className="flex items-center px-4 py-2 mt-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <FaDownload className="mr-2" /> {/* Download icon */}
                    Download QR Code
                </button>
            </div>
        </div>
    );
    
}

