"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, googleAuthProvider } from "../lib/firebase";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("Reset password link was sent");
      router.push("/sign-in");
    } catch (error) {
      toast.error("Could not sent reset password");
    }
  }

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
          Forgot Password
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full md:w-[67%] lg:w-[50%] m-auto"
        >
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Enter email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="border rounded w-full py-2 px-3 mb-5"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="mb-4 text-sm text-red-600" role="alert">
              This field is required
            </span>
          )}

          <div className="flex justify-between text-sm sm:text-base mb-10">
            <p>
              Don&#39;t have account?
              <Link
                href="/sign-up"
                className="text-orange-dark hover:text-orange-light ml-1"
              >
                Register
              </Link>
            </p>
            <p>
              <Link href="/sign-in" className="text-navy hover:text-indigo-600">
                Sign In
              </Link>
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-navy text-white px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-gray-900"
          >
            Sent Reset Password
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
};

export default ForgotPasswordPage;
