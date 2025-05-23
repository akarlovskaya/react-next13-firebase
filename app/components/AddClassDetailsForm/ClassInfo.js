import { useFormContext } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";

const ClassInfo = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const [preview, setPreview] = useState(false);
  const [infoPopup, setInfoPopup] = useState(false);

  return (
    <fieldset>
      <legend className="font-semibold uppercase mb-2 mt-8">
        Class Information
      </legend>
      {/* Name of class*/}
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-semibold leading-6 text-gray-900 mb-2"
        >
          Name*
        </label>
        <input
          type="text"
          id="title"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="E.g. Cardio Dance"
          {...register("title", {
            required: { value: true, message: "Class name is required" },
            maxLength: { value: 70, message: "Class name is too long" },
            minLength: { value: 3, message: "Class name is too short" },
          })}
        />
        {errors?.title && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {errors.title.message}
          </p>
        )}
      </div>
      {/* Short Description */}
      <div className="mb-4">
        <div className="flex items-center">
          <label
            htmlFor="shortDescription"
            className="text-sm font-semibold leading-6 text-gray-900 mb-2"
          >
            Short Description*
          </label>
        </div>

        <textarea
          id="shortDescription"
          className="border rounded w-full py-2 px-3 resize"
          rows="3"
          placeholder="Short description visible as a preview (max 250 characters)."
          {...register("shortDescription", {
            required: { value: true, message: "Short Description is required" },
            maxLength: { value: 250, message: "Short Description is too long" },
            minLength: { value: 50, message: "Short Description is too short" },
          })}
        ></textarea>
        {errors?.shortDescription && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {errors.shortDescription.message}
          </p>
        )}
      </div>

      {/* Description */}

      {preview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-auto">
            <h2 className="text-lg font-bold mb-2">Description Preview</h2>
            <div className="markdown-editor border p-4">
              <ReactMarkdown>{watch("description")}</ReactMarkdown>
            </div>
            <button
              onClick={() => setPreview(false)}
              className="mt-4 px-4 py-2 bg-slate-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {infoPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-auto">
            <button type="button" onClick={() => setInfoPopup(false)}>
              <IoIosCloseCircleOutline />
            </button>
            <div>
              How to format text in the Description section:
              <ul>
                <li>
                  <strong>Italic text:</strong> Use <code>*text*</code> to
                  format text as <i>italic</i>.
                </li>
                <li>
                  <strong>Bold text:</strong> Use <code>**text**</code> to
                  format text as <strong>bold</strong>.
                </li>
                <li>
                  <strong>Unordered list:</strong> Use <code>-</code> or{" "}
                  <code>*</code> for bullet points. Example:
                  <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                    <li>Item 3</li>
                  </ul>
                </li>
                <li>
                  <strong>Ordered list:</strong> Use numbers followed by a
                  period for a numbered list. Example:
                  <ol>
                    <li>1. Item</li>
                    <li>2. Item</li>
                    <li>3. Item</li>
                  </ol>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center">
          <label
            htmlFor="description"
            className="text-sm font-semibold leading-6 text-gray-900 mb-2"
          >
            Class Details
          </label>
          <button
            type="button"
            className="ml-1 mb-4"
            onClick={() => setInfoPopup(!infoPopup)}
          >
            <IoIosInformationCircleOutline />
          </button>
        </div>

        <textarea
          id="description"
          className="h-80 border rounded w-full py-2 px-3 resize"
          rows="5"
          placeholder="Tell what to expect from your classes - e.g. goal of the class, duration, what participants should bring and wear, if any equipment will be used in your class. Note: Make your first sentence as informative and catchy as possible, as only the first 130 characters will be visible on the Home Page. The full description will be visible on the Class Details page."
          {...register("description", {
            // required: { value: true, message: "Description is required" },
            maxLength: { value: 20000, message: "Description is too long" },
            minLength: { value: 10, message: "Description is too short" },
          })}
        ></textarea>
        {errors?.description && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>
      <button
        type="button"
        className="w-40 bg-slate-600 text-white px-7 py-3 mb-7 text-sm font-medium rounded shadow-md focus:outline-none focus:shadow-outline hover:bg-gray-900"
        onClick={() => setPreview(!preview)}
      >
        {preview ? "Edit" : "Preview Details"}
      </button>

      {/* Fee */}
      <div className="mb-4">
        <label
          htmlFor="fee"
          className="block text-sm font-semibold leading-6 text-gray-900 mb-2"
        >
          Fee*
        </label>
        <input
          type="number"
          min={0}
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="Price per class, taxes not included"
          {...register("fee", {
            required: { value: true, message: "Class fee is required" },
            pattern: {
              value: /^[0-9]+(\.[0-9]{1,2})?$/,
              message:
                'Invalid fee format. Please enter a non-negative price with up to 2 decimal places (e.g., "10", "10.5", or "10.50"). Do not include currency symbols or commas.',
            },
          })}
        />
        {errors?.fee && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {errors.fee.message}
          </p>
        )}
      </div>
      {/* Time */}
      <div className="mb-4">
        <label
          htmlFor="time"
          className="block text-sm font-semibold leading-6 text-gray-900 mb-2"
        >
          Time*
        </label>
        <input
          type="time"
          id="time"
          className="border rounded w-full py-2 px-3 mb-2"
          {...register("time", {
            required: { value: true, message: "Time is required" },
            validate: {
              validTimeFormat: (value) =>
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) ||
                "Invalid time format",
              allowedTimeRange: (value) => {
                const timeDate = new Date(`1970-01-01T${value}`);
                const lowerLimit = new Date("1970-01-01T04:00");
                const upperLimit = new Date("1970-01-01T23:00");

                return (
                  (timeDate >= lowerLimit && timeDate < upperLimit) ||
                  "Time must be between 4:00 AM and 11:00 PM"
                );
              },
            },
          })}
        />
        {errors?.time && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {errors.time.message}
          </p>
        )}
      </div>
    </fieldset>
  );
};

export default ClassInfo;
