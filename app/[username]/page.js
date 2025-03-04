import { getUserWithUsername } from "../lib/firebase";
import { notFound } from "next/navigation";
import UserProfile from "../components/UserProfile";
import WorkoutList from "../components/WorkoutList";

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
    const userDataFromParam = userDoc.data(); // user's profile from url param, based on username

    return (
      <section className="bg-indigo-50">
        <div className="container mx-auto py-8">
          <UserProfile
            usernameParam={username}
            userDataFromParam={userDataFromParam}
          />
          <WorkoutList usernameParam={username} />
        </div>
      </section>
    );
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
