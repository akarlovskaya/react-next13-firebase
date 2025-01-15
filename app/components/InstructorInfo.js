// import SocialLinks from './SocialLinks';
// import defaultAvatarImg from '../avatar-img.png';
import Spinner from '../components/Loader.js';

const InstructorInfo = ({workout, user}) => {
  //  console.log('workout', workout);
  // Destructure the instructor info from workout and set it as the initial state for instructorData
  // const [instructorData, setInstructorData] = useState({
  //   avatarImage: '',
  //   name: workout.instructor.name,
  //   id: workout.instructor.id,
  //   instructorTitle: '',
  //   contactEmail: workout.instructor.contactEmail,
  //   contactPhone: workout.instructor.contactPhone,
  //   instructorDescription: '',
  //   socials: {}
  // });
  // const [loading, setLoading] = useState(false);

  // Fetch additional instructor data from Firestore
  //   useEffect(() => {
  //     const fetchInstructorInfo = async () => {
  //       try {
  //         setLoading(true);
  //         // Use the instructor.id from the workout object to fetch the instructor's data
  //         const userRef = doc(db, "users", workout.instructor.id);
  //         const userDoc = await getDoc(userRef);

  //         if (userDoc.exists()) {
  //           // Merge the existing data with any additional data from Firestore
  //           setInstructorData((prevState) => ({
  //             ...prevState,
  //             ...userDoc.data(),
  //           }));
  //       }
  //         else {
  //           console.log("Instructor document not found.");
  //           setLoading(false);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching instructor data: ", error);
  //         setLoading(false);
  //       }
  //     };
  
  //     fetchInstructorInfo();
  //     setLoading(false);
  //     console.log('instructorData', instructorData);
  //   }, [workout.instructor.id]); 

  // // Handle loading state if data isn't fetched yet
  // if (loading) {
  //   return <Spinner />;
  // }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-6">Instructor Info</h2>
        <div className="flex flex-col items-center">
          <h3 className="text-2xl ">{ instructorData.name }</h3>
          {instructorData.instructorTitle &&
            <p className="text-gray-700 mb-3">{instructorData.instructorTitle}</p>
          }
          <img 
            src={instructorData.avatarImage  || defaultAvatarImg}
            className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
            alt={`${instructorData.name || 'Profile Name'}'s photo`}>
          </img>
        </div>


        {instructorData.instructorDescription && (
          <>
          <h3 className="text-xl mt-4">About:</h3>
          <p className="my-2 bg-gray-50 p-2 p-2 ">{ instructorData.instructorDescription }</p>
          </>
        )}

        <hr className="my-4" />

        {instructorData.contactPhone && (
          <>
          <h3 className="text-xl mt-4">Phone:</h3>
          <p className="my-2 bg-beige p-2 font-bold">{ instructorData.contactPhone }</p>
          </>
        )}

        {instructorData.socials && (
          <SocialLinks socialLinks={instructorData.socials} loading={loading}/>
        )}
    </div>
  )
}

export default InstructorInfo;
