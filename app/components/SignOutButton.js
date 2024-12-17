'use client';
import { useRouter } from "next/navigation";
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

function SignOutButton({style}) {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut(auth);
        router.push("/"); // Redirect to the home page
    }

    return (
        <button 
            className={style}
            onClick={handleSignOut}>Sign Out
        </button>
    )      
}

export default SignOutButton;