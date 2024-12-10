'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
// import { useContext } from 'react';
// import { UserContext } from '@lib/context';
// import { auth } from '@lib/firebase';
// import { signOut } from 'firebase/auth';

// Top navbar
export default function Navbar() {
    // const { user, username } = useContext(UserContext);
    const { user, username } = {};
    // const router = useRouter(); // Hook to get the current path
    const pathname = usePathname(); // Get the current path

    const LinkClass = (href) =>
        pathname === href
        ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
        : 'text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

  return (
    <header className="bg-navy border-b shadow-sm sticky top-0 z-50">
        <nav className="flex justify-between items-center px-3 max-w-6xl mx-auto">
            {/* Logo */}
              <Link href="/" className="flex flex-shrink-0 items-center mr-4">
                <img
                  className="h-20 w-auto"
                  src={'/vanKlas-logo-narrow.png'} 
                  alt="Vanklas Logo, Discover Fitness in Metro Vancouver"
                />
              </Link>

            <ul className="md:ml-auto">
                <li className="flex space-x-2">
                    <Link href="/admin" className={LinkClass('/admin')}>
                            Classes 
                    </Link>
                    <Link href="/add-class" className={LinkClass('/add-class')}>
                            Add Class 
                    </Link>
                    <Link href={`/${username || ''}`} className={LinkClass(`/${username || ''}`)}>
                            Profile
                    </Link>
                </li>
            </ul>
        </nav>
    </header>
  );
}