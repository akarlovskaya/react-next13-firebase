import { doc, getFirestore, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import Spinner from "../components/Loader.js";
import SocialLinks from "./SocialLinks";
import Message from "./Message";
import Link from "next/link";
import Image from "next/image";

function InstructorInfo({ workout, currentUser }) {
  const db = getFirestore();
  // Destructure the instructor info from workout and set it as the initial state for instructorData
  const [instructorData, setInstructorData] = useState({
    photoURL: "",
    displayName: "",
    id: workout.uid ?? "",
    instructorTitle: "",
    contactEmail: "",
    contactPhone: "",
    instructorDescription: "",
    socialLinks: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch additional instructor data from Firestore
  useEffect(() => {
    const fetchInstructorInfo = async () => {
      try {
        // Use the instructor id from the workout object to fetch the instructor's data
        const userRef = doc(db, "users", workout.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          console.log("Firestore read executed!", userDoc.exists());
          // Merge the existing data with any additional data from Firestore
          setInstructorData((prevState) => ({
            ...prevState,
            ...userDoc.data(),
          }));
        } else {
          console.log("Instructor document not found.");
        }
      } catch (error) {
        console.error("Error fetching instructor data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorInfo();
  }, [workout.uid]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner show={loading} />
        </div>
      ) : (
        instructorData && (
          <>
            <div className="flex flex-col items-center">
              <div className="relative aspect-square w-2/3 h-2/3 mb-4">
                <Image
                  src={instructorData.photoURL || "/avatar-img.png"}
                  alt={`${
                    instructorData.displayName || "Profile Name"
                  }'s photo`}
                  fill
                  className="object-cover rounded-full border-2 border-white shadow-sm"
                  sizes="(max-width: 768px) 33vw, 50vw"
                />
              </div>

              <Link
                href={`/${instructorData.username}`}
                className="text-navy-light font-semibold hover:underline text-2xl"
              >
                {instructorData.displayName}
              </Link>

              {instructorData.instructorTitle && (
                <p className="text-gray-700 mb-3">
                  {instructorData.instructorTitle}
                </p>
              )}
            </div>

            {instructorData.instructorDescription && (
              <>
                <h3 className="text-xl mt-4">About:</h3>
                <p className="my-2 bg-gray-50 p-2">
                  {instructorData.instructorDescription}
                </p>
              </>
            )}

            <hr className="my-4" />

            {!currentUser ? (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-center">
                <p className="text-gray-700 mb-2">
                  Please log in to view contact details.
                </p>
                <Link
                  href="/sign-in"
                  className="text-navy-light font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <>
                {instructorData.contactPhone && (
                  <>
                    <h3 className="text-xl mt-4">Contact Phone:</h3>
                    <p className="my-2 mb-6 bg-beige p-2 font-semibold text-gray-700">
                      {instructorData.contactPhone}
                    </p>
                  </>
                )}

                <SocialLinks
                  socialLinks={instructorData.socialLinks}
                  loading={loading}
                />

                <Message
                  instructorId={workout.uid}
                  workout={workout}
                  contactEmail={instructorData.contactEmail}
                  instructorName={instructorData.displayName}
                />
              </>
            )}
          </>
        )
      )}
    </div>
  );
}

export default InstructorInfo;
