import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-navy text-white py-8">
      <div className="container mx-auto px-4">
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about-us" className="hover:text-gray-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-gray-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/delete-account" className="hover:text-gray-400">
                  Delete Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="hover:text-gray-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-gray-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-gray-400">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sitemap" className="hover:text-gray-400">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gray-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <p className="text-sm">© {new Date().getFullYear()} Vanklas</p>
            <p className="text-sm">All rights reserved</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-sm text-gray-400">Made with ❤️ by Vanklas Team</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
