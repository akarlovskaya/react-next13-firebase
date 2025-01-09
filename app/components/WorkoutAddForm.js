
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
      description: defaultValues?.description || '',
      time: defaultValues?.time || '',
      daysOfTheWeek: [],
      fee: defaultValues?.fee || '',
    }, 
    // mode: 'onChange' 
  });

    console.log('defaultValues', defaultValues)

    const addWorkout = async (formData) => {

        // Merge existing data with the new form data
        const updatedData = {
          ...defaultValues, // Retain all existing keys
          ...formData,     // Overwrite with new form values
        };


      await updateDoc(postRef, {
        formData,
        updatedAt: serverTimestamp(),
      });

      reset(formData);

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

        {/* LOCATION */}
        <fieldset>
          <legend className="font-semibold uppercase mb-2 mt-10">Location</legend>
          {/* Location name*/}
          <div className="mb-4">
            <label htmlFor="place" className='block text-gray-700 font-bold mb-2'>
                Place
            </label>
              <input
                  type="text"
                  id="place"
                  className="border rounded w-full py-2 px-3 mb-2"
                  placeholder="Gym or Studio Name"
                  {...register('place',                    
                  {
                    required: { value: true, message: 'Location name is required' },
                    maxLength: { value: 70, message: 'Location name is too long' },
                    minLength: { value: 3, message: 'Location name is too short' }
                  })
                  }
              />
              {errors?.place && <p className="mb-4 text-sm text-red-600" role="alert">
                {errors.place.message}
              </p>}
          </div>
          {/* Street Address */}
          <div className="mb-4">
            <label htmlFor="streetAddress" className='block text-gray-700 font-bold mb-2'>
            Street Address
            </label>
              <input
                  type="text"
                  id="streetAddress"
                  className="border rounded w-full py-2 px-3 mb-2"
                  {...register('streetAddress',                    
                  {
                    required: { value: true, message: 'Street address is required' },
                    maxLength: { value: 70, message: 'Street address is too long' },
                    minLength: { value: 3, message: 'Street address is too short' }
                  })
                  }
              />
              {errors?.streetAddress && <p className="mb-4 text-sm text-red-600" role="alert">
                {errors.streetAddress.message}
              </p>}
          </div>

          {/* City */}
          <div className="mb-4">
            <label htmlFor="city" className='block text-gray-700 font-bold mb-2'>
            City
            </label>
              <input
                  type="text"
                  id="city"
                  className="border rounded w-full py-2 px-3 mb-2"
                  {...register('city',                    
                  {
                    required: { value: true, message: 'City is required' },
                    maxLength: { value: 70, message: 'City is too long' },
                    minLength: { value: 3, message: 'City is too short' }
                  })
                  }
              />
              {errors?.city && <p className="mb-4 text-sm text-red-600" role="alert">
                {errors.city.message}
              </p>}
          </div>
          {/* State / Province */}
          <div className="mb-4">
            <label htmlFor="region" className='block text-gray-700 font-bold mb-2'>
            State / Province
            </label>
              <input
                  type="text"
                  id="region"
                  className="border rounded w-full py-2 px-3 mb-2"
                  {...register('region',                    
                  {
                    required: { value: true, message: 'State / Province is required' },
                    maxLength: { value: 70, message: 'State / Province  is too long' }
                  })
                  }
              />
              {errors?.region && <p className="mb-4 text-sm text-red-600" role="alert">
                {errors.region.message}
              </p>}
          </div>
          {/* ZIP / Postal code */}
          <div className="mb-4">
            <label htmlFor="zipcode" className='block text-gray-700 font-bold mb-2'>
            ZIP / Postal code
            </label>
              <input
                  type="text"
                  id="zipcode"
                  className="border rounded w-full py-2 px-3 mb-2"
                  {...register('zipcode',                    
                  {
                    required: { value: true, message: 'ZIP / Postal code is required' },
                    maxLength: { value: 70, message: 'ZIP / Postal code  is too long' }
                  })
                  }
              />
              {errors?.zipcode && <p className="mb-4 text-sm text-red-600" role="alert">
                {errors.zipcode.message}
              </p>}
          </div>
        </fieldset>
        {/* END of LOCATION */}

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