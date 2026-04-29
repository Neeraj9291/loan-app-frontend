import { useForm } from "react-hook-form";
import { useState } from "react";

const PAN_VALID_4TH = ["P","C","H","A","B","G","J","L","F","T"];
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const verhoeffCheck = (num) => {
  const d = [
    [0,1,2,3,4,5,6,7,8,9],
    [1,2,3,4,0,6,7,8,9,5],
    [2,3,4,0,1,7,8,9,5,6],
    [3,4,0,1,2,8,9,5,6,7],
    [4,0,1,2,3,9,5,6,7,8],
    [5,9,8,7,6,0,4,3,2,1],
    [6,5,9,8,7,1,0,4,3,2],
    [7,6,5,9,8,2,1,0,4,3],
    [8,7,6,5,9,3,2,1,0,4],
    [9,8,7,6,5,4,3,2,1,0]
  ];
  const p = [
    [0,1,2,3,4,5,6,7,8,9],
    [1,5,7,6,2,8,3,0,9,4],
    [5,8,0,3,7,9,6,1,4,2],
    [8,9,1,6,0,4,3,5,2,7],
    [9,4,5,3,1,2,6,8,7,0],
    [4,2,8,6,5,7,3,9,0,1],
    [2,7,9,3,8,0,6,4,1,5],
    [7,0,4,6,9,1,3,2,5,8]
  ];
  let c = 0;
  const arr = num.split("").reverse().map(Number);
  for (let i = 0; i < arr.length; i++) {
    c = d[c][p[i % 8][arr[i]]];
  }
  return c === 0;
};

