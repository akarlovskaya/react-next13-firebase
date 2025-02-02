import { getUserWithUsername, postToJSON } from "../lib/firebase";
import {
  query,
  collection,
  getDocs,
  orderBy,
  getFirestore,
} from "firebase/firestore";
import { notFound } from "next/navigation";
import UserProfile from "../components/UserProfile";
import ClassListing from "../components/ClassListing";

// Metatags
export async function generateMetadata({ params }) {
  const { username } = await params;

  return {
    title: username,
    description: `${username}'s classes, about and contacts`,
  };
}

// Add export const dynamic = 'force-dynamic' to ensure server-side rendering
export const dynamic = "force-dynamic";

export default async function UserProfilePage({ params }) {
  const { username } = await params;

  try {
    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
      return notFound();
    }
    // JSON serializable data
    const user = userDoc.data(); // user's profile

    try {
      const postsQuery = query(
        collection(getFirestore(), userDoc.ref.path, "workouts"),
        // where('published', '==', true),
        orderBy("createdAt", "desc")
        // limit(5)
      );

      // 'desc': Sort in descending order (latest to earliest).
      // 'asc': Sort in ascending order (earliest to latest).

      const postsSnapshot = await getDocs(postsQuery);
      const workouts = postsSnapshot.docs.map(postToJSON);

      return (
        <section className="bg-indigo-50">
          <div className="container mx-auto py-8">
            <UserProfile user={user} />
            {workouts?.length > 0 && (
              <section className="bg-blue-50 px-4 py-10">
                <div className="container-xl lg:container m-auto">
                  <h2 className="text-3xl font-bold text-navy mb-6 text-center">
                    My Classes
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {workouts.map((workout) => (
                      <ClassListing
                        key={workout.slug}
                        classId={workout.slug}
                        workout={workout}
                        admin={true}
                      />
                    ))}
                  </ul>
                </div>
              </section>
            )}
          </div>
        </section>
      );
    } catch (error) {
      console.error("Error fetching workouts:", error);
      return (
        <section className="bg-indigo-50">
          <div className="container mx-auto py-8">
            <UserProfile user={user} />
            <div className="text-center p-4 bg-red-50 text-red-600 rounded-md">
              <p>Unable to load classes. Please try again later.</p>
            </div>
          </div>
        </section>
      );
    }
  } catch (error) {
    console.error("Error in UserProfilePage:", error);
    return (
      <section className="bg-red-50 min-h-screen">
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {error.message || "Something went wrong"}
            </h1>
            <p className="text-gray-600">
              Please try again later or contact support if the problem persists.
            </p>
          </div>
        </div>
      </section>
    );
  }
}
