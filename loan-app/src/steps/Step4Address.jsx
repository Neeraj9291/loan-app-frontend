import React, { useState } from "react";
import { useForm } from "react-hook-form";

// Sample PIN data - 20 major cities
const PIN_DATA = {
  "110001": { city: "New Delhi",     state: "Delhi",             po: "Connaught Place" },
  "110011": { city: "New Delhi",     state: "Delhi",             po: "Lodhi Road" },
  "400001": { city: "Mumbai",        state: "Maharashtra",       po: "Mumbai GPO" },
  "400051": { city: "Mumbai",        state: "Maharashtra",       po: "Bandra" },
  "560001": { city: "Bengaluru",     state: "Karnataka",         po: "Bengaluru GPO" },
  "600001": { city: "Chennai",       state: "Tamil Nadu",        po: "Chennai GPO" },
  "700001": { city: "Kolkata",       state: "West Bengal",       po: "Kolkata GPO" },
  "500001": { city: "Hyderabad",     state: "Telangana",         po: "Hyderabad GPO" },
  "380001": { city: "Ahmedabad",     state: "Gujarat",           po: "Ahmedabad GPO" },
  "411001": { city: "Pune",          state: "Maharashtra",       po: "Pune City" },
  "302001": { city: "Jaipur",        state: "Rajasthan",         po: "Jaipur GPO" },
  "226001": { city: "Lucknow",       state: "Uttar Pradesh",     po: "Lucknow GPO" },
  "800001": { city: "Patna",         state: "Bihar",             po: "Patna GPO" },
  "751001": { city: "Bhubaneswar",   state: "Odisha",            po: "Bhubaneswar GPO" },
  "682001": { city: "Kochi",         state: "Kerala",            po: "Ernakulam GPO" },
  "160017": { city: "Chandigarh",    state: "Chandigarh",        po: "Sector 17" },
  "248001": { city: "Dehradun",      state: "Uttarakhand",       po: "Dehradun GPO" },
  "781001": { city: "Guwahati",      state: "Assam",             po: "Guwahati GPO" },
  "440001": { city: "Nagpur",        state: "Maharashtra",       po: "Nagpur GPO" },
  "201301": { city: "Noida",         state: "Uttar Pradesh",     po: "Noida Sector 18" },
};

