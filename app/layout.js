import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from 'react-hot-toast'; 
import Navbar from "./components/Navbar";


export const metadata = {
  title: "Vanklas - Discover Fitness Classes",
  description: "Fitness Classes Board App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster/>
        <Navbar />

        {children}
      </body>
    </html>
  );
}
