"use client";
import { useState } from "react";
// import { db } from "../firebase";
// import { doc, updateDoc } from "firebase/firestore";

export default function UnsubscribePage() {
  const [email, setEmail] = useState("");
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    alert("boo", e);
    // try {
    //   // Cloud function to handle unsubscription
    //   await unsubscribeEmail(email);
    //   setIsUnsubscribed(true);
    // } catch (err) {
    //   setError('Failed to unsubscribe. Please try again.');
    //   console.error(err);
    // }
  };

  if (isUnsubscribed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Unsubscribe Successful
          </h1>
          <p className="text-gray-600">
            Success! You have been unsubscribed from workout notifications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Unsubscribe</h1>
        <p className="text-gray-600 mb-6">
          Enter your email address to unsubscribe from workout notifications.
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleUnsubscribe}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-navy hover:bg-navy-light text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Unsubscribe
          </button>
        </form>
      </div>
    </div>
  );
}
