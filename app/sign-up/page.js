'use client';
import { useEffect, useState, useCallback, useContext } from 'react';
import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup, signInAnonymously, signOut } from 'firebase/auth';
import { doc, writeBatch, getDoc, getFirestore } from 'firebase/firestore';
import { UserContext } from "../Provider";
import { FcGoogle } from "react-icons/fc";
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';
import SignOutButton from '../components/SignOutButton';
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const { user, username } = useContext(UserContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  // <SignOutButton style={`white hover:text-purple text-navy font-bold py-2 px-4 rounded-full w-full border-2 focus:outline-none focus:shadow-outline`}/>
  return (
    <main>
      { user ? 
        !username ? <UsernameForm /> : null
        : <SignInButton />
      }
    </main>
  );
}

// Sign in with Google button
function SignInButton() {
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider)
      // show success message
      toast.success('Sign up was successful!');
      // Redirect to the home page
      router.push("/"); 

    } catch (error) {
      console.log('Error with signing in: ', error);
      // show toast error message
      toast.error('Failed to sign in with Google. Please try again.')
    }
  };

  return (
    <section className="bg-blue-50 px-4 py-10 h-screen">
    <div className="container-xl lg:container m-auto">
        <h1 className="text-3xl font-bold text-navy mb-6 text-center">Sign In</h1>

        <div className="w-full md:w-[67%] lg:w-[30%] m-auto">
          <button 
          type='button'
          className='flex items-center justify-center w-full bg-orange-dark text-white px-7 py-3 text-sm font-medium 
                    rounded shadow-md hover:bg-orange-light'
          onClick={signInWithGoogle}>
            <FcGoogle className='mr-4 text-2xl bg-white rounded-full'/>  Sign in with Google
        </button>

        <div className='flex items-center my-4 
                        before:border-t before:flex-1 before:border-gray-300
                        after:border-t after:flex-1 after:border-gray-300'>
          <p className='text-center font-semibold mx-4'>OR</p>
        </div>

        <button 
          className='w-full bg-navy text-white px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-navy-light'
          onClick={() => signInAnonymously(auth)}>
          Sign in Anonymously
        </button>
        </div>
      </div>
      </section>
    
  );
}

// Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(getFirestore(), 'users', user.uid);
    const usernameDoc = doc(getFirestore(), 'usernames', formValue);

    try {
      // Commit both docs together as a batch write.
      const batch = writeBatch(getFirestore());
      batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();

    } catch (error) {
      console.log('Error commit usename to Firestore', error)
    }


  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(getFirestore(), 'usernames', username);
        const snap = await getDoc(ref);
        console.log('Firestore read executed!', snap.exists());
        setIsValid(!snap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section className="bg-indigo-50">
        <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
        <h1 className="text-3xl text-center font-semibold mb-6">Choose a Username</h1>
        <form onSubmit={onSubmit}>
            <label htmlFor='username' className="sr-only">
              Choose Username
            </label>
          <input 
            id="username" 
            name="username" 
            placeholder="my user name" 
            className="border rounded w-full py-2 px-3 mb-10"
            value={formValue} 
            onChange={onChange} />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />

          <button 
            type="submit" 
            className="bg-navy hover:bg-navy-light text-white py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
            disabled={!isValid}>
            Submit
          </button>

          {/* <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div> */}
        </form>
        </div>
        </div>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  
  if (loading) {
    return (
      <div className="h-24 p-4 mb-4 text-m bg-white" role="alert">
        <p className="mb-10 text-base">Checking...</p>
      </div>
    )

  } else if (isValid) {
    return (
      <div className="h-24 p-4 mb-4 text-m bg-white" role="alert">
        <p className="mb-10 text-base text-green-600">
         ${username} is available!
        </p>
      </div>
    )

  } else if (username && !isValid) {
    return (
      <div className="h-24 p-4 mb-4 text-m bg-white" role="alert">
        <p className="mb-10 text-base text-red-600">That username is taken!</p>
      </div>
    )

  } else {
    return (
      <div className="h-24 p-4 mb-4 text-m bg-white " role="alert">
        <p className="mb-10 text-base"></p>
      </div>
    )
  }
}

export default SignUpPage;
