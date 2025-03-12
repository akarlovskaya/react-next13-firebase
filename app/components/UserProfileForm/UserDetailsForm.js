"use client";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import SocialLinksProfileForm from "./SocialLinksProfileForm.js";
import toast from "react-hot-toast";
import Spinner from "../../components/Loader.js";
import UserImageUpload from "./UserImageUpload.js";

function UserDetailsForm({
  isEditing,
  setIsEditing,
  photoURL,
  setPhotoURL,
  socialLinks,
  setSocialLinks,
  role,
}) {
  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useFormContext();

  const auth = getAuth();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    // convert user input (Object) to array
    const updatedSocials = Object.entries(data.socialLinks).map(
      ([name, link]) => ({ name, link })
    );

    const allSocialLinks = socialLinks.map((defaultItem) => {
      const updatedItem = updatedSocials.find(
        (item) => item.name === defaultItem.name
      );
      return updatedItem || defaultItem; // If updatedItem exists, use it; otherwise, use defaultItem
    });

    // Update local state
    setSocialLinks(allSocialLinks);

    const updatedUserData = {
      ...data,
      photoURL,
      socialLinks: allSocialLinks,
    };

    try {
      // Update user data in Firestore
      const userRef = doc(getFirestore(), "users", auth.currentUser.uid);
      await updateDoc(userRef, updatedUserData);
      setPhotoURL(updatedUserData.photoURL);
      console.log("updatedUserData", updatedUserData);
      setLoading(false);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.log("Error updating profile: ", error);
      setLoading(false);
      toast.error("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  if (loading) {
    return <Spinner show={loading} />;
  }

  return (
    <>
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <UserImageUpload setPhotoURL={setPhotoURL} />
          <div className="mb-4">
            <label
              htmlFor="displayName"
              className="block text-gray-700 font-bold mb-2"
            >
              Name*
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              className="border rounded w-full py-2 px-3"
              {...register("displayName", {
                required: { value: true, message: "Full name is required" },
              })}
            />
            {errors?.fullName && (
              <p className="mb-4 text-sm text-red-600" role="alert">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {role === "instructor" ? (
            <div className="mb-4">
              <label
                htmlFor="instructorTitle"
                className="block text-gray-700 font-bold mb-2"
              >
                Title*
              </label>
              <input
                type="text"
                id="instructorTitle"
                name="instructorTitle"
                className="border rounded w-full py-2 px-3"
                placeholder="Ex. Group Fitness Instructor"
                {...register("instructorTitle", {
                  required: { value: true, message: "Title is required" },
                })}
              />
              {errors?.instructorTitle && (
                <p className="mb-4 text-sm text-red-600" role="alert">
                  {errors.instructorTitle.message}
                </p>
              )}
            </div>
          ) : null}

          {/* About */}
          <div className="mb-4">
            <label
              htmlFor="instructorDescription"
              className="block text-gray-700 font-bold mb-2"
            >
              About You*
            </label>
            <textarea
              id="instructorDescription"
              name="instructorDescription"
              className="border rounded w-full py-2 px-3"
              rows="4"
              placeholder="Tell a bit about yourself - experience, what moves you?"
              {...register("instructorDescription", {
                required: { value: true, message: "About section is required" },
              })}
            ></textarea>
            {errors?.instructorDescription && (
              <p className="mb-4 text-sm text-red-600" role="alert">
                {errors.instructorDescription.message}
              </p>
            )}
          </div>
          {/* Contact Email */}
          <div className="mb-4">
            <label
              htmlFor="contactEmail"
              className="block text-gray-700 font-bold mb-2"
            >
              Contact Email*
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              className="border rounded w-full py-2 px-3"
              placeholder="You email address"
              {...register("contactEmail", {
                required: { value: true, message: "Email is required" },
              })}
            />
            {errors?.contactEmail && (
              <p className="mb-4 text-sm text-red-600" role="alert">
                {errors.contactEmail.message}
              </p>
            )}
          </div>
          {/* Contact Phone */}
          <div className="mb-8">
            <label
              htmlFor="contactPhone"
              className="block text-gray-700 font-bold mb-2"
            >
              Contact Phone
            </label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              //   disabled={!editInfo}
              className="border rounded w-full py-2 px-3"
              placeholder="Add phone number. Optional"
              {...register("contactPhone")}
            />
          </div>
          <SocialLinksProfileForm socialLinks={socialLinks} />

          <div className="flex justify-center mt-5">
            <button
              className="w-40 bg-navy text-white px-7 py-3 mr-3 text-sm font-medium rounded shadow-md hover:bg-gray-900"
              type="submit"
              disabled={isSubmitting}
            >
              {!isSubmitting || (
                <span role="status">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </span>
              )}
              <span className="pl-2">
                {isSubmitting ? "Submitting..." : "Submit"}
              </span>
            </button>
            <button
              type="button"
              className="w-40 bg-orange-dark text-white px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-orange-light"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="">
          <h2 className="text-xl font-bold mb-4 text-center">
            {getValues("displayName") || "Your Name"}
          </h2>
          {role === "instructor" ? (
            <h3 className="text-gray-700 font-bold text-center">
              {getValues("instructorTitle") || "Title"}
            </h3>
          ) : null}

          <h2 className="font-semibold uppercase mb-2 mt-8">About Me</h2>
          <p className="text-gray-700">
            {getValues("instructorDescription") || "Tell people about yourself"}
          </p>
          <h2 className="font-semibold uppercase mb-2 mt-8">Contacts</h2>
          <div className="mb-6">
            <div className="flex justify-between flex-wrap gap-2 w-full">
              <span className="text-gray-700 font-bold">Email</span>
            </div>
            <p className="mt-2">{getValues("contactEmail") || "N/A"}</p>
          </div>
          <div className="mb-6">
            <div className="flex justify-between flex-wrap gap-2 w-full">
              <span className="text-gray-700 font-bold">Phone</span>
            </div>
            <p className="mt-2">{getValues("contactPhone") || "N/A"}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default UserDetailsForm;
