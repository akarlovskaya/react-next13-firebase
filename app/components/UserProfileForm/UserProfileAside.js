import { IoCreateOutline } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
// import SocialLinksProfileForm from "../SocialLinksProfileForm.js";

const UserProfileAside = ({ user }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  console.log("user from Aside", user);

  return (
    // <aside className="col-span-4 sm:col-span-3">
    //   {/* Profile Image */}
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <Image
            src={user?.photoURL || "/avatar-img.png"}
            alt={`${user?.displayName}'s Avatar Picture` || "Profile Avatar"}
            className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
            width={500}
            height={500}
          />

          {user.displayName && (
            <h1 className="text-xl font-bold">{user?.displayName}</h1>
          )}
          {/* {instructorTitle &&
                <p className="text-gray-700">{instructorTitle}</p>
              } */}
          {user.username && <p className="text-gray-700">@{user?.username}</p>}
        </div>
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {/* <button
              type="submit"
              className="white hover:text-purple text-navy font-bold py-2 px-4 rounded-full w-full border-2 focus:outline-none focus:shadow-outline"
                onClick={()=> {
                  editInfo && onSubmit();
                  setEditInfo(prevState => !prevState)
                }
              }
            >
              {editInfo ? "Save" : "Edit"}
            </button> */}
        </div>
      </div>
      <hr className="my-6 border-t border-gray-300" />
      {/* <SocialLinksProfileForm
          socialLinks={formData.socials}
          onSocialLinkChange={onChange}
          editInfo={editInfo}
        /> */}
      <p>Link Socials</p>
    </div>
    // </aside>
  );
};

export default UserProfileAside;
