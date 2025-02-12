import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import Spinner from "./Loader.js";
import { HiOutlineMail } from "react-icons/hi";

const Message = ({ instructorId, workout, contactEmail }) => {
  const [authUserId, setAuthUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messageInstructor, setMessageInstructor] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthUserId(user.uid);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  function onChange(e) {
    setMessage(e.target.value);
  }

  function onSubmit() {
    setMessage("");
    setMessageInstructor(false);
  }

  // Handle loading state
  if (isLoading) {
    return <Spinner />;
  }

  // Check if current user is the instructor
  const isCreator = instructorId === authUserId;

  return (
    <>
      {/* show message btn if it is not a author of post and btn was not clicked */}
      {!isCreator && !messageInstructor && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-bold">Questions?</h3>
          <p className="text-md mb-6">Contact Instructor</p>
          <button
            onClick={() => setMessageInstructor(true)}
            className="flex justify-center w-40 justify-self-center bg-navy text-white px-7 py-3 mt-5 text-sm font-medium rounded shadow-md hover:bg-gray-900"
          >
            <HiOutlineMail className="mr-2 text-xl" /> Send email
          </button>
        </div>
      )}

      {/* message text area */}
      {messageInstructor && authUserId !== null && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-xl font-bold">Questions?</h3>
          <p className="text-md mb-6">Contact Instructor</p>
          <div className="flex flex-col w-full">
            <p>
              Contact <b>{workout.displayName}</b> about <b>{workout.title}</b>{" "}
              class.
            </p>
            <div className="mt-3 mb-6">
              <textarea
                name="message"
                id="message"
                rows="2"
                value={message}
                onChange={onChange}
                className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
              ></textarea>
            </div>
            <div>
              <a
                href={`mailto:${contactEmail}?Subject=${workout.title} from Vanklass&body=${message}`}
              >
                <button
                  className="flex justify-center w-40 justify-self-center bg-navy text-white px-7 py-3 mt-5 text-sm font-medium rounded shadow-md hover:bg-gray-900"
                  type="submit"
                  onClick={onSubmit}
                >
                  Send Message
                </button>
              </a>
              <button
                className="flex justify-center w-40 justify-self-center bg-orange-dark text-white px-7 py-3 mt-5 text-sm font-medium rounded shadow-md hover:bg-orange-light"
                type="submit"
                onClick={onSubmit}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
