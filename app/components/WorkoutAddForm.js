import { FormProvider, useForm } from "react-hook-form";
import { serverTimestamp, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ClassInfo from "./AddClassDetailsForm/ClassInfo.js";
import ClassLocation from "./AddClassDetailsForm/ClassLocation.js";
import ClassPayments from "./AddClassDetailsForm/ClassPayments.js";
import DaysOfWeek from "./AddClassDetailsForm/DaysOfWeek.js";

function WorkoutAddForm({ postRef, defaultValues }) {
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      title: defaultValues?.title ?? "",
      shortDescription: defaultValues?.shortDescription ?? "",
      description: defaultValues?.description ?? "",
      time: defaultValues?.time ?? "",
      daysOfWeek: defaultValues?.daysOfWeek,
      fee: defaultValues?.fee ?? "",
      address: {
        place: defaultValues?.address?.place ?? "",
        street: defaultValues?.address?.street ?? "",
        city: defaultValues?.address?.city ?? "",
        region: defaultValues?.address?.region ?? "",
        zipcode: defaultValues?.address?.zipcode ?? "",
      },
      paymentOptions: defaultValues?.paymentOptions,
      published: defaultValues?.published ?? false,
    },
    // mode: 'onChange',
    // reValidateMode: 'onBlur'
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const addWorkout = async (formData) => {
    try {
      // Merge existing data with the new form data
      const updatedData = {
        ...defaultValues, // Retain all existing keys
        ...formData,
        // Handle daysOfWeek to always produce an array of strings
        daysOfWeek: Array.isArray(formData.daysOfWeek)
          ? formData.daysOfWeek.map((day) => day.name || day) // If 'day' is an object, get its 'name'
          : formData.daysOfWeek?.name || [], // Handle the case where formData.daysOfWeek might not be an array

        // Handle paymentOptions to always produce an array of strings
        paymentOptions: Array.isArray(formData.paymentOptions)
          ? formData.paymentOptions.map((payment) => payment.name || payment) // If 'payment' is an object, get its 'name'
          : formData.paymentOptions?.name || [],
      };

      await updateDoc(postRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });

      reset(formData);

      toast.success("Workout updated successfully!");
      router.push(`/${defaultValues.username}/${defaultValues.slug}`);
    } catch (error) {
      console.error("Full error:", error);
      // specific messages in the error
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
    }
  };

  const onError = async (err) => {
    console.log("validation errors", err);
  };

  const cancel = () => {
    router.push("/admin");
  };

  return (
    <form noValidate onSubmit={handleSubmit(addWorkout, onError)}>
      <FormProvider {...methods}>
        <ClassInfo />
        <DaysOfWeek />
        <ClassLocation />
        <ClassPayments />

        <fieldset>
          <legend className="font-semibold uppercase mb-2 mt-8">
            Published Status
          </legend>
          <div className="relative flex gap-x-3">
            <div className="flex h-6 items-center">
              <input
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                name="published"
                type="checkbox"
                {...register("published")}
              />
            </div>
            <div className="text-sm leading-6">
              <label>Published</label>
            </div>
          </div>
          {/* {errors?.published && (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {errors.published.message}
            </p>
          )} */}
        </fieldset>
      </FormProvider>

      <div className="flex flex-row justify-between mt-10">
        <button
          type="button"
          className="w-40 bg-orange-dark text-white px-7 py-3 mb-7 text-sm font-medium rounded shadow-md focus:outline-none focus:shadow-outline hover:bg-orange-light"
          onClick={cancel}
        >
          Cancel
        </button>

        <button
          className="flex items-center justify-center w-40 bg-navy text-white px-7 py-3 mb-7 text-sm font-medium rounded shadow-md focus:outline-none focus:shadow-outline hover:bg-gray-900"
          type="submit"
          disabled={isSubmitting}
        >
          {!isSubmitting || (
            <span role="status">
              <svg
                aria-hidden="true"
                className="w-5 h-5 mr-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </span>
          )}
          <span className="text-center">
            {isSubmitting ? "Adding..." : "Add Class"}
          </span>
        </button>

        {/* <Link
          className="w-40 block bg-navy text-white px-7 py-3 mb-7 text-sm font-medium text-center rounded shadow-md focus:outline-none focus:shadow-outline hover:bg-gray-900"
          href={`/${post.username}/${post.slug}`}
        >
          <button className="">Live view</button>
        </Link> */}
      </div>
    </form>
  );
}

export default WorkoutAddForm;

// schema
// title: string, required
// shortDescription: string, required
// description: string
// time: time, required
// daysOfWeek: checkbox, required
// fee: number, required
// address: {
//   place: string, required
//   street: string, required
//   city: string, required
//   region: string, required
//   zipcode: string, required
// },
// paymentOptions: checkbox
// published: checkbox
