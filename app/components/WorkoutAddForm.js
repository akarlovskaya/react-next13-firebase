
import { useForm } from 'react-hook-form';
import { serverTimestamp, doc, deleteDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import toast from 'react-hot-toast';
import { DAYS, PAYMENT_OPTIONS } from '../utilities/Utilities.js';
import { useRouter } from 'next/navigation';

function WorkoutAddForm({ postRef, defaultValues, preview }) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({ 
    defaultValues: {
      title: defaultValues?.title || '',
      // description: defaultValues?.data.description || '',
      // time: defaultValues?.data.time || '',
      // fee: defaultValues?.data.fee || '',
    }, 
    mode: 'onChange' });

    console.log('defaultValues', defaultValues)

    const addWorkout = async (data) => {
      await updateDoc(postRef, {
        data,
        updatedAt: serverTimestamp(),
      });

      reset(data);

      toast.success('Workout added successfully!');
      router.push(`/${defaultValues.username}/${defaultValues.slug}`);

    }

  // const { isValid, isDirty } = formState;
  // const { title } = defaultValues;

  // const selectedDays = watch("daysList", []); // Default to an empty array
  // console.log('useForm', useForm());

  return (
    <form noValidate onSubmit={handleSubmit(addWorkout)}>
      <fieldset>
        <legend className="font-semibold uppercase mb-2 mt-8">Class Information</legend>
          {/* Name of class*/}
          <div className="mb-4">
              <label 
              htmlFor="title" 
              className="block text-sm font-semibold leading-6 text-gray-900 mb-2">Name</label>
              <input
                  type="text"
                  id="title"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="E.g. Cardio Dance"
                  {...register('title',                    
                  {
                    required: { value: true, message: 'Class name is required' },
                    maxLength: { value: 70, message: 'Class name is too long' },
                    minLength: { value: 3, message: 'Class name is too short' }
                  })
                  }
              />
              {errors?.title && <p className="mb-4 text-sm text-red-600" role="alert">
                {errors.title.message}
              </p>}
          </div>
          {/* Description */}
          <div className="mb-4">
              <label
                  htmlFor="description"
                  className="block text-sm font-semibold leading-6 text-gray-900 mb-2">Description</label>
                <textarea
                  id="description"
                  className="border rounded w-full py-2 px-3"
                  rows="5"
                  placeholder="Tell what to expect from your classes - e.g. goal of the class, duration, what participants should bring and wear, if any eguipment will be used in your class. Note: Make your first sentence as informative and catchy as possible, as only the first 130 characters will be visible on the Home Page. The full description will be visible on the Class Details page."
                  {...register('description', 
                  {
                   required: { value: true, message: 'Description is required' },
                    maxLength: { value: 20000, message: 'Description is too long' },
                    minLength: { value: 10, message: 'Description is too short' }
                  }
                  )}
                >
              </textarea>
              {errors?.description && <p className="mb-4 text-sm text-red-600" role="alert">
                {errors.description.message}
              </p>}
          </div>
          {/* Time */}
          <div className="mb-4">
              <label 
                  htmlFor="time" 
                  className="block text-sm font-semibold leading-6 text-gray-900 mb-2">Time</label>
              <input
                  type="time"
                  id="time"
                  className="border rounded w-full py-2 px-3 mb-2"
                  {...register('time', {
                    required: { value: true, message: 'Time is required' },
                    validate: {
                      validTime: (value) => !!value || 'Invalid time format',
                      notTooLate: (value) => 
                        new Date(`1970-01-01T${value}`) < new Date('1970-01-01T23:00') || 
                        'Time must be before 11:00 PM',
                    },
                  })}
              />
              {errors?.time && <p className="mb-4 text-sm text-red-600" role="alert">
                {errors.time.message}
              </p>}
          </div>


          {/* Fee */}
          <div className="mb-4">
              <label
                  htmlFor="fee"
                  className="block text-sm font-semibold leading-6 text-gray-900 mb-2">Fee</label>
              <input
                  type="number"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="Price per class"
                  {...register('fee',                     {
                    required: { value: true, message: 'Class fee is required' }
                  })
                  }
              />
              {errors?.fee && <p className="mb-4 text-sm text-red-600" role="alert">
                {errors.fee.message}
              </p>}
          </div>
        </fieldset> 
        {/* END of CLASS INFORMATION */}

        <div>
            <button
                className="bg-navy hover:bg-navy-light text-white py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                type="submit">
                Add Class
            </button>
            </div>

    </form>
  )
}

export default WorkoutAddForm;

// schema
// name: string, required
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