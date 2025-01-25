import { useFormContext } from "react-hook-form";

function ClassLocation() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  console.log("errors", errors);
  return (
    <fieldset>
      <legend className="font-semibold uppercase mb-2 mt-10">Location</legend>
      <div className="mb-4">
        <label htmlFor="place" className="block text-gray-700 font-bold mb-2">
          Place
        </label>
        <input
          type="text"
          id="place"
          className="border rounded w-full py-2 px-3 mb-2"
          placeholder="Gym or Studio Name"
          {...register("address.place", {
            required: { value: true, message: "Location name is required" },
            maxLength: { value: 70, message: "Location name is too long" },
            minLength: { value: 3, message: "Location name is too short" },
          })}
        />
        {errors.address?.place && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {errors.address.place.message}
          </p>
        )}
      </div>
      {/* Street Address */}
      <div className="mb-4">
        <label htmlFor="street" className="block text-gray-700 font-bold mb-2">
          Street Address
        </label>
        <input
          type="text"
          id="street"
          className="border rounded w-full py-2 px-3 mb-2"
          {...register("address.street", {
            required: { value: true, message: "Street address is required" },
            maxLength: { value: 70, message: "Street address is too long" },
            minLength: { value: 3, message: "Street address is too short" },
          })}
        />
        {errors.address?.street && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {errors.address.street.message}
          </p>
        )}
      </div>

      {/* City */}
      <div className="mb-4">
        <label htmlFor="city" className="block text-gray-700 font-bold mb-2">
          City
        </label>
        <input
          type="text"
          id="city"
          className="border rounded w-full py-2 px-3 mb-2"
          {...register("address.city", {
            required: { value: true, message: "City is required" },
            maxLength: { value: 70, message: "City is too long" },
            minLength: { value: 3, message: "City is too short" },
          })}
        />
        {errors.address?.city && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {errors.address.city.message}
          </p>
        )}
      </div>
      {/* State / Province */}
      <div className="mb-4">
        <label htmlFor="region" className="block text-gray-700 font-bold mb-2">
          State / Province
        </label>
        <input
          type="text"
          id="region"
          className="border rounded w-full py-2 px-3 mb-2"
          {...register("address.region", {
            required: { value: true, message: "State / Province is required" },
            maxLength: { value: 70, message: "State / Province  is too long" },
          })}
        />
        {errors.address?.region && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {errors.address.region.message}
          </p>
        )}
      </div>
      {/* ZIP / Postal code */}
      <div className="mb-4">
        <label htmlFor="zipcode" className="block text-gray-700 font-bold mb-2">
          ZIP / Postal code
        </label>
        <input
          type="text"
          id="zipcode"
          className="border rounded w-full py-2 px-3 mb-2"
          {...register("address.zipcode", {
            required: { value: true, message: "ZIP / Postal code is required" },
            maxLength: { value: 70, message: "ZIP / Postal code  is too long" },
          })}
        />
        {errors.address?.zipcode && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {errors.address.zipcode.message}
          </p>
        )}
      </div>
    </fieldset>
  );
}

export default ClassLocation;
