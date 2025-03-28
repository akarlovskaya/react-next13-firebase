import { useFormContext } from "react-hook-form";

function DaysOfWeek() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const DAYS = [
    { name: "monday", label: "Monday" },
    { name: "tuesday", label: "Tuesday" },
    { name: "wednesday", label: "Wednesday" },
    { name: "thursday", label: "Thursday" },
    { name: "friday", label: "Friday" },
    { name: "saturday", label: "Saturday" },
    { name: "sunday", label: "Sunday" },
  ];

  return (
    <fieldset>
      <legend className="block text-sm font-semibold leading-6 text-gray-900 mb-2">
        Days of the Week*
      </legend>
      <div className="mb-4">
        {DAYS.map((day) => (
          <div key={day.name} className="relative flex gap-x-3">
            <div className="flex h-6 items-center">
              <input
                id={day.name}
                type="checkbox"
                value={day.name}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                {...register("daysOfWeek", {
                  required: "Please select at least one day.",
                  validate: (value) =>
                    (value && value.length > 0) ||
                    "At least one day must be selected.",
                })}
              />
            </div>
            <div className="text-sm leading-6">
              <label htmlFor={day.name} className="font-medium text-gray-900">
                {day.label}
              </label>
            </div>
          </div>
        ))}

        {errors.daysOfWeek && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {errors.daysOfWeek.message}
          </p>
        )}
      </div>
    </fieldset>
  );
}

export default DaysOfWeek;
