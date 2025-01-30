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
      <div className="container m-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
          <main>
            <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
              <h1 className="text-3xl text-center font-semibold mb-6">
                Add Class Details
              </h1>
              {post && (
                <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                  <section className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0 col-span-4 sm:col-span-9">
                    <WorkoutAddForm
                      postRef={postRef}
                      defaultValues={post}
                      // preview={preview}
                    />
                  </section>
                  <aside className="col-span-4 sm:col-span-3">
                    {/* <h3 className="font-bold">Tools</h3> */}

                    <Link
                      className="w-40 block bg-navy text-white px-7 py-3 mb-7 text-sm font-medium text-center rounded shadow-md focus:outline-none focus:shadow-outline hover:bg-gray-900"
                      href={`/${post.username}/${post.slug}`}
                    >
                      <button className="">Live view</button>
                    </Link>

                    <button
                      className="w-40 bg-orange-dark text-white px-7 py-3 mb-7 text-sm font-medium rounded shadow-md focus:outline-none focus:shadow-outline hover:bg-orange-light"
                      // onClick={() => setPreview(!preview)}
                    >
                      Delete
                    </button>
                  </aside>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

export default WorkoutPostManager;
