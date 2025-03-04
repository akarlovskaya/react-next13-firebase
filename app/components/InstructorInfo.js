import { doc, getFirestore, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import Spinner from "../components/Loader.js";
import SocialLinks from "./SocialLinks";
import Message from "./Message";

function InstructorInfo({ workout }) {
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
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching instructor data: ", error);
        setLoading(false);
      }
    };

    fetchInstructorInfo();
    setLoading(false);
  }, [workout.id]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner show={loading} />
        </div>
      ) : (
        instructorData && (
          <>
            <h2 className="text-xl font-bold mb-6">Instructor Info</h2>

            <div className="flex flex-col items-center">
              <h3 className="text-2xl">{instructorData.displayName}</h3>

              {instructorData.instructorTitle && (
                <p className="text-gray-700 mb-3">
                  {instructorData.instructorTitle}
                </p>
              )}

              {instructorData.photoURL && (
                <img
                  src={instructorData.photoURL || "/avatar-img.png"}
                  className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                  alt={`${
                    instructorData.displayName || "Profile Name"
                  }'s photo`}
                />
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

            {instructorData.contactPhone && (
              <>
                <h3 className="text-xl mt-4">Phone:</h3>
                <p className="my-2 mb-6 bg-beige p-2 font-bold">
                  {instructorData.contactPhone}
                </p>
              </>
            )}

            {instructorData.socialLinks && (
              <SocialLinks
                socialLinks={instructorData.socialLinks}
                loading={loading}
              />
            )}

            <Message
              instructorId={workout.uid}
              workout={workout}
              contactEmail={instructorData.contactEmail}
            />
          </>
        )
      )}
    </div>
  );
}

export default InstructorInfo;
