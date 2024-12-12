import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from 'react-hot-toast'; 
import Navbar from "./components/Navbar";
import Provider from "./Provider";


export const metadata = {
  title: "Vanklas - Discover Fitness Classes",
  description: "Fitness Classes Board App",
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
