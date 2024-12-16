import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from 'react-hot-toast'; 
import Navbar from "./components/Navbar";
import Provider from "./Provider";
import Metatags from './components/Metatags';

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <Metatags />
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
