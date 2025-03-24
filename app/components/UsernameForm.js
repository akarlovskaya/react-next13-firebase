"use client";
import { useEffect, useState, useCallback, useContext } from "react";
import { doc, writeBatch, getDoc, getFirestore } from "firebase/firestore";
import { UserContext } from "../Provider";
import debounce from "lodash.debounce";

// Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(getFirestore(), "users", user.uid);
    const usernameDoc = doc(getFirestore(), "usernames", formValue);

    try {
      // Commit both docs together as a batch write.
      const batch = writeBatch(getFirestore());
      // batch.set(userDoc, {
      //   username: formValue,
      //   photoURL: user.photoURL,
      //   displayName: user.displayName,
      // });
      batch.set(
        userDoc,
        {
          username: formValue,
          photoURL: user.photoURL || null,
          displayName: user.displayName || null,
        },
        { merge: true }
      );
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
      console.log("Batch commit successful. Redirecting...");
    } catch (error) {
      console.log("Error commit username to Firestore", error);
    }
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3 && username.length <= 15) {
        const ref = doc(getFirestore(), "usernames", username);
        const snap = await getDoc(ref);
        console.log("Firestore read executed!", snap.exists());
        setIsValid(!snap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section className="bg-indigo-50">
        <div className="container m-auto max-w-2xl py-24">
          <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
            <h1 className="text-3xl text-center font-semibold mb-6">
              Choose a Username
            </h1>
            <form onSubmit={onSubmit}>
              <label htmlFor="username" className="sr-only">
                Choose Username
              </label>
              <input
                id="username"
                name="username"
                placeholder="my user name"
                className="border rounded w-full py-2 px-3 mb-10"
                value={formValue}
                onChange={onChange}
              />
              <UsernameMessage
                username={formValue}
                isValid={isValid}
                loading={loading}
              />

              <button
                type="submit"
                className="w-full bg-navy text-white px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-gray-900"
                disabled={!isValid}
              >
                Submit
              </button>

              {/* <h3>Debug State</h3>
            <div>
              Username: {formValue}
              <br />
              Loading: {loading.toString()}
              <br />
              Username Valid: {isValid.toString()}
            </div> */}
            </form>
          </div>
        </div>
      </section>
    )
  );
}

export default UsernameForm;

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return (
      <div className="h-24 p-4 mb-4 text-m bg-white" role="alert">
        <p className="mb-10 text-base">Checking...</p>
      </div>
    );
  } else if (isValid) {
    return (
      <div className="h-24 p-4 mb-4 text-m bg-white" role="alert">
        <p className="mb-10 text-base text-green-600">
          @{username} is available!
        </p>
      </div>
    );
  } else if (username && !isValid) {
    return (
      <div className="h-24 p-4 mb-4 text-m bg-white" role="alert">
        <p className="mb-10 text-base text-red-600">That username is taken!</p>
      </div>
    );
  } else {
    return (
      <div className="h-24 p-4 mb-4 text-m bg-white " role="alert">
        <p className="mb-10 text-base"></p>
      </div>
    );
  }
}
