"use client";
import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState, useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { UserContext } from "../Provider";
import Link from "next/link";
import UserProfileAside from "./UserProfileForm/UserProfileAside.js";
import UserDetailsForm from "./UserProfileForm/UserDetailsForm.js";
import { IoCreateOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { notFound } from "next/navigation";
import UserDataFromParamView from "./GuestProfileView.js";

function UserProfile({ usernameParam, userDataFromParam, role }) {
  const db = getFirestore();
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Get UID from Firebase Auth
  const { user, username } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [photoURL, setPhotoURL] = useState("/avatar-img.png");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState([
    { name: "facebook", link: "" },
    { name: "instagram", link: "" },
    { name: "linkedin", link: "" },
    { name: "x_com", link: "" },
    { name: "tiktok", link: "" },
  ]);
  const isOwner = username === usernameParam;

  const methods = useForm({
    defaultValues: {
      photoURL: "",
      displayName: "",
      instructorTitle: "",
      instructorDescription: "",
      contactEmail: "",
      contactPhone: "",
      username: "",
      socialLinks: [],
    },
  });

  const { reset } = methods;

  // Fetch user data from Firestore db
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        return notFound();
      }
      setIsLoading(true);

      try {
        const userDocRef = doc(db, "users", userId);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
          return notFound(); // User does not exist in Firestore
        }

        if (docSnap.exists()) {
          const fetchedUserData = docSnap.data();
          console.log("fetchedUserData", fetchedUserData);
          const formData = {
            photoURL: fetchedUserData.photoURL || "",
            displayName: fetchedUserData.displayName || "",
            instructorTitle: fetchedUserData.instructorTitle || "",
            instructorDescription: fetchedUserData.instructorDescription || "",
            contactEmail: fetchedUserData.email || "",
            contactPhone: fetchedUserData.contactPhone || "",
            username: fetchedUserData.username || "",
            socialLinks: fetchedUserData.socialLinks || "",
          };

          // Reset the form with the transformed data
          methods.reset(formData);
          setPhotoURL(fetchedUserData?.photoURL); // Set the avatar URL in state

          if (fetchedUserData?.socialLinks) {
            setSocialLinks(fetchedUserData.socialLinks);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.log("Error fetching user data", error);
        toast.error("Error retrieving user data");
      }
    };
    fetchUserData();
  }, [userId, reset]);

  if (!userDataFromParam) {
    return notFound();
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isOwner ? (
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
          <FormProvider {...methods}>
            <aside className="col-span-4 sm:col-span-3">
              <UserProfileAside
                photoURL={photoURL}
                socialLinks={socialLinks}
                isLoading={isLoading}
              />
              {/* <!-- Manage --> */}

              {isOwner && (
                <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md mt-6">
                  {/* Create Class for instructors */}
                  {role === "instructor" ? (
                    <Link
                      href="/admin"
                      className="w-40 flex bg-navy hover:bg-gray-900 justify-center text-white py-4 rounded items-center focus:outline-none focus:shadow-outline"
                    >
                      <IoCreateOutline className="mr-2 text-xl" /> Create Class
                    </Link>
                  ) : null}

                  <button
                    type="button"
                    className="w-40 bg-slate-600 text-white px-7 py-3 mb-7 mt-5 font-medium rounded shadow-md focus:outline-none focus:shadow-outline hover:bg-gray-900"
                    onClick={(e) => setIsEditing(!isEditing)}
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </aside>

            <main className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0 col-span-4 sm:col-span-9">
              {/* Form */}
              <UserDetailsForm
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                photoURL={photoURL}
                setPhotoURL={setPhotoURL}
                socialLinks={socialLinks}
                setSocialLinks={setSocialLinks}
                isLoading={isLoading}
                role={role}
              />
            </main>
          </FormProvider>
        </div>
      ) : (
        <UserDataFromParamView
          userData={userDataFromParam}
          loggedInUser={userId}
        />
      )}
    </>
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
