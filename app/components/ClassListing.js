"use client";
import { getFirestore, deleteDoc, doc } from "firebase/firestore";
import { useContext, useState } from "react";
import { UserContext } from "../Provider";
import Link from "next/link";
import { FaMapMarker } from "react-icons/fa";
import Moment from "react-moment";
import { FaTrash } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function ClassListing({ workout, admin }) {
  const { title, address, slug, fee, username, createdAt, published, uid } =
    workout;
  let { shortDescription } = workout;
  const router = useRouter();
  const { user: currentUser } = useContext(UserContext);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // show short version of description
  if (!showFullDescription && shortDescription?.length >= 130) {
    shortDescription = shortDescription.substring(0, 130) + "...";
  }

  const handleDelete = async (classId) => {
    const confirmation = confirm(
      "Are you sure you want to delete this workout?"
    );

    if (confirmation) {
      try {
        const workoutRef = doc(
          getFirestore(),
          "users",
          workout.uid,
          "workouts",
          classId
        );
        // console.log('Document path:', postRef.path); //users/alyXnb60N0ZkMGMmBZCeFgCJBry1/posts/test
        await deleteDoc(workoutRef);

        router.push("/admin");
        toast("Workout deleted ", { icon: "🗑️" });
      } catch (error) {
        console.error("Error deleting workout:", error);
      }
    }
  };

  return (
    <li
      key={`${slug}-${uid}`}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-150 relative"
    >
      <Moment
        className="absolute top-2 right-2 bg-beige uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
        fromNow
      >
        {createdAt}
      </Moment>
      <div className="p-4">
        <div className="mb-6">
          <Link href={`/${username}/${slug}`}>
            <h3 className="text-xl font-bold">{title}</h3>
            <p>by @{username}</p>
          </Link>
        </div>

        <div className="mb-5 min-h-20">
          <span>{shortDescription}&nbsp;</span>
          {shortDescription?.length >= 130 ? (
            <button
              onClick={() => setShowFullDescription((prevState) => !prevState)}
              className="text-navy mb-5 hover:text-indigo-600"
            >
              {showFullDescription ? "Less" : "Read more"}
            </button>
          ) : null}
        </div>

        {published ? (
          <h3 className="text-navy mb-2">${fee} CAD</h3>
        ) : (
          <h3 className="text-navy mb-2 ">Draft</h3>
        )}

        <div className="border border-gray-100 mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between relative">
          <div className="text-orange-dark mb-3">
            {address?.city ? (
              <>
                <FaMapMarker className="inline text-lg mb-1 mr-1" />
                {address.city}
              </>
            ) : (
              <div className="inline text-lg mb-1 mr-1"></div>
            )}
          </div>

          {/* If admin view, show extra controls for user */}

          {admin && currentUser?.uid == workout.uid && (
            <div>
              <button
                className="absolute bottom-4 right-2 h-[14px] cursor-pointer text-orange-dark"
                onClick={() => handleDelete(slug)}
              >
                <FaTrash />
              </button>

              <Link href={`/admin/${slug}`}>
                <MdModeEdit className="absolute bottom-4 right-7 h-4 cursor-pointer text-black" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default ClassListing;
