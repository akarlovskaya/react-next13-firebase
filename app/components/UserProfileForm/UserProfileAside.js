import { IoCreateOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
// import SocialLinksProfileForm from "../SocialLinksProfileForm.js";

const UserProfileAside = () => {
  const { getValues } = useFormContext();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <Image
            src={getValues("photoURL") || "/avatar-img.png"}
            alt={
              `${getValues("displayName")}'s Avatar Picture` || "Profile Avatar"
            }
            className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
            width={500}
            height={500}
          />

          {getValues("username") && (
            <h1 className="text-xl font-bold">@{getValues("username")}</h1>
          )}
        </div>
        {/* <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <button
              type="button"
              className="white hover:text-purple text-navy font-bold py-2 px-4 rounded-full w-full border-2 focus:outline-none focus:shadow-outline"
                onClick={()=> {
                  editInfo && onSubmit();
                  setEditInfo(prevState => !prevState)
                }
              }
            >
              {editInfo ? "Save" : "Edit"}
            </button>
        </div> */}
      </div>
      <hr className="my-6 border-t border-gray-300" />
      {/* <SocialLinksProfileForm
          socialLinks={formData.socials}
          onSocialLinkChange={onChange}
          editInfo={editInfo}
        /> */}
      <p>Link Socials</p>
    </div>
  );
};

export default UserProfileAside;
