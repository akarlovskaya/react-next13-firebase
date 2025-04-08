import Image from "next/image";
import SocialLinks from "./SocialLinks.js";
import Link from "next/link";
import Message from "./Message";

export default function UserDataFromParamView({ userData, loggedInUser }) {
  console.log("userData", userData);
  return (
    <section className="bg-indigo-50">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
          <aside className="col-span-4 sm:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col items-center">
                <div className="flex flex-col items-center">
                  <div className="relative aspect-square w-full h-full mb-4">
                    <Image
                      src={userData?.photoURL || "/avatar-img.png"}
                      alt={
                        `${userData?.displayName}'s Avatar Picture` ||
                        "Profile Avatar"
                      }
                      fill
                      className="object-cover rounded-full border-2 border-white shadow-sm"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {userData?.username && (
                    <h1 className="text-xl font-bold">@{userData?.username}</h1>
                  )}
                </div>
              </div>
              <hr className="my-6 border-t border-gray-300" />

              {!loggedInUser ? (
                <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-center">
                  <p className="text-gray-700 mb-2">
                    Please log in to view details.
                  </p>
                  <Link
                    href="/sign-in"
                    className="text-navy-light font-semibold hover:underline"
                  >
                    Sign In
                  </Link>
                </div>
              ) : (
                <>
                  {userData?.socialLinks && (
                    <SocialLinks socialLinks={userData?.socialLinks} />
                  )}
                  <Message
                    instructorId={userData.uid}
                    contactEmail={userData.contactEmail}
                  />
                </>
              )}
            </div>
          </aside>

          <main className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0 col-span-4 sm:col-span-9">
            <h2 className="text-xl font-bold mb-4 text-center">
              {userData?.displayName}
            </h2>
            <h3 className="text-gray-700 font-bold text-center">
              {userData?.instructorTitle}
            </h3>
            <h2 className="font-semibold uppercase mb-2 mt-8">About Me</h2>
            <p className="text-gray-700">
              {userData?.instructorDescription || "No information added yet."}
            </p>

            {/* {(userData?.contactEmail || userData?.contactPhone) && (
              <h2 className="font-semibold uppercase mb-2 mt-8">Contacts</h2>
            )}
            {!loggedInUser ? (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-center">
                <p className="text-gray-700 mb-2">
                  Please log in to view details.
                </p>
                <Link
                  href="/sign-in"
                  className="text-navy-light font-semibold hover:underline"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <>
                {userData?.contactEmail && (
                  <div className="mb-6">
                    <div className="flex justify-between flex-wrap gap-2 w-full">
                      <span className="text-gray-700 font-bold">Email</span>
                    </div>
                    <p className="mt-2">{userData?.contactEmail}</p>
                  </div>
                )}

                {userData?.contactPhone && (
                  <div className="mb-6">
                    <div className="flex justify-between flex-wrap gap-2 w-full">
                      <span className="text-gray-700 font-bold">Phone</span>
                    </div>
                    <p className="mt-2">{userData?.contactPhone}</p>
                  </div>
                )}
              </>
            )} */}
          </main>
        </div>
      </div>
    </section>
  );
}
