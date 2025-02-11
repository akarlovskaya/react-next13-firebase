"use client";
import { useState } from "react";
import { auth } from "../lib/firebase";
import { doc, getFirestore } from "firebase/firestore";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import WorkoutAddForm from "./WorkoutAddForm";
import Link from "next/link";

function WorkoutPostManager({ slug }) {
  const postRef = doc(
    getFirestore(),
    "users",
    auth.currentUser.uid,
    "workouts",
    slug
  );
  const [post] = useDocumentDataOnce(postRef);
  // const [preview, setPreview] = useState(false);

  return (
    <section className="bg-indigo-50">
      <div className="container m-auto max-w-2xl py-24">
        {/* <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6"> */}
        <main>
          <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
            <h1 className="text-3xl text-center font-semibold mb-6">
              Add Class Details
            </h1>
            {post && (
              <section className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0 col-span-4 sm:col-span-9">
                <WorkoutAddForm
                  postRef={postRef}
                  defaultValues={post}
                  // preview={preview}
                />
              </section>
            )}
          </div>
        </main>
        {/* </div> */}
      </div>
    </section>
  );
}

export default WorkoutPostManager;
