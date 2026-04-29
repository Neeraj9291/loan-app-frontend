import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Step2Personal = ({ next, back }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm({ mode: "onTouched" });

  const mobile = watch("mobile");

  // OTP STATES
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [otpError, setOtpError] = useState("");

  const onSubmit = (data) => next(data);

  const validateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return (age >= 21 && age <= 65) || "Age must be between 21 and 65";
  };

  // SEND OTP - simulation
  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(mobile || "")) {
      setOtpError("Valid 10 digit mobile number daalo");
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setVerified(false);
    setEnteredOtp("");
    setOtpError("");
  };

  // VERIFY OTP
  const verifyOtp = () => {
    if (enteredOtp === generatedOtp) {
      setVerified(true);
      setOtpError("");
    } else {
      setOtpError("Invalid OTP ❌ Try again");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-bold mb-4">Personal Information</h2>

      {/* Full Name */}
      <input
        placeholder="Full Name"
        {...register("name", {
          required: "Name is required",
          minLength: { value: 2, message: "Minimum 2 characters" },
          pattern: { value: /^[A-Za-z. ]+$/, message: "Only letters allowed" }
        })}
        className="w-full p-2 border rounded mb-1"
      />
      {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>}

      {/* DOB */}
      <input
        type="date"
        {...register("dob", { required: "DOB required", validate: validateAge })}
        className="w-full p-2 border rounded mb-1"
      />
      {errors.dob && <p className="text-red-500 text-sm mb-2">{errors.dob.message}</p>}

      {/* Gender */}
      <div className="mb-2">
        <label><input type="radio" value="male"   {...register("gender", { required: true })} /> Male</label>
        <label className="ml-3"><input type="radio" value="female" {...register("gender", { required: true })} /> Female</label>
        <label className="ml-3"><input type="radio" value="other"  {...register("gender", { required: true })} /> Other</label>
      </div>

      {/* Marital Status */}
      <select {...register("maritalStatus", { required: true })} className="w-full p-2 border rounded mb-2">
        <option value="">Select Marital Status</option>
        <option value="single">Single</option>
        <option value="married">Married</option>
      </select>

      {/* Father */}
      <input
        placeholder="Father Name"
        {...register("fatherName", { required: "Required" })}
        className="w-full p-2 border rounded mb-1"
      />
      {errors.fatherName && <p className="text-red-500 text-sm mb-2">{errors.fatherName.message}</p>}

      {/* Mother */}
      <input
        placeholder="Mother Name"
        {...register("motherName", { required: "Required" })}
        className="w-full p-2 border rounded mb-1"
      />
      {errors.motherName && <p className="text-red-500 text-sm mb-2">{errors.motherName.message}</p>}

      {/* Email */}
      <input
        placeholder="Email"
        {...register("email", {
          required: "Email required",
          pattern: { value: /^\S+@\S+$/, message: "Invalid email" }
        })}
        onChange={(e) => setValue("email", e.target.value.toLowerCase())}
        className="w-full p-2 border rounded mb-1"
      />
      {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

      {/* MOBILE + OTP */}
      <div className="mb-2">
        <input
          placeholder="Mobile (10 digits)"
          {...register("mobile", {
            required: "Mobile required",
            pattern: { value: /^[6-9]\d{9}$/, message: "Invalid mobile - 10 digits starting with 6-9" }
          })}
          className="w-full p-2 border rounded mb-1"
          maxLength={10}
        />
        {errors.mobile && <p className="text-red-500 text-sm mb-1">{errors.mobile.message}</p>}

        {/* Send OTP button */}
        {!otpSent && !verified && (
          <button
            type="button"
            onClick={sendOtp}
            disabled={!/^[6-9]\d{9}$/.test(mobile || "")}
            className="bg-blue-500 text-white px-3 py-1 rounded disabled:bg-gray-400 disabled:cursor-not-allowed mt-1"
          >
            Send OTP
          </button>
        )}
        {otpError && !otpSent && <p className="text-red-500 text-sm mt-1">{otpError}</p>}

        {/* OTP Input */}
        {otpSent && !verified && (
          <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-600 mb-2">
              🔐 Your OTP: <strong className="text-lg">{generatedOtp}</strong>
            </p>
            <input
              placeholder="Enter 6-digit OTP"
              value={enteredOtp}
              onChange={(e) => { setEnteredOtp(e.target.value); setOtpError(""); }}
              className="w-full p-2 border rounded mb-1"
              maxLength={6}
            />
            {otpError && <p className="text-red-500 text-sm mb-1">{otpError}</p>}
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={verifyOtp}
                disabled={enteredOtp.length !== 6}
                className="bg-green-500 text-white px-3 py-1 rounded disabled:bg-gray-400"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={sendOtp}
                className="text-blue-500 text-sm underline"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {/* Verified */}
        {verified && <p className="text-green-600 text-sm mt-1">Mobile Verified ✅</p>}
      </div>

      {/* Alternate Mobile */}
      <input
        placeholder="Alternate Mobile (Optional)"
        {...register("altMobile", {
          validate: (value) => !value || value !== mobile || "Must be different from primary"
        })}
        className="w-full p-2 border rounded mb-2"
        maxLength={10}
      />

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button type="button" onClick={back} className="bg-gray-300 px-4 py-2 rounded">
          Back
        </button>
        <button
          type="submit"
          disabled={!isValid || !verified}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default Step2Personal;
