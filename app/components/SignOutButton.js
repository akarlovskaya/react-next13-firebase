'use client';
import { useRouter } from "next/navigation";
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/"); // Redirect to the home page
    }

    return (
        <button 
            className="white hover:text-purple text-navy font-bold py-2 px-4 rounded-full w-full border-2 focus:outline-none focus:shadow-outline"
            onClick={handleSignOut}>Sign Out
        </button>
    )      
}

export default SignOutButton;