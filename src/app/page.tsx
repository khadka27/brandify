"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { toPng } from "html-to-image";

// Advanced Color Picker Component
interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  title: string;
  storageKey: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  isOpen,
  onClose,
  currentColor,
  onColorChange,
  title,
  storageKey,
}) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [rgb, setRgb] = useState({ r: 255, g: 0, b: 0 });
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isEyedropperActive, setIsEyedropperActive] = useState(false);
  const [eyedropperSupported, setEyedropperSupported] = useState(false);

  // Load recent colors from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`${storageKey}_recent`);
    if (saved) {
      setRecentColors(JSON.parse(saved));
    }

    // Check if EyeDropper API is supported
    if ("EyeDropper" in window) {
      setEyedropperSupported(true);
    }
  }, [storageKey]);

  // Convert hex to HSL
  const hexToHsl = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }, []);

  // Convert hex to RGB
  const hexToRgb = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }, []);

  // Convert HSL to hex
  const hslToHex = useCallback((h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (0 <= h && h < 1 / 6) {
      r = c;
      g = x;
      b = 0;
    } else if (1 / 6 <= h && h < 1 / 3) {
      r = x;
      g = c;
      b = 0;
    } else if (1 / 3 <= h && h < 1 / 2) {
      r = 0;
      g = c;
      b = x;
    } else if (1 / 2 <= h && h < 2 / 3) {
      r = 0;
      g = x;
      b = c;
    } else if (2 / 3 <= h && h < 5 / 6) {
      r = x;
      g = 0;
      b = c;
    } else if (5 / 6 <= h && h < 1) {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }, []);

  // Initialize color values when currentColor changes
  useEffect(() => {
    if (currentColor) {
      const hsl = hexToHsl(currentColor);
      const rgbValues = hexToRgb(currentColor);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      setRgb(rgbValues);
    }
  }, [currentColor, hexToHsl, hexToRgb]);

  // Update color when HSL values change
  useEffect(() => {
    const newColor = hslToHex(hue, saturation, lightness);
    const newRgb = hexToRgb(newColor);
    setRgb(newRgb);
  }, [hue, saturation, lightness, hslToHex, hexToRgb]);

  const handleColorSelect = (color: string) => {
    onColorChange(color); // Live update

    // Save to recent colors
    const newRecentColors = [
      color,
      ...recentColors.filter((c) => c !== color),
    ].slice(0, 12);
    setRecentColors(newRecentColors);
    localStorage.setItem(
      `${storageKey}_recent`,
      JSON.stringify(newRecentColors)
    );
  };

  const handleRgbChange = (component: "r" | "g" | "b", value: number) => {
    const newRgb = { ...rgb, [component]: Math.max(0, Math.min(255, value)) };
    setRgb(newRgb);
    const hex = `#${newRgb.r.toString(16).padStart(2, "0")}${newRgb.g
      .toString(16)
      .padStart(2, "0")}${newRgb.b.toString(16).padStart(2, "0")}`;
    handleColorSelect(hex);
    onColorChange(hex); // Live update for RGB changes
  };

  const copyColor = () => {
    navigator.clipboard.writeText(currentColor);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Eyedropper functionality
  const startEyedropper = async () => {
    if (!eyedropperSupported) {
      alert(
        "EyeDropper API is not supported in your browser. Please use Chrome 95+ or Edge 95+"
      );
      return;
    }

    try {
      setIsEyedropperActive(true);
      // @ts-expect-error - EyeDropper is not in TypeScript types yet
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      const pickedColor = result.sRGBHex;

      handleColorSelect(pickedColor);
      onColorChange(pickedColor);
      setIsEyedropperActive(false);
    } catch (error) {
      console.log("User cancelled eyedropper or error occurred:", error);
      setIsEyedropperActive(false);
    }
  };

  // Enhanced eyedropper with screen capture fallback
  const enhancedEyedropper = async () => {
    if (eyedropperSupported) {
      return startEyedropper();
    }

    // Try screen capture API as fallback
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" } as MediaTrackConstraints,
      });

      // Create a video element to capture the screen
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      video.addEventListener("loadedmetadata", () => {
        // Create canvas to capture frame
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        ctx?.drawImage(video, 0, 0);

        // Stop the stream
        stream.getTracks().forEach((track) => track.stop());

        // Create color picker overlay
        createColorPickerOverlay(canvas, ctx);
      });
    } catch (error) {
      console.log("Screen capture failed:", error);
      fallbackEyedropper();
    }
  };

  const createColorPickerOverlay = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D | null
  ) => {
    if (!ctx) return;

    // Create overlay div
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.3);
      z-index: 10000;
      cursor: crosshair;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Create canvas display
    const displayCanvas = canvas.cloneNode(true) as HTMLCanvasElement;
    displayCanvas.style.cssText = `
      max-width: 90vw;
      max-height: 90vh;
      border: 2px solid white;
      cursor: crosshair;
    `;

    overlay.appendChild(displayCanvas);
    document.body.appendChild(overlay);

    // Add click handler
    displayCanvas.addEventListener("click", (e) => {
      const rect = displayCanvas.getBoundingClientRect();
      const scaleX = canvas.width / displayCanvas.width;
      const scaleY = canvas.height / displayCanvas.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      // Get pixel color
      const imageData = ctx.getImageData(x, y, 1, 1);
      const [r, g, b] = imageData.data;
      const hexColor = `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

      // Apply color
      handleColorSelect(hexColor);
      onColorChange(hexColor);

      // Remove overlay
      overlay.remove();
    });

    // ESC to cancel
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", handleEscape);
      }
    };
    document.addEventListener("keydown", handleEscape);
  };

  // Simple fallback for when all advanced features fail
  const fallbackEyedropper = () => {
    const notification = document.createElement("div");
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        text-align: center;
        border: 1px solid #ddd;
      ">
        <h3 style="margin: 0 0 12px 0; color: #333;">Eyedropper Not Available</h3>
        <p style="margin: 0 0 16px 0; color: #666; font-size: 14px;">
          Please use the gradient picker, RGB inputs, or quick color palette to select colors.
        </p>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        ">
          Got it
        </button>
      </div>
    `;
    document.body.appendChild(notification);
  };

  const quickColorPalettes = [
    // Popular colors
    ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"],
    // Material colors
    ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3"],
    // Vibrant colors
    ["#FF9800", "#FF5722", "#795548", "#607D8B", "#4CAF50", "#8BC34A"],
    // Pastel colors
    ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#D4BAFF"],
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-4 w-80 max-h-[85vh] overflow-y-auto border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center gap-2">
            {isEyedropperActive && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Click anywhere to pick color
              </span>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-lg font-light w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-3 p-2 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-700 mb-1">
            <strong>How to pick colors:</strong>
          </p>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Click 🎨 eyedropper to pick from screen/other apps</li>
            <li>• Click & drag in gradient area below</li>
            <li>• Use RGB inputs or quick color palette</li>
          </ul>
        </div>

        {/* Color Preview */}
        <div className="mb-3">
          <div
            className="w-full h-8 rounded-md border border-gray-200 mb-2"
            style={{ backgroundColor: currentColor }}
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={currentColor}
              onChange={(e) => {
                const newColor = e.target.value;
                if (newColor.match(/^#[0-9A-Fa-f]{6}$/)) {
                  handleColorSelect(newColor);
                  onColorChange(newColor); // Live update for valid hex colors
                }
              }}
              onInput={(e) => {
                const newColor = e.currentTarget.value;
                if (newColor.match(/^#[0-9A-Fa-f]{6}$/)) {
                  handleColorSelect(newColor);
                  onColorChange(newColor); // Live update while typing
                }
              }}
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-xs font-mono"
            />
            <button
              onClick={copyColor}
              className="px-2 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 transition-colors"
            >
              {copied ? "✓" : "Copy"}
            </button>
          </div>
        </div>

        {/* Large Gradient Picker Area - Same as image */}
        <div className="mb-3">
          <div
            className="relative w-full h-48 rounded-lg border border-gray-300 cursor-crosshair"
            style={{
              background: `linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, hsl(${hue}, 100%, 50%))`,
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const newSaturation = (x / rect.width) * 100;
              const newLightness = 100 - (y / rect.height) * 100;
              setSaturation(newSaturation);
              setLightness(newLightness);
              const newColor = hslToHex(hue, newSaturation, newLightness);
              handleColorSelect(newColor);
              onColorChange(newColor); // Live update
            }}
            onMouseMove={(e) => {
              if (e.buttons === 1) {
                // Only if mouse button is pressed
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const newSaturation = (x / rect.width) * 100;
                const newLightness = 100 - (y / rect.height) * 100;
                setSaturation(newSaturation);
                setLightness(newLightness);
                const newColor = hslToHex(hue, newSaturation, newLightness);
                handleColorSelect(newColor);
                onColorChange(newColor); // Live update while dragging
              }
            }}
          >
            <div
              className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${saturation}%`,
                top: `${100 - lightness}%`,
                boxShadow: "0 0 0 1px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>

        {/* Tools Row - Eyedropper, Current Color, and Hue Slider */}
        <div className="mb-3 flex items-center gap-2">
          {/* Eyedropper Tool */}
          <div className="relative group">
            <button
              onClick={enhancedEyedropper}
              className={`relative p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors ${
                isEyedropperActive ? "bg-blue-100 border-blue-300" : ""
              } ${eyedropperSupported ? "border-green-300 bg-green-50" : ""}`}
              title="Pick color from screen"
              disabled={isEyedropperActive}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m2 22 1-1h3l9-9" />
                <path d="M3 21v-3l9-9" />
                <path d="m15 6 3.5-3.5a2.12 2.12 0 0 1 3 3L18 9l-3-3Z" />
              </svg>

              {/* Ready indicator */}
              {eyedropperSupported && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
              )}
            </button>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {eyedropperSupported
                ? "Click to pick color from anywhere on screen"
                : "Screen capture color picker (may need permission)"}
            </div>
          </div>

          {/* Current Color Display */}
          <div
            className="w-12 h-8 rounded border border-gray-300"
            style={{ backgroundColor: currentColor }}
          />

          {/* Hue Slider - Rainbow gradient like in image */}
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={(e) => {
                const newHue = parseInt(e.target.value);
                setHue(newHue);
                const newColor = hslToHex(newHue, saturation, lightness);
                handleColorSelect(newColor);
                onColorChange(newColor); // Live update
              }}
              onInput={(e) => {
                // Also handle onInput for more responsive live updates
                const newHue = parseInt(e.currentTarget.value);
                setHue(newHue);
                const newColor = hslToHex(newHue, saturation, lightness);
                handleColorSelect(newColor);
                onColorChange(newColor); // Live update while sliding
              }}
              className="w-full h-4 rounded-lg cursor-pointer hue-slider"
              style={{
                background:
                  "linear-gradient(to right, #ff0000 0%, #ff8000 14%, #ffff00 28%, #80ff00 42%, #00ff00 57%, #00ff80 71%, #00ffff 85%, #0080ff 100%)",
                WebkitAppearance: "none",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* RGB Inputs - Exactly like in image */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="text-center">
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) =>
                handleRgbChange("r", parseInt(e.target.value) || 0)
              }
              onInput={(e) =>
                handleRgbChange("r", parseInt(e.currentTarget.value) || 0)
              }
              className="w-full px-2 py-2 border border-gray-300 rounded text-center text-lg font-medium"
            />
            <label className="block text-sm font-medium text-gray-600 mt-1">
              R
            </label>
          </div>
          <div className="text-center">
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) =>
                handleRgbChange("g", parseInt(e.target.value) || 0)
              }
              onInput={(e) =>
                handleRgbChange("g", parseInt(e.currentTarget.value) || 0)
              }
              className="w-full px-2 py-2 border border-gray-300 rounded text-center text-lg font-medium"
            />
            <label className="block text-sm font-medium text-gray-600 mt-1">
              G
            </label>
          </div>
          <div className="text-center">
            <input
              type="number"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) =>
                handleRgbChange("b", parseInt(e.target.value) || 0)
              }
              onInput={(e) =>
                handleRgbChange("b", parseInt(e.currentTarget.value) || 0)
              }
              className="w-full px-2 py-2 border border-gray-300 rounded text-center text-lg font-medium"
            />
            <label className="block text-sm font-medium text-gray-600 mt-1">
              B
            </label>
          </div>
        </div>

        {/* Quick Color Palettes */}
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-600 mb-2">
            Quick Colors
          </h4>
          <div className="space-y-1">
            {quickColorPalettes.map((palette, paletteIndex) => (
              <div key={paletteIndex} className="flex gap-1">
                {palette.map((color, colorIndex) => (
                  <button
                    key={colorIndex}
                    onClick={() => {
                      handleColorSelect(color);
                      onColorChange(color); // Live update for quick colors
                    }}
                    className="w-7 h-7 rounded border border-gray-300 hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Colors */}
        {recentColors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Recent Colors
            </h4>
            <div className="grid grid-cols-8 gap-1">
              {recentColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleColorSelect(color);
                    onColorChange(color); // Live update for recent colors
                  }}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-105 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
  layout: "diagonal" | "split" | "overlay" | "minimal";
  preview: string;
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
    "diagonal" | "split" | "overlay" | "minimal"
  >("diagonal");
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Color picker states
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] =
    useState(false);
  const [showHeaderTextColorPicker, setShowHeaderTextColorPicker] =
    useState(false);
  const [showBulletTextColorPicker, setShowBulletTextColorPicker] =
    useState(false);

  const [bulletPoints, setBulletPoints] = useState<BulletPoint[]>([
    { id: 1, text: "Plug & Play HDMI Setup" },
    { id: 2, text: "Crisp 1080p HD Streaming" },
    { id: 3, text: "Works with Top Streaming Apps" },
    { id: 4, text: "30-Day Money-Back Guarantee" },
    { id: 5, text: "Lightweight, Pocket-Friendly Design" },
  ]);

  // Load saved design from localStorage on component mount
  useEffect(() => {
    const savedDesign = localStorage.getItem("brandify_design");
    if (savedDesign) {
      try {
        const design = JSON.parse(savedDesign);
        setTitle(design.title || "Flixy TV Smart Stick");
        setSubtitle(design.subtitle || "2025 Edition");
        setPrice(design.price || "Turn Any TV Smart for Just $39!");
        setBackgroundColor(design.backgroundColor || "#7ba5b8");
        setHeaderTextColor(design.headerTextColor || "#000000");
        setBulletTextColor(design.bulletTextColor || "#ffffff");
        setDiagonalAngle(design.diagonalAngle || 135);
        setDiagonalPosition(design.diagonalPosition || 50);
        setCurrentLayout(design.currentLayout || "diagonal");
        if (design.bulletPoints) setBulletPoints(design.bulletPoints);
        if (design.productImage) setProductImage(design.productImage);
      } catch (error) {
        console.log("Error loading saved design:", error);
      }
    }
  }, []); // Empty dependency array is fine here since we only want to run this once on mount

  // Save design to localStorage whenever key design elements change
  useEffect(() => {
    const designToSave = {
      title,
      subtitle,
      price,
      backgroundColor,
      headerTextColor,
      bulletTextColor,
      diagonalAngle,
      diagonalPosition,
      currentLayout,
      bulletPoints,
      productImage,
      lastSaved: new Date().toISOString(),
    };

    localStorage.setItem("brandify_design", JSON.stringify(designToSave));
  }, [
    title,
    subtitle,
    price,
    backgroundColor,
    headerTextColor,
    bulletTextColor,
    diagonalAngle,
    diagonalPosition,
    currentLayout,
    bulletPoints,
    productImage,
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

  const applyDesignTemplate = (template: DesignTemplate) => {
    setBackgroundColor(template.backgroundColor);
    setHeaderTextColor(template.headerTextColor);
    setBulletTextColor(template.bulletTextColor);
    setDiagonalAngle(template.diagonalAngle);
    setDiagonalPosition(template.diagonalPosition);
    setCurrentLayout(template.layout);
  };

  const renderLayoutContent = () => {
    switch (currentLayout) {
      case "split":
        return (
          <div className="h-full flex">
            {/* Left half - Product image */}
            <div className="w-1/2 flex items-center justify-center p-8">
              <div className="w-[500px] h-[500px] flex items-center justify-center">
                {productImage ? (
                  <Image
                    src={productImage}
                    alt="Product"
                    width={500}
                    height={500}
                    className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    style={{
                      objectPosition: "center center",
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
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
                className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
                style={{ color: headerTextColor }}
              >
                {title}
              </h1>
              <h2
                className="text-xl md:text-2xl font-medium mb-6 leading-relaxed"
                style={{ color: headerTextColor, opacity: 0.9 }}
              >
                {subtitle}
              </h2>
              <h3
                className="text-2xl md:text-3xl font-bold mb-8 leading-tight"
                style={{ color: headerTextColor }}
              >
                {price}
              </h3>
              <div className="space-y-3">
                {bulletPoints.slice(0, 5).map((point) => (
                  <div key={point.id} className="w-full">
                    <div
                      className="flex items-center space-x-3 rounded-full px-5 py-3 shadow-lg border backdrop-blur-sm transition-all duration-200 hover:shadow-xl"
                      style={{
                        backgroundColor: `${backgroundColor}15`,
                        borderColor: `${backgroundColor}30`,
                        minHeight: "56px",
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm flex-shrink-0 transition-all duration-200"
                        style={{
                          backgroundColor: bulletTextColor,
                          color: backgroundColor,
                          boxShadow: `0 2px 4px ${bulletTextColor}20`,
                        }}
                      >
                        ✓
                      </div>
                      <span
                        className="text-lg font-medium flex-1"
                        style={{
                          color: bulletTextColor,
                          textShadow: `0 1px 2px rgba(0,0,0,0.1)`,
                        }}
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
                  className="object-cover opacity-10"
                />
              </div>
            )}
            {/* Dynamic overlay with user's background color */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${backgroundColor}E6, ${backgroundColor}F0)`,
                backdropFilter: "blur(1px) saturate(1.1)",
              }}
            ></div>
            {/* Content overlay */}
            <div className="relative h-full p-16 flex">
              <div className="w-1/2 flex flex-col justify-center">
                <h1
                  className="text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                  style={{
                    color: headerTextColor,
                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {title}
                </h1>
                <h2
                  className="text-xl lg:text-2xl font-medium mb-6 leading-relaxed"
                  style={{
                    color: headerTextColor,
                    opacity: 0.9,
                    textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  }}
                >
                  {subtitle}
                </h2>
                <h3
                  className="text-2xl lg:text-3xl font-bold mb-8 leading-tight"
                  style={{
                    color: headerTextColor,
                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {price}
                </h3>
                <div className="space-y-3">
                  {bulletPoints.slice(0, 4).map((point) => (
                    <div key={point.id} className="w-full">
                      <div
                        className="flex items-center space-x-3 rounded-full px-5 py-3 shadow-lg border backdrop-blur-sm"
                        style={{
                          backgroundColor: `${backgroundColor}30`,
                          borderColor: `${headerTextColor}40`,
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
                          style={{
                            color: bulletTextColor,
                            textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                          }}
                        >
                          {point.text}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-1/2 flex items-center justify-center">
                <div
                  className="w-[400px] h-[400px] rounded-lg backdrop-blur-sm flex items-center justify-center"
                  style={{
                    backgroundColor: `${backgroundColor}20`,
                    border: `2px solid ${headerTextColor}30`,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                  }}
                >
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt="Product"
                      width={380}
                      height={380}
                      className="object-contain drop-shadow-xl"
                      style={{
                        objectPosition: "center center",
                        width: "auto",
                        height: "auto",
                        maxWidth: "90%",
                        maxHeight: "90%",
                      }}
                    />
                  ) : (
                    <span className="text-gray-500 text-lg text-center">
                      Upload Product Image
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "minimal":
        return (
          <div className="h-full p-16 flex items-center">
            <div className="w-1/3 flex justify-center items-center">
              <div className="w-[300px] h-[300px] flex items-center justify-center">
                {productImage ? (
                  <Image
                    src={productImage}
                    alt="Product"
                    width={300}
                    height={300}
                    className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    style={{
                      objectPosition: "center center",
                      width: "auto",
                      height: "auto",
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200/50 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-lg text-center">
                      Upload Product Image
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="w-2/3 pl-16">
              <h1
                className="text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight"
                style={{
                  color: headerTextColor,
                  textShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  filter: "contrast(1.1) brightness(1.05)",
                }}
              >
                {title}
              </h1>
              <h2
                className="text-xl lg:text-2xl font-medium mb-6 leading-relaxed"
                style={{
                  color: headerTextColor,
                  opacity: 0.9,
                  textShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {subtitle}
              </h2>
              <h3
                className="text-2xl lg:text-3xl font-bold mb-8 leading-tight"
                style={{
                  color: headerTextColor,
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  filter: "contrast(1.15) brightness(1.08)",
                }}
              >
                {price}
              </h3>
              <div className="space-y-3">
                {bulletPoints.slice(0, 5).map((point) => (
                  <div key={point.id} className="w-full">
                    <div
                      className="flex items-center space-x-3 rounded-full px-5 py-3 shadow-lg border backdrop-blur-sm transition-all duration-200 hover:shadow-xl"
                      style={{
                        backgroundColor: `${backgroundColor}18`,
                        borderColor: `${backgroundColor}35`,
                        minHeight: "56px",
                      }}
                    >
                      <div
                        className="flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm flex-shrink-0 transition-all duration-200"
                        style={{
                          backgroundColor: bulletTextColor,
                          color: backgroundColor,
                          boxShadow: `0 2px 4px ${bulletTextColor}25`,
                        }}
                      >
                        ✓
                      </div>
                      <span
                        className="text-lg font-medium flex-1"
                        style={{
                          color: bulletTextColor,
                          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          filter: "contrast(1.05)",
                        }}
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
                  className="text-2xl lg:text-3xl font-bold leading-tight"
                  style={{
                    color: headerTextColor,
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    filter: "contrast(1.1) brightness(1.05)",
                  }}
                >
                  {price}
                </h3>
              </div>
              <div className="flex justify-start items-center flex-1 -ml-8">
                <div className="w-[400px] h-[400px] flex items-center justify-center">
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt="Product"
                      width={400}
                      height={400}
                      className="max-w-full max-h-full object-contain drop-shadow-2xl"
                      style={{
                        objectPosition: "center center",
                        width: "auto",
                        height: "auto",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200/50 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-lg text-center">
                        Upload Product Image
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Right Side - Title and Features */}
            <div className="w-1/2 flex flex-col pl-4">
              <div className="text-center mb-12">
                <h1
                  className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight tracking-tight"
                  style={{
                    color: headerTextColor,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    filter: "contrast(1.1) brightness(1.05)",
                  }}
                >
                  {title}
                </h1>
                <h2
                  className="text-xl lg:text-2xl font-semibold leading-relaxed"
                  style={{
                    color: headerTextColor,
                    textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    opacity: 0.9,
                  }}
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

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      setProductImage(imageUrl.trim());
      setImageUrl("");
      setShowUrlInput(false);
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type);
            const reader = new FileReader();
            reader.onload = (e) => {
              setProductImage(e.target?.result as string);
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
      // If no image found, try to get text (URL)
      const text = await navigator.clipboard.readText();
      if (text && (text.startsWith("http") || text.startsWith("data:image"))) {
        setProductImage(text);
      }
    } catch (err) {
      console.log("Failed to read clipboard contents: ", err);
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
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex-shrink-0">
        <h1 className="text-4xl font-bold text-center text-gray-900 py-8">
          Product Ad Generator
        </h1>
      </div>

      <div className="flex-1 flex overflow-hidden px-4 pb-4">
        {/* Left Side - Scrollable Form (50%) */}
        <div className="w-1/2 pr-2">
          <div className="h-full overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
                Design Controls
              </h2>

              <div className="space-y-6">
                {/* Basic Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Product title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Product subtitle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Marketing Message
                    </label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Marketing message"
                    />
                  </div>

                  {/* Features Section */}
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900">
                      Features
                    </h3>
                    <div className="space-y-3">
                      {bulletPoints.map((point) => (
                        <div key={point.id}>
                          <label className="block text-sm font-semibold text-gray-900 mb-1">
                            Feature {point.id}
                          </label>
                          <input
                            type="text"
                            value={point.text}
                            onChange={(e) =>
                              updateBulletPoint(point.id, e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder={`Feature ${point.id}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Product Image Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Product Image
                  </label>

                  <div
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 ${
                      isDragOver
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {productImage ? (
                      <div className="space-y-3">
                        <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden shadow-md">
                          <Image
                            src={productImage}
                            alt="Product preview"
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 mb-2">
                            Image uploaded successfully
                          </p>
                          <button
                            onClick={() => setProductImage(null)}
                            className="text-sm text-red-600 hover:text-red-700 underline font-medium"
                          >
                            Remove image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-12 h-12 mx-auto text-gray-400">
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
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            Upload Product Image
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Drag and drop, browse files, paste from clipboard,
                            or use URL
                          </p>

                          {/* Upload Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                            {/* File Upload */}
                            <label className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors duration-200">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" />
                              </svg>
                              Browse
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="sr-only"
                              />
                            </label>

                            {/* Paste Button */}
                            <button
                              onClick={handlePaste}
                              className="inline-flex items-center justify-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11.586l-3-3a1 1 0 00-1.414 1.414L11.586 11H8a1 1 0 100 2h3.586l-1 1a1 1 0 101.414 1.414l3-3z" />
                              </svg>
                              Paste
                            </button>

                            {/* URL Button */}
                            <button
                              onClick={() => setShowUrlInput(!showUrlInput)}
                              className="inline-flex items-center justify-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
                              </svg>
                              URL
                            </button>
                          </div>

                          {/* URL Input */}
                          {showUrlInput && (
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="Enter image URL..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-sm"
                              />
                              <button
                                onClick={handleUrlSubmit}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                              >
                                Load
                              </button>
                              <button
                                onClick={() => {
                                  setShowUrlInput(false);
                                  setImageUrl("");
                                }}
                                className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Design Templates */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-900 mb-4">
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
                            style={{
                              backgroundColor: template.backgroundColor,
                            }}
                          />
                          <div
                            className="w-5 h-5 rounded-sm border border-gray-300 shadow-sm"
                            style={{
                              backgroundColor: template.headerTextColor,
                            }}
                          />
                          <div
                            className="w-5 h-5 rounded-sm border border-gray-300 shadow-sm"
                            style={{
                              backgroundColor: template.bulletTextColor,
                            }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Color */}
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
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm cursor-pointer hover:border-gray-400 transition-colors hover:scale-105"
                      style={{ backgroundColor }}
                      onClick={() => setShowBackgroundColorPicker(true)}
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="#7ba5b8"
                    />
                    <button
                      onClick={() => setShowBackgroundColorPicker(true)}
                      className="px-3 py-3 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      Pick
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-3">
                      Quick Colors
                    </p>
                    <div className="grid grid-cols-6 gap-2">
                      {quickColors.map((color, index) => (
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
                    id="backgroundColor"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="sr-only"
                  />
                </div>

                {/* Header Text Color */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
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
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm cursor-pointer hover:border-gray-400 transition-colors hover:scale-105"
                      style={{ backgroundColor: headerTextColor }}
                      onClick={() => setShowHeaderTextColorPicker(true)}
                    />
                    <input
                      type="text"
                      value={headerTextColor}
                      onChange={(e) => setHeaderTextColor(e.target.value)}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900"
                      placeholder="#000000"
                    />
                    <button
                      onClick={() => setShowHeaderTextColorPicker(true)}
                      className="px-3 py-3 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      Pick
                    </button>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-900 mb-3">
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

                  <input
                    id="headerTextColor"
                    type="color"
                    value={headerTextColor}
                    onChange={(e) => setHeaderTextColor(e.target.value)}
                    className="sr-only"
                  />
                </div>

                {/* Bullet Text Color */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-900 mb-3">
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
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm cursor-pointer hover:border-gray-400 transition-colors hover:scale-105"
                      style={{ backgroundColor: bulletTextColor }}
                      onClick={() => setShowBulletTextColorPicker(true)}
                    />
                    <input
                      type="text"
                      value={bulletTextColor}
                      onChange={(e) => setBulletTextColor(e.target.value)}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900"
                      placeholder="#ffffff"
                    />
                    <button
                      onClick={() => setShowBulletTextColorPicker(true)}
                      className="px-3 py-3 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      Pick
                    </button>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-900 mb-3">
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

                  <input
                    id="bulletTextColor"
                    type="color"
                    value={bulletTextColor}
                    onChange={(e) => setBulletTextColor(e.target.value)}
                    className="sr-only"
                  />
                </div>

                {/* Diagonal Customization - only show for diagonal layout */}
                {currentLayout === "diagonal" && (
                  <div className="mb-8">
                    <label className="flex items-center text-sm font-semibold text-gray-900 mb-4">
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
                        <label className="block text-sm text-gray-900 mb-2">
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
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>90°</span>
                          <span>135°</span>
                          <span>180°</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-900 mb-2">
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
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
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
        </div>

        {/* Right Side - Preview (50%) */}
        <div className="w-1/2 pl-2">
          <div className="h-full">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 text-center flex-shrink-0">
                Preview
              </h2>

              <div className="flex-1 flex items-center justify-center p-4">
                {/* Visible Preview - Much Larger */}
                <div className="w-full max-w-[700px] aspect-[1200/628] rounded border-4  shadow-lg overflow-hidden relative bg-white">
                  {/* Background - only show diagonal for diagonal layout */}
                  {currentLayout === "diagonal" && (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(${diagonalAngle}deg, ${backgroundColor} 0%, ${backgroundColor} ${diagonalPosition}%, #ffffff ${diagonalPosition}%, #ffffff 100%)`,
                      }}
                    />
                  )}

                  {/* Solid background for other layouts */}
                  {currentLayout !== "diagonal" &&
                    currentLayout !== "overlay" && (
                      <div
                        className="absolute inset-0"
                        style={{ background: backgroundColor }}
                      />
                    )}

                  {/* Scaled content for preview */}
                  <div
                    style={{
                      transform: "scale(0.58)",
                      transformOrigin: "top left",
                      width: "1200px",
                      height: "628px",
                    }}
                  >
                    {renderLayoutContent()}
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 text-center mt-2 flex-shrink-0">
                Download size: 1200×628px
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Full-Size Element for Download */}
      <div className="fixed -left-[2000px] -top-[2000px] pointer-events-none">
        <div ref={cardRef} className="w-[1200px] h-[628px] bg-white relative">
          {/* Background - only show diagonal for diagonal layout */}
          {currentLayout === "diagonal" && (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${diagonalAngle}deg, ${backgroundColor} 0%, ${backgroundColor} ${diagonalPosition}%, #ffffff ${diagonalPosition}%, #ffffff 100%)`,
              }}
            />
          )}

          {/* Solid background for other layouts */}
          {currentLayout !== "diagonal" && currentLayout !== "overlay" && (
            <div
              className="absolute inset-0"
              style={{ background: backgroundColor }}
            />
          )}

          {renderLayoutContent()}
        </div>
      </div>

      {/* Color Picker Modals */}
      <ColorPicker
        isOpen={showBackgroundColorPicker}
        onClose={() => setShowBackgroundColorPicker(false)}
        currentColor={backgroundColor}
        onColorChange={setBackgroundColor}
        title="Background Color"
        storageKey="background"
      />

      <ColorPicker
        isOpen={showHeaderTextColorPicker}
        onClose={() => setShowHeaderTextColorPicker(false)}
        currentColor={headerTextColor}
        onColorChange={setHeaderTextColor}
        title="Header Text Color"
        storageKey="headerText"
      />

      <ColorPicker
        isOpen={showBulletTextColorPicker}
        onClose={() => setShowBulletTextColorPicker(false)}
        currentColor={bulletTextColor}
        onColorChange={setBulletTextColor}
        title="Bullet Points Color"
        storageKey="bulletText"
      />
    </div>
  );
}
