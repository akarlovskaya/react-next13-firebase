import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from 'react-hot-toast'; 
import Navbar from "./components/Navbar";
import Provider from "./Provider";
import { Metadata } from 'next'
 
export const metadata = {
  title: {
    template: '%s | Vanklas - Discover Local Fitness Classes',
    default: 'Vanklas - Discover Local Fitness Classes',
  },
  description: 'VanKlas is a user-friendly web app that helps to find and book fitness classes in your local area. It allows trainers and fitness instructors to add and promote their classes among participants. Participants can explore available workout classes, view class descriptions, reserve a spot or contact instructors with ease.',
  // metadataBase: new URL('https://your-domain.com'),
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        <Provider>
          <Toaster/>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
