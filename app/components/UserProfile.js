
import Link from 'next/link';
import Image from 'next/image';
import SignOutButton from './SignOutButton';
import { IoCreateOutline } from "react-icons/io5";

function UserProfile({ user }) {

  return (
      <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
        <aside className="col-span-4 sm:col-span-3">
          {/* Profile Image */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center">
                <Image
                    src={user.photoURL  || '/avatar-img.png'}
                    alt={`${user.displayName}'s Avatar Picture` || "Profile Avatar"}
                    className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                    width={500}
                    height={500}
                />

                  {user.displayName &&
                    <h1 className="text-xl font-bold">{user.displayName}</h1> 
                  }
                  {/* {instructorTitle &&
                    <p className="text-gray-700">{instructorTitle}</p>
                  } */}
                    {user.username &&
                    <p className="text-gray-700">@{user.username}</p>
                  }
              </div>
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                {/* <button
                  type="submit"
                  className="white hover:text-purple text-navy font-bold py-2 px-4 rounded-full w-full border-2 focus:outline-none focus:shadow-outline"
                  onClick={()=> {
                    editInfo && onSubmit();
                    setEditInfo(prevState => !prevState) 
                  }}
              >
                  { editInfo ? "Save" : "Edit" }
              </button> */}
              </div>
            </div>
            <hr className="my-6 border-t border-gray-300" />
            {/* <SocialLinksProfileForm socialLinks={formData.socials} onSocialLinkChange={onChange} editInfo={editInfo}/> */}
            
          </div>
          {/* <!-- Manage --> */}
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            {/* Create Class Listing Button*/}
            <Link href="/admin"
                className='flex bg-navy hover:bg-navy-light justify-center text-white py-4 rounded-full items-center focus:outline-none focus:shadow-outline'>
                <IoCreateOutline className='mr-2 text-xl'/> Create Class
            </Link>
          </div>
        </aside>

        <main className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0 col-span-4 sm:col-span-9">
          {/* Image upload */}

          {/* Form */}
        </main>
      </div>
  )
}

export default UserProfile;