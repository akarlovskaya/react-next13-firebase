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

// Profanity filter helper function
const containsProfanity = (text) => {
  const profanityPatterns = [
    /\b(asshole|shit|fuck|bastard|bitch|damn|crap|piss)\b/i,
    /\b(dick|pussy|cunt|whore|slut|nigger|retard)\b/i,
    // Add more patterns as needed
  ];
  return profanityPatterns.some((pattern) => pattern.test(text));
};

// XSS protection helper function
const containsXSS = (text) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /onerror\s*=/gi,
    /onload\s*=/gi,
    /onclick\s*=/gi,
    /onmouseover\s*=/gi,
    /alert\(/gi,
    /eval\(/gi,
    /document\.cookie/gi,
  ];
  return xssPatterns.some((pattern) => pattern.test(text));
};

const NotificationBell = ({
  instructorId,
  workoutTitle,
  instructorName,
  instructorEmail,
  instructorUserName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  // Get the current message value for character count
  const messageValue = watch("message", "");
  const messageLength = messageValue ? messageValue.length : 0;

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
          instructorUserName: instructorUserName,
        }
      );

      reset();
      setIsOpen(false);
      toast.success("Notification sent!");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mt-6">
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
                aria-label="Close notification modal"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-4" noValidate>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  {...register("subject", {
                    required: "Subject is required",
                    maxLength: {
                      value: 100,
                      message: "Subject must be less than 100 characters",
                    },
                    pattern: {
                      value: /^[A-Z][a-zA-Z0-9\s.,!?@#$%^&*()\-+=]*$/,
                      message:
                        "Subject must start with a capital letter and contain only allowed characters",
                    },
                    validate: {
                      noProfanity: (value) =>
                        !containsProfanity(value) ||
                        "Please remove inappropriate language",
                      noXSS: (value) =>
                        !containsXSS(value) ||
                        "Invalid characters detected in subject",
                    },
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.subject ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Notification subject"
                  aria-invalid={errors.subject ? "true" : "false"}
                  aria-describedby={
                    errors.subject ? "subject-error" : undefined
                  }
                />
                {errors.subject && (
                  <p id="subject-error" className="text-red-500 text-sm mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                    maxLength: {
                      value: 500,
                      message: "Message must be less than 500 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9\s.,!?@#$%^&*()\-+=:;'"\n\r]*$/,
                      message: "Message contains invalid characters",
                    },
                    validate: {
                      noProfanity: (value) =>
                        !containsProfanity(value) ||
                        "Please remove inappropriate language",
                      noXSS: (value) =>
                        !containsXSS(value) ||
                        "Invalid characters detected in message",
                      meaningfulContent: (value) =>
                        value.trim().split(/\s+/).length >= 3 ||
                        "Message must contain at least 3 words",
                    },
                  })}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your notification message"
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {messageLength}/500 characters
                </p>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full flex justify-center items-center py-2 px-4 bg-navy text-white rounded-md hover:bg-gray-900 disabled:bg-navy-light"
                aria-busy={isSending}
              >
                {isSending ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    Sending...
                  </>
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
