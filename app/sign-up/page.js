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
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
          <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}



export default SignUpPage;
