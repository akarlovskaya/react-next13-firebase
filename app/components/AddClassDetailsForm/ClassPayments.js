import { useFormContext } from "react-hook-form";

const ClassPayments = () => {
  const { register } = useFormContext();

  const PAYMENT_OPTIONS = [
    {
      name: "etransfer",
      label: "E-transfer"
    },
    {
      name: "cash",
        label: "Cash"
    },
    {
        name: "card",
        label: "Credit/Debit"
    },
    {
        name: "cheque",
        label: "Cheque"
    }
  ];

  return (
    <fieldset>
      <legend className="font-semibold uppercase mb-2 mt-8">Payment Options</legend>
      <div className="mb-4">
        {
          PAYMENT_OPTIONS.map((payment) => (
            <div key={payment.name} className="relative flex gap-x-3">
              <div className="flex h-6 items-center">
                <input
                  id={payment.name}
                  type="checkbox"
                  value={payment.name}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  {...register('paymentOptions')}
                />
              </div>
              <div className="text-sm leading-6">
              <label htmlFor={payment.name} className="font-medium text-gray-900">
                {payment.label}
              </label>
              </div>
            </div>
          ))
        }

      </div>
    </fieldset>
  )
}

export default ClassPayments;
