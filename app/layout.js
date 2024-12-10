import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Vanklas - Discover Fitness Classes",
  description: "Fitness Classes Board App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {children}
      </body>
    </html>
  );
}
