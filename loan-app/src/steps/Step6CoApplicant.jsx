import { useForm } from "react-hook-form";

export default function Step6CoApplicant({ next, back, defaultValues, maritalStatus }) {
  const { register, handleSubmit, formState: { errors, isValid } } =
    useForm({ mode: "onTouched", defaultValues });

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const onSubmit = (data) => next(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-bold mb-2">Step 6: Co-Applicant Details</h2>
      <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded mb-4">
        ⚠️ Co-applicant is required based on your loan type/amount.
      </p>

      <label className="block text-sm font-medium mb-1">Co-Applicant Full Name *</label>
      <input placeholder="Full Name"
        {...register("coName", {
          required: "Name required",
          pattern: { value: /^[A-Za-z. ]+$/, message: "Only letters allowed" }
        })}
        className="w-full p-2 border rounded mb-1" />
      {errors.coName && <p className="text-red-500 text-sm mb-2">{errors.coName.message}</p>}

      <label className="block text-sm font-medium mb-1">Relationship *</label>
      <select {...register("coRelationship", { required: "Select relationship" })}
        className="w-full p-2 border rounded mb-1">
        <option value="">Select</option>
        {maritalStatus === "married" && <option value="spouse">Spouse</option>}
        <option value="parent">Parent</option>
        <option value="sibling">Sibling</option>
        <option value="business_partner">Business Partner</option>
      </select>
      {errors.coRelationship && <p className="text-red-500 text-sm mb-2">{errors.coRelationship.message}</p>}

      <label className="block text-sm font-medium mb-1">Co-Applicant PAN *</label>
      <input placeholder="ABCDE1234F"
        {...register("coPan", {
          required: "PAN required",
          pattern: { value: panRegex, message: "Invalid PAN format (e.g. ABCDE1234F)" }
        })}
        className="w-full p-2 border rounded mb-1"
        style={{ textTransform: "uppercase" }} />
      {errors.coPan && <p className="text-red-500 text-sm mb-2">{errors.coPan.message}</p>}

      <label className="block text-sm font-medium mb-1">Co-Applicant Monthly Income (₹) *</label>
      <input type="number" placeholder="Monthly Income"
        {...register("coIncome", {
          required: "Income required",
          min: { value: 10000, message: "Min ₹10,000" }
        })}
        className="w-full p-2 border rounded mb-1" />
      {errors.coIncome && <p className="text-red-500 text-sm mb-2">{errors.coIncome.message}</p>}

      <label className="flex items-center gap-2 mt-2 mb-1">
        <input type="checkbox" {...register("coConsent", { required: true })} />
        <span className="text-sm">Co-applicant consents to this loan application and credit check *</span>
      </label>
      {errors.coConsent && <p className="text-red-500 text-sm mb-2">Co-applicant consent is required</p>}

      <div className="flex justify-between mt-4">
        <button type="button" onClick={back} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">← Back</button>
        <button type="submit" disabled={!isValid}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-700">Next →</button>
      </div>
    </form>
  );
}
