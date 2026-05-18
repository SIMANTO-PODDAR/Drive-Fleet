import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/Sections/Navbar";
import Footer from "@/Sections/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DriveFleet",
  description: "Car Rental Platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en" data-theme='light'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <div className="container mx-auto">
          <Navbar />

          {children}
        </div>

        <Footer />

        <Toaster />
      </body>
    </html>
  );
}
