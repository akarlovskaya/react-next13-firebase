import Image from "next/image";
import { useFormContext } from "react-hook-form";
import SocialLinks from "../SocialLinks.js";

const UserProfileAside = ({ photoURL, isLoading, socialLinks }) => {
  const { getValues } = useFormContext();

  return (
    <>
      {!isLoading && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              <div className="relative aspect-square w-full h-full mb-4">
                <Image
                  src={photoURL || "/avatar-img.png"}
                  alt={
                    `${getValues("displayName")}'s Avatar Picture` ||
                    "Profile Avatar"
                  }
                  fill
                  className="object-cover rounded-full border-2 border-white shadow-sm"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {getValues("username") && (
                <h1 className="text-xl font-bold">@{getValues("username")}</h1>
              )}
            </div>
          </div>
          <hr className="my-6 border-t border-gray-300" />
          {socialLinks && <SocialLinks socialLinks={socialLinks} />}
        </div>
      )}
    </>
  );
};

export default UserProfileAside;
