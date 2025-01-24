"use client";
import { useEffect, useState, useCallback, useContext } from "react";
import { auth, googleAuthProvider } from "../lib/firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  writeBatch,
  getDoc,
  setDoc,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";
import { UserContext } from "../Provider";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";

const SignUpPage = () => {
  const { user, username } = useContext(UserContext);
  console.log("user from user context", user);

  // 1. user signed out <SignUpForm />
  // 2. user signed in, but missing username <UsernameForm />
  return (
    <main>{user ? !username ? <UsernameForm /> : null : <SignUpForm />}</main>
  );
};

function SignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { fullName, contactEmail, password } = data;

    try {
      // Create a user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        contactEmail,
        password
      );
      console.log("userCredential", userCredential);

      // Update the user profile with displayName
      const user = userCredential.user; // The current user is in userCredential.user
      updateProfile(user, {
        displayName: fullName,
      });

      // Prepare data for Firestore
      const forDataCopy = {
        displayName: fullName,
        email: contactEmail,
        createdAt: serverTimestamp(),
      };

      // Save the user details to Firestore (without password)
      await setDoc(doc(getFirestore(), "users", user.uid), forDataCopy);
      toast.success("Sign up was successful!");
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Something went wrong with user registration.");
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      // show success message
      toast.success("Sign up was successful!");
      // Redirect to the home page
      router.push("/");
    } catch (error) {
      console.log("Error with signing in: ", error);
      // show toast error message
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  return (
    <section className="bg-blue-50 px-4 py-10 h-screen">
      <div className="container-xl lg:container m-auto">
        <h1 className="text-3xl font-bold text-navy mb-6 text-center">
          Sign Up
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full md:w-[67%] lg:w-[50%] m-auto"
        >
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-bold mb-2"
          >
            Enter full name:
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="border rounded w-full py-2 px-3 mb-5"
            {...register("fullName", { required: true })}
          />
          {errors.fullName && (
            <span className="mb-4 text-sm text-red-600" role="alert">
              This field is required
            </span>
          )}

          <label
            htmlFor="contactEmail"
            className="block text-gray-700 font-bold mb-2"
          >
            Enter email:
          </label>
          <input
            type="contactEmail"
            id="contactEmail"
            name="contactEmail"
            className="border rounded w-full py-2 px-3 mb-5"
            {...register("contactEmail", { required: true })}
          />
          {errors.contactEmail && (
            <span className="mb-4 text-sm text-red-600" role="alert">
              This field is required
            </span>
          )}

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              Enter password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="border rounded w-full py-2 px-3"
              {...register("password", { register: true })}
            />
            {errors.password && (
              <span className="mb-4 text-sm text-red-600" role="alert">
                This field is required
              </span>
            )}
            {showPassword ? (
              <IoIosEye
                className="absolute right-3 top-11 text-xl cursor-pointer"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            ) : (
              <IoIosEyeOff
                className="absolute right-3 top-11 text-xl cursor-pointer"
                onClick={() => setShowPassword((prevState) => !prevState)}
              />
            )}
          </div>
          <div className="flex justify-between text-sm sm:text-base mb-10">
            <p>
              Have an account?
              <Link
                href="/sign-in"
                className="text-orange-dark hover:text-orange-light ml-1"
              >
                Sign In
              </Link>
            </p>
            <p>
              <Link
                href="/forgot-password"
                className="text-navy hover:text-indigo-600"
              >
                Forgot Password?
              </Link>
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-navy text-white px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-gray-900"
          >
            Sign Up
          </button>
          <div
            className="flex items-center my-4 
                              before:border-t before:flex-1 before:border-gray-300
                              after:border-t after:flex-1 after:border-gray-300"
          >
            <p className="text-center font-semibold mx-4">OR</p>
          </div>
          {/* Sign Up with Google */}
          <button
            type="button"
            className="flex items-center justify-center w-full bg-orange-dark text-white px-7 py-3 text-sm font-medium 
                          rounded shadow-md hover:bg-orange-light"
            onClick={signInWithGoogle}
          >
            <FcGoogle className="mr-4 text-2xl bg-white rounded-full" /> Sign in
            with Google
          </button>
        </form>
      </div>
    </section>
  );
}

// Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(getFirestore(), "users", user.uid);
    const usernameDoc = doc(getFirestore(), "usernames", formValue);

    try {
      // Commit both docs together as a batch write.
      const batch = writeBatch(getFirestore());
      batch.set(userDoc, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
      console.log("Batch commit successful. Redirecting...");
      // Redirect to Profile Page
      router.push(`/${formValue}`);
    } catch (error) {
      console.log("Error commit username to Firestore", error);
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

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(getFirestore(), "usernames", username);
        const snap = await getDoc(ref);
        console.log("Firestore read executed!", snap.exists());
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
            <h1 className="text-3xl text-center font-semibold mb-6">
              Choose a Username
            </h1>
            <form onSubmit={onSubmit}>
              <label htmlFor="username" className="sr-only">
                Choose Username
              </label>
              <input
                id="username"
                name="username"
                placeholder="my user name"
                className="border rounded w-full py-2 px-3 mb-10"
                value={formValue}
                onChange={onChange}
              />
              <UsernameMessage
                username={formValue}
                isValid={isValid}
                loading={loading}
              />

              <button
                type="submit"
                className="bg-navy hover:bg-navy-light text-white py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                disabled={!isValid}
              >
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
    );
  } else if (isValid) {
    return (
      <div className="h-24 p-4 mb-4 text-m bg-white" role="alert">
        <p className="mb-10 text-base text-green-600">
          ${username} is available!
        </p>
      </div>
    );
  } else if (username && !isValid) {
    return (
      <div className="h-24 p-4 mb-4 text-m bg-white" role="alert">
        <p className="mb-10 text-base text-red-600">That username is taken!</p>
      </div>
    );
  } else {
    return (
      <div className="h-24 p-4 mb-4 text-m bg-white " role="alert">
        <p className="mb-10 text-base"></p>
      </div>
    );
  }
}

export default SignUpPage;
