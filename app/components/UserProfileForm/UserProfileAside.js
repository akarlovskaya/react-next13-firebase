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
              <Image
                src={photoURL || "/avatar-img.png"}
                alt={
                  `${getValues("displayName")}'s Avatar Picture` ||
                  "Profile Avatar"
                }
                className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                width={500}
                height={500}
              />

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
