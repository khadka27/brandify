"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toPng } from "html-to-image";

interface BulletPoint {
  id: number;
  text: string;
}

interface DesignTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  headerTextColor: string;
  bulletTextColor: string;
  diagonalAngle: number;
  diagonalPosition: number;
  layout:
    | "diagonal"
    | "fullWidth"
    | "split"
    | "centered"
    | "overlay"
    | "minimal";
  preview: string;
}

interface ColorPreset {
  name: string;
  value: string;
  category: "solid" | "gradient";
}

interface GradientSettings {
  enabled: boolean;
  colors: string[];
  direction: string;
  type: "linear" | "radial";
}

export default function Home() {
  const [title, setTitle] = useState("Flixy TV Smart Stick");
  const [subtitle, setSubtitle] = useState("2025 Edition");
  const [price, setPrice] = useState("Turn Any TV Smart for Just $39!");
  const [productImage, setProductImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#7ba5b8");
  const [headerTextColor, setHeaderTextColor] = useState("#000000");
  const [bulletTextColor, setBulletTextColor] = useState("#ffffff");
  const [diagonalAngle, setDiagonalAngle] = useState(135);
  const [diagonalPosition, setDiagonalPosition] = useState(50);
  const [currentLayout, setCurrentLayout] = useState<
    "diagonal" | "fullWidth" | "split" | "centered" | "overlay" | "minimal"
  >("diagonal");
  const [isDragOver, setIsDragOver] = useState(false);

  // Advanced color features
  const [rgbMode, setRgbMode] = useState(false);
  const [gradientSettings, setGradientSettings] = useState<GradientSettings>({
    enabled: false,
    colors: ["#7ba5b8", "#4285f4"],
    direction: "135deg",
    type: "linear",
  });
  const [currentColorType, setCurrentColorType] = useState<
    "background" | "header" | "bullet"
  >("background");

  const [bulletPoints, setBulletPoints] = useState<BulletPoint[]>([
    { id: 1, text: "Plug & Play HDMI Setup" },
    { id: 2, text: "Crisp 1080p HD Streaming" },
    { id: 3, text: "Works with Top Streaming Apps" },
    { id: 4, text: "30-Day Money-Back Guarantee" },
    { id: 5, text: "Lightweight, Pocket-Friendly Design" },
  ]);

  const designTemplates: DesignTemplate[] = [
    {
      id: "classic",
      name: "🎯 Classic Diagonal (Primary)",
      backgroundColor: "#7ba5b8",
      headerTextColor: "#000000",
      bulletTextColor: "#ffffff",
      diagonalAngle: 135,
      diagonalPosition: 50,
      layout: "diagonal",
      preview: "🔵",
    },
    {
      id: "fullwidth",
      name: "🌟 Full Width Hero",
      backgroundColor: "#10b981",
      headerTextColor: "#ffffff",
      bulletTextColor: "#ffffff",
      diagonalAngle: 120,
      diagonalPosition: 45,
      layout: "fullWidth",
      preview: "🟢",
    },
    {
      id: "split",
      name: "⚡ Split Screen",
      backgroundColor: "#f97316",
      headerTextColor: "#000000",
      bulletTextColor: "#ffffff",
      diagonalAngle: 150,
      diagonalPosition: 55,
      layout: "split",
      preview: "🟠",
    },
    {
      id: "centered",
      name: "🎪 Centered Focus",
      backgroundColor: "#8b5cf6",
      headerTextColor: "#ffffff",
      bulletTextColor: "#ffffff",
      diagonalAngle: 135,
      diagonalPosition: 48,
      layout: "centered",
      preview: "🟣",
    },
    {
      id: "overlay",
      name: "🖼️ Image Overlay",
      backgroundColor: "#ef4444",
      headerTextColor: "#ffffff",
      bulletTextColor: "#ffffff",
      diagonalAngle: 140,
      diagonalPosition: 52,
      layout: "overlay",
      preview: "🔴",
    },
    {
      id: "minimal",
      name: "✨ Minimal Clean",
      backgroundColor: "#0891b2",
      headerTextColor: "#ffffff",
      bulletTextColor: "#ffffff",
      diagonalAngle: 125,
      diagonalPosition: 47,
      layout: "minimal",
      preview: "🔷",
    },
  ];

  const cardRef = useRef<HTMLDivElement>(null);

  const quickColors = [
    "#7ba5b8",
    "#10b981",
    "#f97316",
    "#ef4444",
    "#8b5cf6",
    "#0891b2",
    "#06b6d4",
    "#84cc16",
    "#eab308",
    "#f59e0b",
    "#ec4899",
    "#6366f1",
  ];

  const colorPresets: ColorPreset[] = [
    // Solid Colors - Business
    { name: "Corporate Blue", value: "#1e40af", category: "solid" },
    { name: "Professional Gray", value: "#374151", category: "solid" },
    { name: "Success Green", value: "#059669", category: "solid" },
    { name: "Warning Orange", value: "#d97706", category: "solid" },
    { name: "Error Red", value: "#dc2626", category: "solid" },
    { name: "Royal Purple", value: "#7c3aed", category: "solid" },

    // Solid Colors - Vibrant
    { name: "Electric Blue", value: "#0ea5e9", category: "solid" },
    { name: "Emerald Green", value: "#10b981", category: "solid" },
    { name: "Hot Pink", value: "#ec4899", category: "solid" },
    { name: "Amber Gold", value: "#f59e0b", category: "solid" },
    { name: "Violet", value: "#8b5cf6", category: "solid" },
    { name: "Cyan", value: "#06b6d4", category: "solid" },

    // Gradient Colors
    {
      name: "Ocean Breeze",
      value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      category: "gradient",
    },
    {
      name: "Sunset Glow",
      value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      category: "gradient",
    },
    {
      name: "Forest Deep",
      value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      category: "gradient",
    },
    {
      name: "Royal Fade",
      value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      category: "gradient",
    },
    {
      name: "Fire Burst",
      value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      category: "gradient",
    },
    {
      name: "Arctic Aurora",
      value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      category: "gradient",
    },
    {
      name: "Galaxy Dark",
      value: "linear-gradient(135deg, #434343 0%, #000000 100%)",
      category: "gradient",
    },
    {
      name: "Neon Bright",
      value: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
      category: "gradient",
    },
  ];

  // RGB to Hex conversion
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Hex to RGB conversion
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Generate gradient CSS
  const generateGradient = () => {
    if (!gradientSettings.enabled || gradientSettings.colors.length < 2) {
      return backgroundColor;
    }

    const colorStops = gradientSettings.colors
      .map((color, index) => {
        const percentage = (index / (gradientSettings.colors.length - 1)) * 100;
        return `${color} ${percentage}%`;
      })
      .join(", ");

    if (gradientSettings.type === "radial") {
      return `radial-gradient(circle, ${colorStops})`;
    } else {
      return `linear-gradient(${gradientSettings.direction}, ${colorStops})`;
    }
  };

  const applyDesignTemplate = (template: DesignTemplate) => {
    setBackgroundColor(template.backgroundColor);
    setHeaderTextColor(template.headerTextColor);
    setBulletTextColor(template.bulletTextColor);
    setDiagonalAngle(template.diagonalAngle);
    setDiagonalPosition(template.diagonalPosition);
    setCurrentLayout(template.layout);
  };

  const renderLayoutContent = () => {
    const commonImageElement = productImage ? (
      <div className="w-[400px] h-[400px] flex items-center justify-center">
        <Image
          src={productImage}
          alt="Product"
          width={400}
          height={400}
          className="max-w-full max-h-full object-contain drop-shadow-2xl"
        />
      </div>
    ) : (
      <div className="w-[400px] h-[400px] bg-gray-200/50 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-lg text-center">
          Upload Product Image
        </span>
      </div>
    );

    switch (currentLayout) {
      case "fullWidth":
        return (
          <div className="relative h-full">
            {/* Full width product image as background */}
            {productImage && (
              <div className="absolute inset-0 opacity-20">
                <Image
                  src={productImage}
                  alt="Product Background"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="relative h-full p-16 flex flex-col justify-center items-center text-center">
              <h1
                className="text-6xl font-bold mb-4"
                style={{ color: headerTextColor }}
              >
                {title}
              </h1>
              <h2
                className="text-3xl font-medium mb-8"
                style={{ color: headerTextColor }}
              >
                {subtitle}
              </h2>
              <h3
                className="text-4xl font-bold mb-8"
                style={{ color: headerTextColor }}
              >
                {price}
              </h3>
              <div className="w-[300px] h-[300px] mb-8">
                {commonImageElement}
              </div>
              <div className="grid grid-cols-1 gap-3 max-w-2xl">
                {bulletPoints.slice(0, 4).map((point) => (
                  <div key={point.id} className="w-full">
                    <div
                      className="flex items-center space-x-3 rounded-full px-5 py-3 shadow-lg border backdrop-blur-sm"
                      style={{
                        backgroundColor: `${backgroundColor}20`,
                        borderColor: `${backgroundColor}40`,
                        minHeight: "56px",
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm flex-shrink-0"
                        style={{
                          backgroundColor: bulletTextColor,
                          color: backgroundColor,
                        }}
                      >
                        ✓
                      </div>
                      <span
                        className="text-lg font-medium flex-1 text-center"
                        style={{ color: bulletTextColor }}
                      >
                        {point.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "split":
        return (
          <div className="h-full flex">
            {/* Left half - Product image */}
            <div className="w-1/2 flex items-center justify-center p-8">
              <div className="w-[500px] h-[500px]">
                {productImage ? (
                  <Image
                    src={productImage}
                    alt="Product"
                    width={500}
                    height={500}
                    className="max-w-full max-h-full object-contain drop-shadow-2xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200/50 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xl text-center">
                      Upload Product Image
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Right half - Content */}
            <div className="w-1/2 p-16 flex flex-col justify-center">
              <h1
                className="text-5xl font-bold mb-4"
                style={{ color: headerTextColor }}
              >
                {title}
              </h1>
              <h2
                className="text-2xl font-medium mb-6"
                style={{ color: headerTextColor }}
              >
                {subtitle}
              </h2>
              <h3
                className="text-3xl font-bold mb-8"
                style={{ color: headerTextColor }}
              >
                {price}
              </h3>
              <div className="space-y-3">
                {bulletPoints.slice(0, 5).map((point) => (
                  <div key={point.id} className="w-full">
                    <div
                      className="flex items-center space-x-3 rounded-full px-5 py-3 shadow-lg border backdrop-blur-sm"
                      style={{
                        backgroundColor: `${backgroundColor}20`,
                        borderColor: `${backgroundColor}40`,
                        minHeight: "56px",
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm flex-shrink-0"
                        style={{
                          backgroundColor: bulletTextColor,
                          color: backgroundColor,
                        }}
                      >
                        ✓
                      </div>
                      <span
                        className="text-lg font-medium flex-1"
                        style={{ color: bulletTextColor }}
                      >
                        {point.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "centered":
        return (
          <div className="h-full flex flex-col items-center justify-center p-16 text-center">
            <h1
              className="text-6xl font-bold mb-4"
              style={{ color: headerTextColor }}
            >
              {title}
            </h1>
            <h2
              className="text-3xl font-medium mb-6"
              style={{ color: headerTextColor }}
            >
              {subtitle}
            </h2>
            <div className="w-[350px] h-[350px] mb-8">{commonImageElement}</div>
            <h3
              className="text-4xl font-bold mb-8"
              style={{ color: headerTextColor }}
            >
              {price}
            </h3>
            <div className="grid grid-cols-1 gap-3 max-w-lg">
              {bulletPoints.slice(0, 5).map((point) => (
                <div key={point.id} className="w-full">
                  <div
                    className="flex items-center space-x-3 rounded-full px-5 py-3 shadow-lg border backdrop-blur-sm"
                    style={{
                      backgroundColor: `${backgroundColor}20`,
                      borderColor: `${backgroundColor}40`,
                      minHeight: "56px",
                    }}
                  >
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm flex-shrink-0"
                      style={{
                        backgroundColor: bulletTextColor,
                        color: backgroundColor,
                      }}
                    >
                      ✓
                    </div>
                    <span
                      className="text-lg font-medium flex-1 text-center"
                      style={{ color: bulletTextColor }}
                    >
                      {point.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "overlay":
        return (
          <div className="relative h-full">
            {/* Full background product image */}
            {productImage && (
              <div className="absolute inset-0">
                <Image
                  src={productImage}
                  alt="Product Background"
                  fill
                  className="object-cover opacity-30"
                />
              </div>
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            {/* Content overlay */}
            <div className="relative h-full p-16 flex">
              <div className="w-1/2 flex flex-col justify-center">
                <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
                  {title}
                </h1>
                <h2 className="text-2xl font-medium mb-6 text-white drop-shadow-lg">
                  {subtitle}
                </h2>
                <h3 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">
                  {price}
                </h3>
                <div className="space-y-3">
                  {bulletPoints.slice(0, 4).map((point) => (
                    <div key={point.id} className="w-full">
                      <div
                        className="flex items-center space-x-3 rounded-full px-5 py-3 shadow-lg border backdrop-blur-sm"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                          borderColor: "rgba(255, 255, 255, 0.3)",
                          minHeight: "56px",
                        }}
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm flex-shrink-0 bg-white text-black">
                          ✓
                        </div>
                        <span className="text-lg font-medium flex-1 text-white drop-shadow-lg">
                          {point.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-1/2 flex items-center justify-center">
                <div className="w-[400px] h-[400px] bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                  {commonImageElement}
                </div>
              </div>
            </div>
          </div>
        );

      case "minimal":
        return (
          <div className="h-full p-16 flex items-center">
            <div className="w-1/3 flex justify-center">
              <div className="w-[300px] h-[300px]">{commonImageElement}</div>
            </div>
            <div className="w-2/3 pl-16">
              <h1
                className="text-4xl font-light mb-3"
                style={{ color: headerTextColor }}
              >
                {title}
              </h1>
              <h2
                className="text-xl font-light mb-8 opacity-80"
                style={{ color: headerTextColor }}
              >
                {subtitle}
              </h2>
              <h3
                className="text-3xl font-bold mb-12"
                style={{ color: headerTextColor }}
              >
                {price}
              </h3>
              <div className="space-y-3">
                {bulletPoints.slice(0, 5).map((point) => (
                  <div key={point.id} className="w-full">
                    <div
                      className="flex items-center space-x-3 rounded-full px-5 py-3 shadow-lg border backdrop-blur-sm"
                      style={{
                        backgroundColor: `${backgroundColor}20`,
                        borderColor: `${backgroundColor}40`,
                        minHeight: "56px",
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm flex-shrink-0"
                        style={{
                          backgroundColor: bulletTextColor,
                          color: backgroundColor,
                        }}
                      >
                        ✓
                      </div>
                      <span
                        className="text-lg font-medium flex-1"
                        style={{ color: bulletTextColor }}
                      >
                        {point.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default: // diagonal
        return (
          <div className="relative h-full p-16 flex">
            {/* Left Side - Marketing Message and Product Image */}
            <div className="w-1/2 flex flex-col justify-between pr-4">
              <div className="mb-8">
                <h3
                  className="text-3xl font-bold leading-tight"
                  style={{ color: headerTextColor }}
                >
                  {price}
                </h3>
              </div>
              <div className="flex justify-start items-center flex-1 -ml-8">
                {commonImageElement}
              </div>
            </div>
            {/* Right Side - Title and Features */}
            <div className="w-1/2 flex flex-col pl-4">
              <div className="text-center mb-12">
                <h1
                  className="text-5xl font-bold mb-4"
                  style={{ color: headerTextColor }}
                >
                  {title}
                </h1>
                <h2
                  className="text-2xl font-medium"
                  style={{ color: headerTextColor }}
                >
                  {subtitle}
                </h2>
              </div>
              <div className="space-y-3 flex-1">
                {bulletPoints.map((point) => (
                  <div key={point.id} className="w-full">
                    <div
                      className="flex items-center space-x-3 rounded-full px-5 py-3 shadow-lg border backdrop-blur-sm"
                      style={{
                        backgroundColor: `${backgroundColor}20`,
                        borderColor: `${backgroundColor}40`,
                        minHeight: "56px",
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm flex-shrink-0"
                        style={{
                          backgroundColor: bulletTextColor,
                          color: backgroundColor,
                        }}
                      >
                        ✓
                      </div>
                      <span
                        className="text-lg font-medium flex-1"
                        style={{ color: bulletTextColor }}
                      >
                        {point.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

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
              {/* Design Templates */}
              <div className="mb-8">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  Design Templates
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {designTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => applyDesignTemplate(template)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left group hover:shadow-md ${
                        currentLayout === template.layout
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : template.id === "classic"
                          ? "border-green-400 bg-green-50 hover:border-green-500"
                          : "border-gray-200 hover:border-blue-400"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{template.preview}</span>
                        <div className="flex-1">
                          <span
                            className={`text-sm font-medium ${
                              currentLayout === template.layout
                                ? "text-blue-700"
                                : template.id === "classic"
                                ? "text-green-700"
                                : "text-gray-700 group-hover:text-blue-600"
                            }`}
                          >
                            {template.name}
                          </span>
                          {template.id === "classic" && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              Default Design
                            </div>
                          )}
                          {currentLayout === template.layout && (
                            <div className="text-xs text-blue-600 font-medium mt-1">
                              ✓ Currently Selected
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <div
                          className="w-5 h-5 rounded-sm border border-gray-300 shadow-sm"
                          style={{ backgroundColor: template.backgroundColor }}
                        />
                        <div
                          className="w-5 h-5 rounded-sm border border-gray-300 shadow-sm"
                          style={{ backgroundColor: template.headerTextColor }}
                        />
                        <div
                          className="w-5 h-5 rounded-sm border border-gray-300 shadow-sm"
                          style={{ backgroundColor: template.bulletTextColor }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Background Color */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
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
                  Advanced Background Color
                </label>

                {/* Color Mode Toggle */}
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => setRgbMode(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !rgbMode
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Hex
                  </button>
                  <button
                    onClick={() => setRgbMode(true)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      rgbMode
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    RGB
                  </button>
                  <button
                    onClick={() =>
                      setGradientSettings((prev) => ({
                        ...prev,
                        enabled: !prev.enabled,
                      }))
                    }
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      gradientSettings.enabled
                        ? "bg-purple-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Gradient
                  </button>
                </div>

                {/* Current Color Display */}
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-sm"
                    style={{ background: generateGradient() }}
                  />
                  <div className="flex-1">
                    {!rgbMode ? (
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        placeholder="#7ba5b8"
                      />
                    ) : (
                      <div className="space-y-2">
                        {(() => {
                          const rgb = hexToRgb(backgroundColor) || {
                            r: 123,
                            g: 165,
                            b: 184,
                          };
                          return (
                            <>
                              <div className="flex space-x-2">
                                <div className="flex-1">
                                  <label className="text-xs text-gray-600">
                                    R
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="255"
                                    value={rgb.r}
                                    onChange={(e) =>
                                      setBackgroundColor(
                                        rgbToHex(
                                          parseInt(e.target.value),
                                          rgb.g,
                                          rgb.b
                                        )
                                      )
                                    }
                                    className="w-full"
                                  />
                                  <span className="text-xs text-gray-500">
                                    {rgb.r}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <label className="text-xs text-gray-600">
                                    G
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="255"
                                    value={rgb.g}
                                    onChange={(e) =>
                                      setBackgroundColor(
                                        rgbToHex(
                                          rgb.r,
                                          parseInt(e.target.value),
                                          rgb.b
                                        )
                                      )
                                    }
                                    className="w-full"
                                  />
                                  <span className="text-xs text-gray-500">
                                    {rgb.g}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <label className="text-xs text-gray-600">
                                    B
                                  </label>
                                  <input
                                    type="range"
                                    min="0"
                                    max="255"
                                    value={rgb.b}
                                    onChange={(e) =>
                                      setBackgroundColor(
                                        rgbToHex(
                                          rgb.r,
                                          rgb.g,
                                          parseInt(e.target.value)
                                        )
                                      )
                                    }
                                    className="w-full"
                                  />
                                  <span className="text-xs text-gray-500">
                                    {rgb.b}
                                  </span>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Gradient Controls */}
                {gradientSettings.enabled && (
                  <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="text-sm font-medium text-purple-800 mb-3">
                      Gradient Settings
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-purple-700 mb-1 block">
                          Type
                        </label>
                        <select
                          value={gradientSettings.type}
                          onChange={(e) =>
                            setGradientSettings((prev) => ({
                              ...prev,
                              type: e.target.value as "linear" | "radial",
                            }))
                          }
                          className="w-full px-2 py-1 border border-purple-300 rounded text-sm"
                        >
                          <option value="linear">Linear</option>
                          <option value="radial">Radial</option>
                        </select>
                      </div>

                      {gradientSettings.type === "linear" && (
                        <div>
                          <label className="text-xs text-purple-700 mb-1 block">
                            Direction
                          </label>
                          <select
                            value={gradientSettings.direction}
                            onChange={(e) =>
                              setGradientSettings((prev) => ({
                                ...prev,
                                direction: e.target.value,
                              }))
                            }
                            className="w-full px-2 py-1 border border-purple-300 rounded text-sm"
                          >
                            <option value="0deg">Top to Bottom</option>
                            <option value="90deg">Left to Right</option>
                            <option value="135deg">Diagonal ↘</option>
                            <option value="180deg">Bottom to Top</option>
                            <option value="270deg">Right to Left</option>
                            <option value="45deg">Diagonal ↗</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="text-xs text-purple-700 mb-2 block">
                          Colors
                        </label>
                        <div className="space-y-2">
                          {gradientSettings.colors.map((color, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="color"
                                value={color}
                                onChange={(e) => {
                                  const newColors = [
                                    ...gradientSettings.colors,
                                  ];
                                  newColors[index] = e.target.value;
                                  setGradientSettings((prev) => ({
                                    ...prev,
                                    colors: newColors,
                                  }));
                                }}
                                className="w-8 h-8 rounded border"
                              />
                              <input
                                type="text"
                                value={color}
                                onChange={(e) => {
                                  const newColors = [
                                    ...gradientSettings.colors,
                                  ];
                                  newColors[index] = e.target.value;
                                  setGradientSettings((prev) => ({
                                    ...prev,
                                    colors: newColors,
                                  }));
                                }}
                                className="flex-1 px-2 py-1 border border-purple-300 rounded text-xs font-mono"
                              />
                              {gradientSettings.colors.length > 2 && (
                                <button
                                  onClick={() => {
                                    const newColors =
                                      gradientSettings.colors.filter(
                                        (_, i) => i !== index
                                      );
                                    setGradientSettings((prev) => ({
                                      ...prev,
                                      colors: newColors,
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                          {gradientSettings.colors.length < 5 && (
                            <button
                              onClick={() => {
                                setGradientSettings((prev) => ({
                                  ...prev,
                                  colors: [...prev.colors, "#ffffff"],
                                }));
                              }}
                              className="w-full py-2 border border-dashed border-purple-300 rounded text-purple-600 hover:bg-purple-50 text-sm"
                            >
                              + Add Color
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Color Presets */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    Color Presets
                  </p>

                  {/* Solid Colors */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Solid Colors</p>
                    <div className="grid grid-cols-6 gap-2">
                      {colorPresets
                        .filter((preset) => preset.category === "solid")
                        .map((preset, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setBackgroundColor(preset.value);
                              setGradientSettings((prev) => ({
                                ...prev,
                                enabled: false,
                              }));
                            }}
                            className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ backgroundColor: preset.value }}
                            title={preset.name}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Gradient Colors */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">
                      Gradient Presets
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {colorPresets
                        .filter((preset) => preset.category === "gradient")
                        .map((preset, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              const gradientMatch = preset.value.match(
                                /linear-gradient\(([^,]+),([^)]+)\)/
                              );
                              if (gradientMatch) {
                                const direction = gradientMatch[1].trim();
                                const colorStops = gradientMatch[2]
                                  .split(",")
                                  .map((stop) => {
                                    const colorMatch = stop
                                      .trim()
                                      .match(/(#[a-fA-F0-9]{6})/);
                                    return colorMatch
                                      ? colorMatch[1]
                                      : "#000000";
                                  });
                                setGradientSettings({
                                  enabled: true,
                                  colors: colorStops.slice(0, 2),
                                  direction: direction,
                                  type: "linear",
                                });
                              }
                            }}
                            className="h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ background: preset.value }}
                            title={preset.name}
                          />
                        ))}
                    </div>
                  </div>
                </div>

                {/* Quick Colors */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    Quick Colors
                  </p>
                  <div className="grid grid-cols-6 gap-2">
                    {quickColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setBackgroundColor(color);
                          setGradientSettings((prev) => ({
                            ...prev,
                            enabled: false,
                          }));
                        }}
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

              {/* Header Text Color */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Header Text Color
                </label>

                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: headerTextColor }}
                  />
                  <input
                    type="text"
                    value={headerTextColor}
                    onChange={(e) => setHeaderTextColor(e.target.value)}
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    Quick Colors
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      "#000000",
                      "#ffffff",
                      "#374151",
                      "#6b7280",
                      "#9ca3af",
                      "#ef4444",
                      "#f97316",
                      "#eab308",
                      "#22c55e",
                      "#06b6d4",
                      "#3b82f6",
                      "#8b5cf6",
                      "#ec4899",
                      "#f43f5e",
                      "#84cc16",
                    ].map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setHeaderTextColor(color)}
                        className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bullet Text Color */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Bullet Points Color
                </label>

                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: bulletTextColor }}
                  />
                  <input
                    type="text"
                    value={bulletTextColor}
                    onChange={(e) => setBulletTextColor(e.target.value)}
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="#ffffff"
                  />
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    Quick Colors
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      "#ffffff",
                      "#000000",
                      "#374151",
                      "#6b7280",
                      "#9ca3af",
                      "#ef4444",
                      "#f97316",
                      "#eab308",
                      "#22c55e",
                      "#06b6d4",
                      "#3b82f6",
                      "#8b5cf6",
                      "#ec4899",
                      "#f43f5e",
                      "#84cc16",
                    ].map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setBulletTextColor(color)}
                        className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Diagonal Customization - only show for diagonal layout */}
              {currentLayout === "diagonal" && (
                <div className="mb-8">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Diagonal Design
                  </label>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Angle: {diagonalAngle}°
                      </label>
                      <input
                        type="range"
                        min="90"
                        max="180"
                        value={diagonalAngle}
                        onChange={(e) =>
                          setDiagonalAngle(Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>90°</span>
                        <span>135°</span>
                        <span>180°</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Position: {diagonalPosition}%
                      </label>
                      <input
                        type="range"
                        min="30"
                        max="70"
                        value={diagonalPosition}
                        onChange={(e) =>
                          setDiagonalPosition(Number(e.target.value))
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>30%</span>
                        <span>50%</span>
                        <span>70%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
              className="w-[1200px] h-[628px] rounded-none shadow-2xl overflow-hidden relative bg-white flex-shrink-0"
            >
              {/* Background - only show diagonal for diagonal layout */}
              {currentLayout === "diagonal" && (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${diagonalAngle}deg, ${generateGradient()} 0%, ${generateGradient()} ${diagonalPosition}%, #ffffff ${diagonalPosition}%, #ffffff 100%)`,
                  }}
                />
              )}

              {/* Solid background for other layouts */}
              {currentLayout !== "diagonal" && currentLayout !== "overlay" && (
                <div
                  className="absolute inset-0"
                  style={{ background: generateGradient() }}
                />
              )}

              {renderLayoutContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