export default function Step4Address({ next, back, defaultValues }) {
  const { register, handleSubmit, watch, setValue,
    formState: { errors, touchedFields } } =
    useForm({ mode: "onTouched", reValidateMode: "onChange", defaultValues });

  const sameAddress   = watch("sameAddress");
  const residenceType = watch("residenceType");
  const yearsAtAddr   = watch("yearsAtAddress");
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError,   setPinError]   = useState("");

  const lookupPin = (pin) => {
    if (pin.length !== 6) return;
    setPinLoading(true);
    setPinError("");
    setTimeout(() => {
      const data = PIN_DATA[pin];
      if (data) {
        setValue("city",  data.city,  { shouldValidate: true });
        setValue("state", data.state, { shouldValidate: true });
        setValue("postOffice", data.po);
      } else {
        setPinError("PIN code not found. Please enter city and state manually.");
        setValue("city",  "");
        setValue("state", "");
      }
      setPinLoading(false);
    }, 800);
  };

  const onSubmit = (data) => next(data);

  const inputClass = (err) =>
    `w-full p-2 border rounded focus:ring-2 focus:outline-none ${err ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="text-xl font-bold mb-4">Step 4: Address Details</h2>

      {/* Address Line 1 */}
      <div className="mb-3">
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Current Address Line 1 <span className="text-red-500">*</span>
        </label>
        <input id="address" type="text" placeholder="House/Flat No, Street Name"
          {...register("address", {
            required: "Address is required",
            minLength: { value: 5,   message: "Minimum 5 characters" },
            maxLength: { value: 200, message: "Maximum 200 characters" }
          })}
          className={inputClass(errors.address)}
          autoComplete="address-line1"
        />
        {errors.address && touchedFields.address && (
          <p role="alert" className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div className="mb-3">
        <label htmlFor="address2" className="block text-sm font-medium mb-1">
          Current Address Line 2 (Optional)
        </label>
        <input id="address2" type="text" placeholder="Area, Landmark"
          {...register("address2")}
          className={inputClass(false)}
          autoComplete="address-line2"
        />
      </div>

      {/* PIN Code */}
      <div className="mb-3">
        <label htmlFor="pincode" className="block text-sm font-medium mb-1">
          PIN Code <span className="text-red-500">*</span>
        </label>
        <input id="pincode" type="text" placeholder="6 digit PIN code"
          {...register("pincode", {
            required: "PIN code is required",
            pattern: { value: /^[0-9]{6}$/, message: "PIN must be exactly 6 digits" },
          })}
          onChange={(e) => { lookupPin(e.target.value); }}
          className={inputClass(errors.pincode)}
          maxLength={6}
          autoComplete="postal-code"
        />
        {pinLoading && <p className="text-blue-500 text-xs mt-1">🔍 Looking up PIN code...</p>}
        {pinError   && <p className="text-amber-600 text-xs mt-1">⚠️ {pinError}</p>}
        {errors.pincode && touchedFields.pincode && (
          <p role="alert" className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>
        )}
      </div>

      {/* City + State */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input id="city" type="text" placeholder="City"
            {...register("city", { required: "City is required" })}
            className={inputClass(errors.city)}
            autoComplete="address-level2"
          />
          {errors.city && <p role="alert" className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input id="state" type="text" placeholder="State"
            {...register("state", { required: "State is required" })}
            className={inputClass(errors.state)}
            autoComplete="address-level1"
          />
          {errors.state && <p role="alert" className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
        </div>
      </div>

      {/* Residence Type */}
      <div className="mb-3">
        <label htmlFor="residenceType" className="block text-sm font-medium mb-1">
          Residence Type <span className="text-red-500">*</span>
        </label>
        <select id="residenceType"
          {...register("residenceType", { required: "Select residence type" })}
          className={inputClass(errors.residenceType)}
        >
          <option value="">Select Type</option>
          <option value="Owned">Owned</option>
          <option value="Rented">Rented</option>
          <option value="Company Provided">Company Provided</option>
          <option value="Family Owned">Family Owned</option>
        </select>
        {errors.residenceType && (
          <p role="alert" className="text-red-500 text-sm mt-1">{errors.residenceType.message}</p>
        )}
      </div>

      {/* Rent Amount - only if Rented */}
      {residenceType === "Rented" && (
        <div className="mb-3">
          <label htmlFor="rentAmount" className="block text-sm font-medium mb-1">
            Monthly Rent Amount (₹) <span className="text-red-500">*</span>
          </label>
          <input id="rentAmount" type="number" placeholder="Monthly rent"
            {...register("rentAmount", {
              required: "Rent amount is required",
              min: { value: 1000, message: "Min ₹1,000" }
            })}
            className={inputClass(errors.rentAmount)}
          />
          {errors.rentAmount && (
            <p role="alert" className="text-red-500 text-sm mt-1">{errors.rentAmount.message}</p>
          )}
        </div>
      )}

      {/* Years at Address */}
      <div className="mb-3">
        <label htmlFor="yearsAtAddress" className="block text-sm font-medium mb-1">
          Years at Current Address <span className="text-red-500">*</span>
        </label>
        <input id="yearsAtAddress" type="number" placeholder="0-50"
          {...register("yearsAtAddress", {
            required: "Required",
            min: { value: 0,  message: "Min 0 years" },
            max: { value: 50, message: "Max 50 years" }
          })}
          className={inputClass(errors.yearsAtAddress)}
        />
        {errors.yearsAtAddress && (
          <p role="alert" className="text-red-500 text-sm mt-1">{errors.yearsAtAddress.message}</p>
        )}
      </div>

      {/* Previous Address - if < 1 year */}
      {yearsAtAddr !== undefined && Number(yearsAtAddr) < 1 && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded">
          <p className="text-sm font-medium text-amber-700 mb-2">
            ⚠️ Less than 1 year - Previous Address Required
          </p>
          <label htmlFor="previousAddress" className="block text-sm font-medium mb-1">
            Previous Address <span className="text-red-500">*</span>
          </label>
          <input id="previousAddress" type="text" placeholder="Previous address"
            {...register("previousAddress", { required: "Previous address required" })}
            className={inputClass(errors.previousAddress)}
          />
          {errors.previousAddress && (
            <p role="alert" className="text-red-500 text-sm mt-1">{errors.previousAddress.message}</p>
          )}
        </div>
      )}

      {/* Same as Permanent */}
      <div className="flex items-center gap-2 mb-3">
        <input type="checkbox" id="sameAddress" {...register("sameAddress")} className="w-4 h-4" />
        <label htmlFor="sameAddress" className="text-sm cursor-pointer">
          Permanent address same as current address
        </label>
      </div>

      {/* Permanent Address */}
      {!sameAddress && (
        <div className="mb-3 p-3 bg-gray-50 border rounded">
          <p className="text-sm font-medium mb-2">Permanent Address</p>
          <input type="text" placeholder="Permanent address"
            {...register("permanentAddress", { required: "Permanent address is required" })}
            className={`${inputClass(errors.permanentAddress)} mb-1`}
          />
          {errors.permanentAddress && touchedFields.permanentAddress && (
            <p role="alert" className="text-red-500 text-sm mt-1">{errors.permanentAddress.message}</p>
          )}
          <input type="text" placeholder="PIN Code"
            {...register("permanentPincode", {
              required: "PIN required",
              pattern: { value: /^[0-9]{6}$/, message: "6 digits required" }
            })}
            className={`${inputClass(errors.permanentPincode)} mt-2`}
            maxLength={6}
          />
          {errors.permanentPincode && (
            <p role="alert" className="text-red-500 text-sm mt-1">{errors.permanentPincode.message}</p>
          )}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button type="button" onClick={back}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">← Back</button>
        <button type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Next →</button>
      </div>
    </form>
  );
}
