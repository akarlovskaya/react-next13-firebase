"use client";
import Link from "next/link";
import { UserContext } from "../Provider";
import { useContext } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { firestore, getUserWithUsername, postToJSON } from "../lib/firebase";
import {
  doc,
  getDocs,
  getDoc,
  collectionGroup,
  query,
  limit,
  getFirestore,
} from "firebase/firestore";
import ShareLink from "./ShareLink";
import { FaArrowLeft, FaMapMarker } from "react-icons/fa";
import InstructorInfo from "./InstructorInfo.js";
import ReactMarkdown from "react-markdown";

function WorkoutPageContent({ workout }) {
  const { user: currentUser } = useContext(UserContext);
  console.log("workout", workout);
  console.log("currentUser", currentUser);

  const { title, address, description, fee, time, daysOfWeek, paymentOptions } =
    workout;

  // Convert time to AM / PM for ClassPage.jsx
  const changeTimeFormat = (time) => {
    const timeString12hr = new Date(
      "1970-01-01T" + time + "Z"
    ).toLocaleTimeString("en-CA", {
      timeZone: "UTC",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
    });
    return timeString12hr;
  };

  // Capitalize First Letter for Days Array and string together with comma for ClassPage.jsx
  function formatDaysArray(daysArray) {
    if (daysArray?.length) {
      return daysArray
        .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
        .join(", ");
    }
    return "";
  }

  return (
    <>
      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            href="/"
            className="text-indigo-500 hover:text-indigo-600 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to All Classes
          </Link>
        </div>
      </section>

      <section className="bg-indigo-50">
        <div className="container m-auto py-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
            <main>
              <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
                <div className="relative flex justify-end">
                  <ShareLink />
                </div>

                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                {address?.city && (
                  <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
                    <FaMapMarker className="inline text-lg mb-1 mr-1 mt-1 text-orange-dark" />
                    <p className="text-orange-dark"> {address?.city} </p>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mt-6 mb-10">
                <h3 className="text-indigo-800 text-lg font-bold mb-2">
                  Class Description
                </h3>
                {description !== "" && (
                  <>
                    <div className="mb-4 markdown-editor">
                      <ReactMarkdown>{description}</ReactMarkdown>
                    </div>

                    <h3 className="text-indigo-800 text-lg font-bold mb-2">
                      Fee
                    </h3>
                    <p className="mb-4">${fee} CAD</p>

                    <h3 className="text-indigo-800 text-lg font-bold mb-2">
                      Schedule
                    </h3>

                    <p className="mb-4">
                      {changeTimeFormat(time)} on {formatDaysArray(daysOfWeek)}{" "}
                    </p>

                    <h3 className="text-indigo-800 text-lg font-bold mb-2">
                      Location
                    </h3>
                    <b className="mb-4">{address?.place} </b>
                    <address className="mb-4">
                      {address?.street}
                      <br />
                      {`${address?.city}, ${address?.region}`}
                      <br />
                      {address?.zipcode}
                    </address>

                    <h3 className="text-indigo-800 text-lg font-bold mb-2">
                      Payment Options
                    </h3>
                    <ul>
                      {paymentOptions?.map((payment) => {
                        return (
                          <li key={payment}>
                            {payment.charAt(0).toUpperCase() + payment.slice(1)}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>

              {currentUser?.uid === workout.uid && (
                <Link href={`/admin/${workout.slug}`}>
                  <button className="w-40 justify-self-center bg-navy text-white px-7 py-3 mt-5 text-sm font-medium rounded shadow-md hover:bg-gray-900">
                    Edit Post
                  </button>
                </Link>
              )}
            </main>

            {/* <!-- Sidebar --> */}
            <aside>
              {/* <InstructorInfo workout={workout} currentUser={currentUser}/>  */}
              {/* <Message instructorId={workout.instructor.id} workout={workout}/> */}

              {/* <!-- Manage --> */}
              {/* <Link
                    to={`/edit-class/${workout.id}`}
                    className="bg-navy hover:gray-700 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                    >Edit Class</Link>
                <button 
                    onClick={() => deleteWorkout(workout.id)}
                    className="bg-orange-dark hover:bg-dark-light text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block">
                    Delete Class
                </button>
                */}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

export default WorkoutPageContent;
