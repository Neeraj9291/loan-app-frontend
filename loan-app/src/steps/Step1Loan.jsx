import { useForm } from "react-hook-form";

const LOAN_CONFIG = {
  personal: {
    min: 50000, max: 1000000, label: "Personal Loan",
    tenures: [12, 24, 36, 48, 60],
    purposes: ["Medical Emergency", "Education", "Travel", "Wedding", "Home Renovation", "Other"]
  },
  home: {
    min: 500000, max: 10000000, label: "Home Loan",
    tenures: [60, 84, 120, 180, 240, 300, 360],
    purposes: ["Purchase", "Construction", "Renovation", "Extension"]
  },
  business: {
    min: 100000, max: 5000000, label: "Business Loan",
    tenures: [12, 24, 36, 48, 60, 84, 120],
    purposes: ["Business Expansion", "Equipment Purchase", "Working Capital", "Inventory", "Other"]
  },
};

const RATES = { personal: 10.5, home: 8.5, business: 14.0 };

export default function Step1Loan({ next, defaultValues }) {
  const { register, handleSubmit, watch, formState: { errors, isValid } } =
    useForm({ mode: "onTouched", defaultValues });

  const loanType = watch("loanType");
  const amount   = watch("amount");
  const config   = LOAN_CONFIG[loanType] || {};

  const onSubmit = (data) => {
    const amt = Number(data.amount);
    data.coApplicantRequired =
      (data.loanType === "personal" && amt > 500000) ||
      data.loanType === "home" ||
      (data.loanType === "business" && amt > 2000000);
    data.interestRate = RATES[data.loanType];
    next(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="text-xl font-bold mb-4">Step 1: Loan Details</h2>

      {/* Loan Type */}
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">
          Loan Type <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          {Object.entries(LOAN_CONFIG).map(([val, item]) => (
            <label key={val} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={val}
                {...register("loanType", { required: "Select loan type" })}
                className="w-4 h-4"
              />
              <span className="text-sm">{item.label}</span>
            </label>
          ))}
        </div>
        {errors.loanType && (
          <p role="alert" className="text-red-500 text-sm mt-1">{errors.loanType.message}</p>
        )}
      </div>

      {/* Loan Amount */}
      <div className="mb-3">
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          Loan Amount (₹) <span className="text-red-500">*</span>
        </label>
        <input
          id="amount"
          type="number"
          placeholder={
            loanType
              ? `₹${config.min?.toLocaleString("en-IN")} – ₹${config.max?.toLocaleString("en-IN")}`
              : "Select loan type first"
          }
          {...register("amount", {
            required: "Amount is required",
            valueAsNumber: true,
            min: {
              value: config.min || 50000,
              message: `Minimum ₹${(config.min || 50000).toLocaleString("en-IN")}`
            },
            max: {
              value: config.max || 10000000,
              message: `Maximum ₹${(config.max || 10000000).toLocaleString("en-IN")}`
            },
          })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          autoComplete="off"
          disabled={!loanType}
        />
        {errors.amount && (
          <p role="alert" className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
        )}
      </div>

      {/* Tenure */}
      <div className="mb-3">
        <label htmlFor="tenure" className="block text-sm font-medium mb-1">
          Loan Tenure <span className="text-red-500">*</span>
        </label>
        <select
          id="tenure"
          {...register("tenure", { required: "Select tenure" })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={!loanType}
        >
          <option value="">Select Tenure</option>
          {(config.tenures || []).map((t) => (
            <option key={t} value={t}>
              {t} months ({Math.floor(t / 12)} yr{t % 12 ? ` ${t % 12} mo` : ""})
            </option>
          ))}
        </select>
        {errors.tenure && (
          <p role="alert" className="text-red-500 text-sm mt-1">{errors.tenure.message}</p>
        )}
      </div>

      {/* Purpose */}
      <div className="mb-3">
        <label htmlFor="purpose" className="block text-sm font-medium mb-1">
          Loan Purpose <span className="text-red-500">*</span>
        </label>
        <select
          id="purpose"
          {...register("purpose", { required: "Select purpose" })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={!loanType}
        >
          <option value="">Select Purpose</option>
          {(config.purposes || []).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.purpose && (
          <p role="alert" className="text-red-500 text-sm mt-1">{errors.purpose.message}</p>
        )}
      </div>

      {/* Referral Code */}
      <div className="mb-3">
        <label htmlFor="referralCode" className="block text-sm font-medium mb-1">
          Referral Code (Optional)
        </label>
        <input
          id="referralCode"
          placeholder="6-10 alphanumeric characters"
          {...register("referralCode", {
            pattern: {
              value: /^[A-Za-z0-9]{6,10}$/,
              message: "Must be 6-10 alphanumeric characters"
            }
          })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.referralCode && (
          <p role="alert" className="text-red-500 text-sm mt-1">{errors.referralCode.message}</p>
        )}
      </div>

      {/* Co-applicant hint */}
      {loanType && amount && (
        <div className="text-sm text-blue-700 mb-3 p-2 bg-blue-50 rounded border border-blue-200">
          {loanType === "personal" && amount > 500000 && (
           <p>⚠️ Co-applicant required (amount above ₹5,00,000)</p>

          )}
          {loanType === "home" && (
            <p>⚠️ Co-applicant mandatory for Home Loan</p>
          )}
          {loanType === "business" && amount > 2000000 && (
             <p>⚠️ Co-applicant required (amount above ₹20,00,000)</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid}
        className="bg-blue-600 text-white w-full py-2 rounded mt-2 disabled:bg-gray-400 hover:bg-blue-700 font-medium"
      >
        Next →
      </button>
    </form>
  );
}
