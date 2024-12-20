// 'use client';
import Link from 'next/link';
// import { useContext } from 'react';
// import { UserContext } from '../../lib/context';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { firestore, getUserWithUsername, postToJSON } from '../lib/firebase';
import { doc, getDocs, getDoc, collectionGroup, query, limit, getFirestore } from 'firebase/firestore';
import ShareLink from './ShareLink';
import { FaArrowLeft, FaMapMarker } from 'react-icons/fa';

function WorkoutPageContent( {workout} ) {
  return (
    <>
    <section>
        <div className="container m-auto py-6 px-6">
            <Link
                href="/"
                className="text-indigo-500 hover:text-indigo-600 flex items-center">
                <FaArrowLeft className='mr-2'/> Back to All Classes
            </Link>
        </div>
    </section>

    <section className="bg-indigo-50">
    <div className="container m-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
        <main>
            <div
                className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">

                    <div className='relative flex justify-between'>
                        <ShareLink />
                    </div>

                <h1 className="text-3xl font-bold mb-4">
                    { workout.title }
                </h1>
                <div
                className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
                    <FaMapMarker className='inline text-lg mb-1 mr-1 mt-1 text-orange-dark' />
                    {/* <p className="text-orange-dark"> { workout.location.city } </p> */}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-indigo-800 text-lg font-bold mb-6">
                    Class Description
                </h3>

                <p className="mb-4"> { workout.content } </p>

                <h3 className="text-indigo-800 text-lg font-bold mb-2">Fee</h3>

                {/* { workout.type === "Session" ? 
                    <p className="mb-4">${workout.cost} CAD per 10 sessions</p>
                : 
                    <p className="mb-4">${workout.cost} CAD</p> 
                } */}

                <h3 className="text-indigo-800 text-lg font-bold mb-2">Schedule</h3>

                {/* <p className="mb-4">{ changeTimeFormat(workout.time) } on {formatDaysArray(workout.days)} </p> */}

                <h3 className="text-indigo-800 text-lg font-bold mb-2">Location</h3>
                {/* <b className="mb-4">{ workout.location.place } </b>
                <address 
                    className="mb-4">
                        { workout.location.address }<br/>
                        {`${workout.location.city}, ${workout.location.region}`}<br/>
                        { workout.location.zipcode }
                </address> */}

                <h3 className="text-indigo-800 text-lg font-bold mb-2">Payment Options</h3>
                {/* <ul>
                    { workout.payment_options.map( payment => {
                        return (
                            <li key={payment}>
                                {payment.charAt(0).toUpperCase() + payment.slice(1)}
                            </li>  
                        )                   
                    })}
                </ul> */}

            </div>
        </main>

        {/* <!-- Sidebar --> */}
        <aside>
            {/* <InstructorInfo workout={workout}/> */}
            {/* <Message instructorId={workout.instructor.id} workout={workout}/> */}

            {/* <!-- Manage --> */}
                {/* <Link
                    to={`/edit-class/${workout.id}`}
                    className="bg-navy hover:gray-700 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                    >Edit Class</Link>
                <button 
                    onClick={() => deleteWorkout(workout.id)}
                    className="bg-orange-dark hover:bg-dark-light text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block">
                    Delete Class
                </button> */}

        </aside>
        </div>
    </div>
    </section>
    </>
  )
}

export default WorkoutPageContent;