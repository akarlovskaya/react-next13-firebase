"use client";
import { useState, useContext } from "react";
import { auth, googleAuthProvider } from "../lib/firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getFirestore,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { UserContext } from "../Provider";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import UsernameForm from "../components/UsernameForm.js";

const SignUpPage = () => {
  const { user, username } = useContext(UserContext);

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
      // console.log("Creating user with email and password...");
      // Create a user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        contactEmail,
        password
      );
      // console.log("User created successfully:", userCredential.user.uid);

      // console.log("Updating user profile...");
      // Update the user profile with displayName
      const user = userCredential.user; // The current user is in userCredential.user
      // console.log("Authenticated user UID:", user.uid);
      await updateProfile(user, {
        displayName: fullName,
      });
      // console.log("User profile updated successfully");

      // console.log("Preparing Firestore data...");

      // Prepare data for Firestore
      const forDataCopy = {
        displayName: fullName,
        email: contactEmail,
        createdAt: serverTimestamp(),
      };

      // console.log(
      //   "Saving user details to Firestore...forDataCopy",
      //   forDataCopy
      // );

      // Save the user details to Firestore (without password)
      await setDoc(doc(getFirestore(), "users", user.uid), forDataCopy);
      // console.log("Firestore document created successfully");

      toast.success("Sign up was successful!");
    } catch (error) {
      console.error("Error during registration:", error);
      console.error("Error details:", error.code, error.message);
      toast.error("Something went wrong with user registration.");
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      // show success message
      toast.success("Sign up was successful!");
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
            <FcGoogle className="mr-4 text-2xl bg-white rounded-full" /> Sign Up
            with Google
          </button>
        </form>
      </div>
    </section>
  );
}

export default SignUpPage;
