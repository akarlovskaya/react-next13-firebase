import { getUserWithUsername } from "../lib/firebase";
import { notFound } from "next/navigation";
import UserProfile from "../components/UserProfile";
import WorkoutList from "../components/WorkoutList";

// Metatags
export async function generateMetadata({ params }) {
  const { username } = await params;

  return {
    title: `${username}'s Profile`,
    description: `${username}'s classes, about, and contacts`,
    robots: {
      index: false, // Blocks indexing (noindex)
      follow: true, // Allows link-following (optional)
    },
    // OpenGraph/Twitter tags for social sharing
    openGraph: {
      title: `${username}'s Profile`,
      description: `${username}'s fitness journey`,
    },
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
    const userDataFromParam = userDoc;
    if (!userDataFromParam) {
      console.log(
        "User document exists but has no data, triggering notFound()"
      );
      return notFound();
    } // user's profile from url param, based on username

    return (
      <section className="bg-indigo-50">
        <div className="container mx-auto py-8">
          <UserProfile
            usernameParam={username}
            userDataFromParam={userDataFromParam}
            role={userDataFromParam.role}
          />
          <WorkoutList usernameParam={username} role={userDataFromParam.role} />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error in UserProfilePage:", error);
    throw error;
  }
}
