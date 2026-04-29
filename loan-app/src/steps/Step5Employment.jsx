import { useForm } from "react-hook-form";

export default function Step5Employment({ next, back, defaultValues, loanType }) {
  const { register, handleSubmit, watch, formState: { errors, isValid } } =
    useForm({ mode: "onTouched", defaultValues });

  const empType = watch("employmentType");

  const onSubmit = (data) => next(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-bold mb-4">Step 5: Employment & Income</h2>

      <label className="block text-sm font-medium mb-1">Employment Type *</label>
      <div className="flex gap-4 mb-3">
        {["Salaried", "Self-Employed", "Business Owner"].map((type) => {
          const disabled = loanType === "business" && type === "Salaried";
          return (
            <label key={type} className={`flex items-center gap-1 text-sm ${disabled ? "opacity-40" : ""}`}>
              <input type="radio" value={type}
                {...register("employmentType", { required: "Select employment type" })}
                disabled={disabled} />
              {type}
            </label>
          );
        })}
      </div>
      {errors.employmentType && <p className="text-red-500 text-sm mb-2">{errors.employmentType.message}</p>}

      {/* SALARIED */}
      {empType === "Salaried" && (
        <div className="border rounded p-3 mb-3 bg-gray-50">
          <p className="font-medium text-sm mb-2 text-blue-700">Salaried Details</p>

          <label className="block text-sm font-medium mb-1">Company Name *</label>
          <input placeholder="Company Name"
            {...register("companyName", { required: "Company name required" })}
            className="w-full p-2 border rounded mb-1" />
          {errors.companyName && <p className="text-red-500 text-sm mb-2">{errors.companyName.message}</p>}

          <label className="block text-sm font-medium mb-1">Designation *</label>
          <input placeholder="Designation"
            {...register("designation", { required: "Designation required" })}
            className="w-full p-2 border rounded mb-1" />
          {errors.designation && <p className="text-red-500 text-sm mb-2">{errors.designation.message}</p>}

          <label className="block text-sm font-medium mb-1">Monthly Net Salary (₹) *</label>
          <input type="number" placeholder="Min ₹15,000"
            {...register("monthlyIncome", {
              required: "Salary required",
              min: { value: 15000, message: "Min ₹15,000" }
            })}
            className="w-full p-2 border rounded mb-1" />
          {errors.monthlyIncome && <p className="text-red-500 text-sm mb-2">{errors.monthlyIncome.message}</p>}
        </div>
      )}

      {/* SELF-EMPLOYED */}
      {empType === "Self-Employed" && (
        <div className="border rounded p-3 mb-3 bg-gray-50">
          <p className="font-medium text-sm mb-2 text-blue-700">Self-Employed Details</p>

          <label className="block text-sm font-medium mb-1">Profession *</label>
          <input placeholder="e.g. Doctor, Consultant"
            {...register("profession", { required: "Profession required" })}
            className="w-full p-2 border rounded mb-1" />
          {errors.profession && <p className="text-red-500 text-sm mb-2">{errors.profession.message}</p>}

          <label className="block text-sm font-medium mb-1">Annual Income (₹) *</label>
          <input type="number" placeholder="Annual Income"
            {...register("monthlyIncome", {
              required: "Income required",
              min: { value: 100000, message: "Min ₹1,00,000 annual" }
            })}
            className="w-full p-2 border rounded mb-1" />
          {errors.monthlyIncome && <p className="text-red-500 text-sm mb-2">{errors.monthlyIncome.message}</p>}
        </div>
      )}

      {/* BUSINESS OWNER */}
      {empType === "Business Owner" && (
        <div className="border rounded p-3 mb-3 bg-gray-50">
          <p className="font-medium text-sm mb-2 text-blue-700">Business Details</p>

          <label className="block text-sm font-medium mb-1">Business Name *</label>
          <input placeholder="Business Name"
            {...register("businessName", { required: "Business name required" })}
            className="w-full p-2 border rounded mb-1" />
          {errors.businessName && <p className="text-red-500 text-sm mb-2">{errors.businessName.message}</p>}

          <label className="block text-sm font-medium mb-1">GST Number</label>
          <input placeholder="15-character GST number"
            {...register("gstNumber", {
              pattern: { value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: "Invalid GST format" }
            })}
            className="w-full p-2 border rounded mb-1" />
          {errors.gstNumber && <p className="text-red-500 text-sm mb-2">{errors.gstNumber.message}</p>}

          <label className="block text-sm font-medium mb-1">Annual Business Income (₹) *</label>
          <input type="number" placeholder="Annual Income"
            {...register("monthlyIncome", {
              required: "Income required",
              min: { value: 200000, message: "Min ₹2,00,000" }
            })}
            className="w-full p-2 border rounded mb-1" />
          {errors.monthlyIncome && <p className="text-red-500 text-sm mb-2">{errors.monthlyIncome.message}</p>}
        </div>
      )}

      <label className="block text-sm font-medium mb-1">Years of Experience *</label>
      <input type="number" placeholder="Years"
        {...register("experience", {
          required: "Required",
          min: { value: 0, message: "Min 0" },
          max: { value: 50, message: "Max 50" }
        })}
        className="w-full p-2 border rounded mb-1" />
      {errors.experience && <p className="text-red-500 text-sm mb-2">{errors.experience.message}</p>}

      <div className="flex justify-between mt-4">
        <button type="button" onClick={back} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">← Back</button>
        <button type="submit" disabled={!isValid || !empType}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-blue-700">Next →</button>
      </div>
    </form>
  );
}
