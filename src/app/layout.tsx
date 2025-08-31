import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brandify - Product Ad Generator",
  description: "Create professional product ads with customizable templates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
