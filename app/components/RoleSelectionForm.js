"use client";
import { useState } from "react";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RoleSelectionForm({ user, setUserRole }) {
  const [role, setRole] = useState("participant");
  const db = getFirestore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save role to Firebase
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { role });
    // Update state in parent component
    setUserRole(role);
    // Redirect to Home Page
    router.push("/");
  };

  return (
    <section className="bg-indigo-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md my-8"
          >
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
              What brings you here?
            </h3>

            <div className="space-y-4">
              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <label className="flex items-center cursor-pointer w-full">
                  <input
                    type="radio"
                    name="role"
                    value="participant"
                    checked={role === "participant"}
                    onChange={() => setRole("participant")}
                    className="h-5 w-5 bg-navy"
                  />
                  <span className="ml-3 text-gray-700">
                    I&#39;m looking to join workout classes
                  </span>
                </label>
              </div>

              <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <label className="flex items-center cursor-pointer w-full">
                  <input
                    type="radio"
                    name="role"
                    value="instructor"
                    checked={role === "instructor"}
                    onChange={() => setRole("instructor")}
                    className="h-5 w-5 bg-navy"
                  />
                  <span className="ml-3 text-gray-700">
                    I&#39;m an instructor offering classes
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-3 px-4 bg-navy text-white text-sm font-medium rounded shadow-md hover:bg-gray-900"
            >
              Continue
            </button>
          </form>{" "}
        </div>
      </div>
    </section>
  );
}
