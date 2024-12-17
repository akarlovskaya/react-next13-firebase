'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { UserContext } from "../Provider";
import Image from 'next/image';
import SignOutButton from './SignOutButton';


// Top navbar
export default function Navbar() {
    const { user, username } = useContext(UserContext)
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
              <Image
                  src={'/vanKlas-logo-narrow.png'} 
                  alt="Vanklas Logo, Discover Fitness in Metro Vancouver"
                  className="h-20 w-auto"
                  width={500}
                  height={500}
              />
            </Link>
            
          {/* user is signed-in and has username */}
          {username && (
            <ul className="flex md:ml-auto space-x-2">
              <li className="content-center">
                <Link href="/admin" className={LinkClass('/admin')}>
                        Add Class 
                </Link>
              </li>
              <li className="content-center">
                <Link href={`/${username}`} className={LinkClass(`/${username}`)}>
                  Profile
                </Link>
              </li>
              <li>
                <SignOutButton style={LinkClass('')}/>
              </li>
            </ul>
          )}

          {/* user is not signed OR has not created username */}
          {!username && (
            <ul>
              <Link href="/sign-up" className={LinkClass('/sign-up')}>
                Sign In
              </Link>
            </ul>
          )}
        </nav>
    </header>
  );
}