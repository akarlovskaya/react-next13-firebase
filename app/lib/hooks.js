import { doc, onSnapshot, getFirestore, getDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = doc(getFirestore(), "users", user.uid);

      // Fetch the document data
      const fetchUserData = async () => {
        try {
          const docSnap = await getDoc(ref);
          if (docSnap.exists()) {
            setRole(docSnap.data()?.role);
            setUsername(docSnap.data()?.username);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      // Initial fetch
      fetchUserData();

      // Set up real-time listener
      unsubscribe = onSnapshot(ref, (doc) => {
        if (doc.exists()) {
          setUsername(doc.data()?.username);
          setRole(doc.data()?.role);
        }
      });
    } else {
      setUsername(null);
      setRole(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, role };
}
