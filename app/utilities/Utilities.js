// Days of the week data
export const DAYS = [
    { name: "monday", label: "Monday" },
    { name: "tuesday", label: "Tuesday" },
    { name: "wednesday", label: "Wednesday" },
    { name: "thursday", label: "Thursday" },
    { name: "friday", label: "Friday" },
    { name: "saturday", label: "Saturday" },
    { name: "sunday", label: "Sunday" },
  ];


            {/* Checkbox DAY of WEEK */}
          {/* TODO: add validation */}
          <fieldset>
              <legend className="block text-sm font-semibold leading-6 text-gray-900 mb-2">
                Days of the Week
              </legend>
              <div className="mb-4">
                  {/* Checkboxes here */}
                  {/* {DAYS.map(day => {
                    <div key={day.name} className="flex items-center mb-2">
                      <input 
                        type="checkbox"
                        value={day.name}
                        id={day.name}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        {...register("daysList")} // Registering as part of a group
                      />
                      <label
                        htmlFor={day.name}
                        className="ml-2 text-sm text-gray-700 leading-6">
                        {day.label}
                      </label>
                    </div>
                  })} */}
              </div>
          </fieldset>