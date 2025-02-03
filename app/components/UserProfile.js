"use client";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState, useCallback, useContext } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { UserContext } from "../Provider";
import Link from "next/link";
import Image from "next/image";
import SignOutButton from "./SignOutButton";
import UserProfileAside from "./UserProfileForm/UserProfileAside.js";
import UserDetailsForm from "./UserProfileForm/UserDetailsForm.js";
import { IoCreateOutline } from "react-icons/io5";

function UserProfile() {
  const db = getFirestore();
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Get UID from Firebase Auth

  const { user, username } = useContext(UserContext);
  console.log("user from UserProfile context", user);
  const [isEditing, setIsEditing] = useState(false);

  const socialLinks = [
    { name: "facebook", link: "", label: "Facebook" },
    { name: "instagram", link: "", label: "Instagram" },
    { name: "linkedin", link: "", label: "LinkedIn" },
    { name: "x_com", link: "", label: "witter / X.com" },
  ];

  const methods = useForm({
    defaultValues: {
      userName: user?.username ?? "",
      avatarImage: user?.photoURL ?? "",
      fullName: user?.displayName ?? "",
      instructorTitle: user?.instructorTitle ?? "",
      instructorDescription: user?.instructorDescription ?? "",
      contactEmail: user?.email ?? "",
      contactPhone: user?.phoneNumber ?? "",
      socials: user?.socials ?? [],
    },
  });

  console.log("defaultValues from UserProfile", methods.getValues());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      const userDocRef = doc(db, "users", userId);

      try {
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          // console.log("User data from Firestore:", docSnap.data());
          const userData = docSnap.data();

          reset({
            userName: userData.username || "",
            avatarImage: userData.photoURL || "",
            fullName: userData.displayName || "",
            instructorTitle: userData.instructorTitle || "",
            instructorDescription: userData.instructorDescription || "",
            contactEmail: userData.contactEmail || "",
            contactPhone: userData.contactPhone || "",
            socials: userData.socials || [],
          });
        } else {
          console.log("No user found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUserData();
  }, [auth.currentUser?.uid, reset]);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
      <FormProvider {...methods}>
        <aside className="col-span-4 sm:col-span-3">
          <UserProfileAside user={user} username={username} />
          {/* <!-- Manage --> */}
          <div className="self-center bg-white p-6 rounded-lg shadow-md mt-6">
            {/* Create Class Listing Button*/}
            <Link
              href="/admin"
              className="w-40 flex bg-navy hover:bg-gray-900 justify-center text-white py-4 rounded items-center focus:outline-none focus:shadow-outline"
            >
              <IoCreateOutline className="mr-2 text-xl" /> Create Class
            </Link>

            <button
              type="button"
              className="w-40 bg-slate-600 text-white px-7 py-3 mb-7 mt-5 font-medium rounded shadow-md focus:outline-none focus:shadow-outline hover:bg-gray-900"
              onClick={(e) => setIsEditing(!isEditing)}
            >
              Edit Profile
            </button>
          </div>
        </aside>

        <main className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0 col-span-4 sm:col-span-9">
          {/* Image upload */}

          {/* Form */}
          <UserDetailsForm isEditing={isEditing} setIsEditing={setIsEditing} />
        </main>
      </FormProvider>
    </div>
  );
}

export default UserProfile;

// User Schema from Context:
// accessToken
// auth
// displayName
// email
// emailVerified
// isAnonymous
// metadata: UserMetadata {createdAt: '1733965351714', lastLoginAt: '1738531326845', lastSignInTime: 'Sun, 02 Feb 2025 21:22:06 GMT', creationTime: 'Thu, 12 Dec 2024 01:02:31 GMT'}
// phoneNumber
// photoURL
// uid
// photoURL

// Current User Schema in firebase DB:
// displayName
// photoURL
// username

// Default values in user Form for RHF:
// defaultValues: {
//   userName: username,
//   avatarImage: user?.photoURL,
//   fullName: user?.displayName,
//   instructorTitle: "",
//   instructorDescription: "",
//   contactEmail: user?.email,
//   contactPhone: user?.phoneNumber,
//   socials: socialLinks,
// }
