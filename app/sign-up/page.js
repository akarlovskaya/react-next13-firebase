'use client';
import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
import { useContext } from 'react';
import { UserContext } from "../Provider";
import { FcGoogle } from "react-icons/fc";
import toast from 'react-hot-toast';

const SignUpPage = () => {
  // const user = null;
  // const username = null;
  const { user, username } = useContext(UserContext)

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      { user ? 
        !username ? <UsernameForm /> : <SignOutButton /> 
        : <SignInButton />
      }
    </main>
  );
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider)
      // show success message
      toast.success('Sign up was successful!');

    } catch (error) {
      console.log('Error with signing in: ', error);
      // show toast error message
      toast.error('Failed to sign in with Google. Please try again.')
    }
  };

  return (
    <>
      <button 
        className='w-full bg-navy text-white px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-navy-light'
        onClick={signInWithGoogle}>
          <FcGoogle className='mr-4 text-2xl bg-white rounded-full'/>  Sign in with Google
      </button>

      <button 
        className='w-full bg-navy text-white px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-navy-light'
        onClick={() => signInAnonymously(auth)}>
        Sign in Anonymously
      </button>
    </>
  );
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => signOut(auth)}>Sign Out</button>;
}

export default SignUpPage;
