"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationMenu, NavigationMenuItem } from '../components/ui/navigation-menu';
import { Menubar } from '../components/ui/menubar';
import RouteLogger from '../components/RouteLogger';
import Image from "next/image";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  console.log("Current route:", pathname); // LOGGING

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <div className="flex items-center">
            {/* Placeholder for logo */}
            <span className="text-lg font-bold text-gray-800">Logo</span>
          </div>
          <nav className="flex space-x-6">
            <Link href="/" className={`text-gray-600 hover:text-gray-800 ${pathname === '/' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}>
              Results
            </Link>
            <Link href="/jobs/create" className={`text-gray-600 hover:text-gray-800 ${pathname === '/jobs/create' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}>
              Create
            </Link>
            <Link href="/jobs/processing" className={`text-gray-600 hover:text-gray-800 ${pathname === '/jobs/processing' ? 'text-blue-600 border-b-2 border-blue-600' : ''}`}>
              Processing
            </Link>
            {/* Placeholders for additional icons/logos */}
            <span className="text-gray-600">🌐</span>
            <span className="text-gray-600">Bē</span>
          </nav>
        </header>
        <div className="p-4">
          <RouteLogger>
            {children}
          </RouteLogger>
        </div>
      </body>
    </html>
  );
}
