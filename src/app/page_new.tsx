"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toPng } from "html-to-image";

interface BulletPoint {
  id: number;
  text: string;
}

export default function Home() {
  const [title, setTitle] = useState("Flixy TV Smart Stick");
  const [subtitle, setSubtitle] = useState("2025 Edition");
  const [price, setPrice] = useState("Turn Any TV Smart for Just $39!");
  const [productImage, setProductImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#7ba5b8");
  const [isDragOver, setIsDragOver] = useState(false);
  const [bulletPoints, setBulletPoints] = useState<BulletPoint[]>([
    { id: 1, text: "Plug & Play HDMI Setup" },
    { id: 2, text: "Crisp 1080p HD Streaming" },
    { id: 3, text: "Works with Top Streaming Apps" },
    { id: 4, text: "30-Day Money-Back Guarantee" },
    { id: 5, text: "Lightweight, Pocket-Friendly Design" },
  ]);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProductImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const updateBulletPoint = (id: number, text: string) => {
    setBulletPoints((prev) =>
      prev.map((point) => (point.id === id ? { ...point, text } : point))
    );
  };

  const downloadAsImage = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, {
          quality: 1,
          pixelRatio: 1,
          backgroundColor: "white",
          width: 1200,
          height: 628,
        });

        const link = document.createElement("a");
        link.download = "product-ad-1200x628.png";
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Product Ad Generator
        </h1>

        {/* Generate Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            Generate Form
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Basic Details Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marketing Message
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Marketing message"
                />
              </div>

              {/* Features Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Features
                </h3>
                <div className="space-y-3">
                  {bulletPoints.map((point) => (
                    <div key={point.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Feature {point.id}
                      </label>
                      <input
                        type="text"
                        value={point.text}
                        onChange={(e) =>
                          updateBulletPoint(point.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Feature ${point.id}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Image Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Image
                </label>

                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
                    isDragOver
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {productImage ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden shadow-md">
                        <Image
                          src={productImage}
                          alt="Product preview"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Image uploaded successfully
                        </p>
                        <button
                          onClick={() => setProductImage(null)}
                          className="text-sm text-red-600 hover:text-red-700 underline"
                        >
                          Remove image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto text-gray-400">
                        <svg
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="w-full h-full"
                        >
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                          <path
                            d="M12,11L16,15H13V19H11V15H8L12,11Z"
                            opacity="0.6"
                          />
                        </svg>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-1">
                          Upload Product Image
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Drag and drop or click to browse
                        </p>

                        <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" />
                          </svg>
                          Choose File
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Color Picker Column */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v11H4V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Background Color
                </label>

                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor }}
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="#7cce09"
                  />
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    Quick Colors
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      "#4285f4",
                      "#ea4335",
                      "#00d084",
                      "#ff9500",
                      "#9c27b0",
                      "#e91e63",
                      "#00bcd4",
                      "#ff5722",
                      "#673ab7",
                      "#8bc34a",
                      "#009688",
                      "#ffc107",
                      "#f44336",
                      "#4caf50",
                      "#9c27b0",
                      "#e91e63",
                      "#2196f3",
                      "#ff5722",
                      "#3f51b5",
                      "#7cce09",
                    ].map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setBackgroundColor(color)}
                        className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="sr-only"
                />
              </div>

              {/* Download Button */}
              <div className="pt-4">
                <button
                  onClick={downloadAsImage}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
                >
                  Download as PNG (1200×628)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
            Preview (1200×628px)
          </h2>

          <div className="flex justify-center overflow-auto">
            <div
              ref={cardRef}
              className="w-[1200px] h-[628px] rounded-2xl shadow-2xl overflow-hidden relative bg-white flex-shrink-0"
            >
              {/* Diagonal Background */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor} 45%, #ffffff 45%, #ffffff 100%)`,
                }}
              />

              <div className="relative h-full p-12 flex">
                {/* Left Side - Product Image and Price */}
                <div className="w-1/2 flex flex-col justify-between">
                  {/* Marketing Message */}
                  <div className="text-gray-800 mb-8">
                    <h3 className="text-2xl font-bold leading-tight">
                      {price}
                    </h3>
                  </div>

                  {/* Product Image */}
                  <div className="flex justify-center mb-8">
                    {productImage ? (
                      <div className="w-48 h-48 flex items-center justify-center">
                        <Image
                          src={productImage}
                          alt="Product"
                          width={192}
                          height={192}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm text-center">
                          Upload Product Image
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Title and Features */}
                <div className="w-1/2 flex flex-col pl-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                      {title}
                    </h1>
                    <p className="text-2xl text-gray-600 italic">{subtitle}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 flex-1">
                    {bulletPoints.map((point) => (
                      <div key={point.id} className="flex items-center">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-4 shadow-sm border border-gray-200 flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-gray-200 flex-1">
                          <span className="text-lg text-gray-700 font-medium">
                            {point.text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