export default function Step3KYC({ next, back, mobile }) {
  const { register, handleSubmit, watch, formState: { errors, isValid } } =
    useForm({ mode: "onTouched" });

  const panValue     = watch("pan");
  const aadhaarValue = watch("aadhaar");

  const [panOtpSent,      setPanOtpSent]      = useState(false);
  const [panGeneratedOtp, setPanGeneratedOtp] = useState("");
  const [panEnteredOtp,   setPanEnteredOtp]   = useState("");
  const [panVerified,     setPanVerified]     = useState(false);
  const [panOtpError,     setPanOtpError]     = useState("");

  const [aadhaarOtpSent,      setAadhaarOtpSent]      = useState(false);
  const [aadhaarGeneratedOtp, setAadhaarGeneratedOtp] = useState("");
  const [aadhaarEnteredOtp,   setAadhaarEnteredOtp]   = useState("");
  const [aadhaarVerified,     setAadhaarVerified]     = useState(false);
  const [aadhaarOtpError,     setAadhaarOtpError]     = useState("");

  const onSubmit = (data) => next(data);

  const panValid =
    panRegex.test(panValue || "") &&
    PAN_VALID_4TH.includes((panValue || "")[3]?.toUpperCase());

  const aadhaarValid =
    /^\d{12}$/.test(aadhaarValue || "") &&
    verhoeffCheck(aadhaarValue || "000000000000");

  const sendPanOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setPanGeneratedOtp(otp);
    setPanOtpSent(true);
    setPanVerified(false);
    setPanEnteredOtp("");
    setPanOtpError("");
  };

  const verifyPanOtp = () => {
    if (panEnteredOtp === panGeneratedOtp) {
      setPanVerified(true);
      setPanOtpError("");
    } else {
      setPanOtpError("Invalid OTP ❌ Try again");
    }
  };

  const sendAadhaarOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setAadhaarGeneratedOtp(otp);
    setAadhaarOtpSent(true);
    setAadhaarVerified(false);
    setAadhaarEnteredOtp("");
    setAadhaarOtpError("");
  };

  const verifyAadhaarOtp = () => {
    if (aadhaarEnteredOtp === aadhaarGeneratedOtp) {
      setAadhaarVerified(true);
      setAadhaarOtpError("");
    } else {
      setAadhaarOtpError("Invalid OTP ❌ Try again");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-bold mb-1">Step 3: KYC Verification</h2>
      {mobile && (
        <p className="text-sm text-gray-500 mb-4">
          OTP will be shown for: <strong>+91 {mobile}</strong>
        </p>
      )}

      {/* PAN */}
      <div className="mb-4">
        <label htmlFor="pan" className="block mb-1 font-medium">
          PAN Number <span className="text-red-500">*</span>
        </label>
        <input
          id="pan"
          placeholder="ABCDE1234F"
          {...register("pan", {
            required: "PAN required",
            pattern: { value: panRegex, message: "Invalid PAN format (e.g. ABCDE1234F)" },
            validate: (val) => {
              if (!val || val.length < 4) return true;
              const fourth = val[3].toUpperCase();
              if (!PAN_VALID_4TH.includes(fourth)) {
                return "PAN 4th character invalid. Must be P(Individual), C(Company), H(HUF), F(Firm), etc.";
              }
              return true;
            }
          })}
          className={`w-full p-2 border rounded ${errors.pan ? "border-red-500" : "border-gray-300"}`}
          style={{ textTransform: "uppercase" }}
          maxLength={10}
        />
        {errors.pan && (
          <p role="alert" className="text-red-500 text-sm mt-1">{errors.pan.message}</p>
        )}

        {!panVerified && !panOtpSent && (
          <button type="button" onClick={sendPanOtp} disabled={!panValid}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2 disabled:bg-gray-400">
            Send OTP
          </button>
        )}

        {panOtpSent && !panVerified && (
          <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-600 mb-2">
              🔐 Your OTP: <strong className="text-lg">{panGeneratedOtp}</strong>
            </p>
            <input placeholder="Enter 6-digit OTP" value={panEnteredOtp}
              onChange={(e) => { setPanEnteredOtp(e.target.value); setPanOtpError(""); }}
              maxLength={6} className="w-full p-2 border rounded mb-1" />
            {panOtpError && <p className="text-red-500 text-sm mb-1">{panOtpError}</p>}
            <div className="flex gap-2 mt-1">
              <button type="button" onClick={verifyPanOtp}
                disabled={panEnteredOtp.length !== 6}
                className="bg-green-500 text-white px-3 py-1 rounded disabled:bg-gray-400">
                Verify OTP
              </button>
              <button type="button" onClick={sendPanOtp} className="text-blue-500 text-sm underline">
                Resend
              </button>
            </div>
          </div>
        )}
        {panVerified && <p className="text-green-600 text-sm mt-1">PAN Verified ✅</p>}
      </div>

      {/* Aadhaar */}
      <div className="mb-4">
        <label htmlFor="aadhaar" className="block mb-1 font-medium">
          Aadhaar Number <span className="text-red-500">*</span>
        </label>
        <input
          id="aadhaar"
          placeholder="Enter 12 digit Aadhaar"
          {...register("aadhaar", {
            required: "Aadhaar required",
            pattern: { value: /^\d{12}$/, message: "Must be exactly 12 digits" },
            validate: (val) => {
              if (!val || val.length !== 12) return true;
              if (!verhoeffCheck(val)) {
                return "Invalid Aadhaar number - checksum verification failed";
              }
              return true;
            }
          })}
          className={`w-full p-2 border rounded ${errors.aadhaar ? "border-red-500" : "border-gray-300"}`}
          maxLength={12}
        />
        {errors.aadhaar && (
          <p role="alert" className="text-red-500 text-sm mt-1">{errors.aadhaar.message}</p>
        )}

        {!aadhaarVerified && !aadhaarOtpSent && (
          <button type="button" onClick={sendAadhaarOtp} disabled={!aadhaarValid}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2 disabled:bg-gray-400">
            Send OTP
          </button>
        )}

        {aadhaarOtpSent && !aadhaarVerified && (
          <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-xs text-blue-600 mb-2">
              🔐 Your OTP: <strong className="text-lg">{aadhaarGeneratedOtp}</strong>
            </p>
            <input placeholder="Enter 6-digit OTP" value={aadhaarEnteredOtp}
              onChange={(e) => { setAadhaarEnteredOtp(e.target.value); setAadhaarOtpError(""); }}
              maxLength={6} className="w-full p-2 border rounded mb-1" />
            {aadhaarOtpError && <p className="text-red-500 text-sm mb-1">{aadhaarOtpError}</p>}
            <div className="flex gap-2 mt-1">
              <button type="button" onClick={verifyAadhaarOtp}
                disabled={aadhaarEnteredOtp.length !== 6}
                className="bg-green-500 text-white px-3 py-1 rounded disabled:bg-gray-400">
                Verify OTP
              </button>
              <button type="button" onClick={sendAadhaarOtp} className="text-blue-500 text-sm underline">
                Resend
              </button>
            </div>
          </div>
        )}
        {aadhaarVerified && <p className="text-green-600 text-sm mt-1">Aadhaar Verified ✅</p>}
      </div>

      {/* Consent */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("consent", { required: true })} />
          <span className="text-sm">I agree to Aadhaar verification and KYC process</span>
        </label>
        {errors.consent && <p className="text-red-500 text-sm">Consent is required</p>}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button type="button" onClick={back}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
          ← Back
        </button>
        <button type="submit"
          disabled={!isValid || !panVerified || !aadhaarVerified}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-green-600">
          Next →
        </button>
      </div>
    </form>
  );
}
