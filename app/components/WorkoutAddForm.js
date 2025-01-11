
import { FormProvider, useForm, useFormContext  } from 'react-hook-form';
import { serverTimestamp, doc, deleteDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast';
import { DAYS, PAYMENT_OPTIONS } from '../utilities/Utilities.js';
import { useRouter } from 'next/navigation';

import ClassInfo from './AddClassDetailsForm/ClassInfo.js';
import ClassLocation from './AddClassDetailsForm/ClassLocation.js';
import ClassPayments from './AddClassDetailsForm/ClassPayments.js';

function WorkoutAddForm({ postRef, defaultValues, preview }) {
  const router = useRouter();
  const methods = useForm({ 
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      time: defaultValues?.time || '',
      daysOfTheWeek: [],
      fee: defaultValues?.fee || '',
    }, 
    // mode: 'onChange' 
  });

  const { register, handleSubmit, formState: { isSubmitting }, reset, watch } = methods;

    // console.log('defaultValues', defaultValues)

    const addWorkout = async (formData) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log('formData', formData);

        // Merge existing data with the new form data
      //   const updatedData = {
      //     ...defaultValues, // Retain all existing keys
      //     ...formData,     // Overwrite with new form values
      //   };


      // await updateDoc(postRef, {
      //   formData,
      //   updatedAt: serverTimestamp(),
      // });

      // reset(formData);

      // toast.success('Workout added successfully!');
      // router.push(`/${defaultValues.username}/${defaultValues.slug}`);

    }

    const onError = async (err) => {
      console.log('validation errors', err);

    }

  // const { isValid, isDirty } = formState;
  // const { title } = defaultValues;

  // const selectedDays = watch("daysList", []); // Default to an empty array
  // console.log('useForm', useForm());

  return (
    <form noValidate onSubmit={handleSubmit(addWorkout, onError)}>
      <FormProvider {...methods}>
        <ClassInfo />
        {/* <ClassLocation /> */}
        {/* <ClassPayments /> */}
      </FormProvider>

        <div>
          <button
              className="bg-navy hover:bg-navy-light text-white py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center space-x-2"
              type="submit"
              disabled={isSubmitting}>
                {!isSubmitting || (
                  <span role="status">
                  <svg aria-hidden="true" className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
                  </span>
                )}
                <span className="pl-2">{isSubmitting ? 'Adding...' : 'Add Class'}</span>
          </button>
        </div>

    </form>
  )
}

export default WorkoutAddForm;

// schema
// title: string, required
// description: string, required
// time: time, required
// days of the week: checkbox, required
// fee: number, required
// location name: string, required
// street: string, required
// city: string, required
// state: string, required
// zip: string, required
// payment options: checkbox