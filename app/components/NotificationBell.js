"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiBell, FiSend, FiX } from "react-icons/fi";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import Spinner from "../components/Loader.js";

const db = getFirestore();

const NotificationBell = ({
  instructorId,
  workoutTitle,
  instructorName,
  instructorEmail,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  console.log("BELL instructorId", instructorId);
  console.log("BELL workoutTitle", workoutTitle);

  const onSubmit = async (data) => {
    setIsSending(true);
    try {
      // Write directly to Firestore to trigger the Cloud Function
      // path users/${uid}/workouts/${slug}/notifications
      await addDoc(
        collection(
          db,
          "users",
          instructorId,
          "workouts",
          workoutTitle,
          "notifications"
        ),
        {
          ...data,
          status: "pending",
          createdAt: serverTimestamp(),
          instructorName: instructorName,
          instructorEmail: instructorEmail,
        }
      );

      reset();
      setIsOpen(false);
      toast.success("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-40 m-auto flex justify-center text-navy rounded items-center focus:shadow-outline hover:text-orange-dark"
      >
        <FiBell className="mr-2 text-xl" />
        Notify Class
      </button>

      {/* Modal Overlay and Centered Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">
                Send notification about class changes.
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  {...register("subject", { required: true })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Notification subject"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  {...register("message", { required: true })}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Your notification message"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full flex justify-center items-center py-2 px-4 bg-navy text-white rounded-md hover:bg-gray-900 disabled:bg-navy-light"
              >
                {isSending ? (
                  "Sending..."
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Notify
                  </>
                )}
              </button>
              <p className="mt-4 font-light text-sm text-center">
                Email will be sent to all class followers.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
