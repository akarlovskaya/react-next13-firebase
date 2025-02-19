"use client";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { auth, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserContext } from "../Provider";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

function SignInPage() {
  const { user, username } = useContext(UserContext);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredentials.user) {
        toast.success("Sign in was successful!");
        router.push("/");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Something went wrong with user registration.");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      if (!user) return;

      // Reference to Firestore document
      const userRef = doc(getFirestore(), "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists() || !userSnap.data().username) {
        // User is new or missing a username → redirect them to set a username
        await setDoc(userRef, { email: user.email }, { merge: true }); // Ensure at least an empty record exists
        router.push("/set-username");
      } else {
        // User has a username → proceed to home page
        toast.success("Sign in was successful!");
        router.push("/");
      }
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
          Sign In
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
              {...register("password", { required: true })}
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
              Don't have account?
              <Link
                href="/sign-up"
                className="text-orange-dark hover:text-orange-light ml-1"
              >
                Register
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
            Sign In
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

export default SignInPage;
