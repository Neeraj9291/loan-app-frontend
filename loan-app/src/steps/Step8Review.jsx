import { useState } from "react";

const fmt = (n) => Number(n).toLocaleString("en-IN");

const calcEMI = (principal, annualRate, months) => {
  const r = annualRate / 12 / 100;
  return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
};

const RATES = { personal: 10.5, home: 8.5, business: 14.0 };

export default function Step8Review({ formData, goToStep, onFinalSubmit }) {
  const [consents, setConsents] = useState({ terms: false, credit: false, data: false, kfs: false });
  const [consentError, setConsentError] = useState("");

  const {
    loanType, amount, tenure, purpose,
    name, dob, email, mobile,
    pan, aadhaar, address, pincode, state,
    employmentType, companyName, monthlyIncome,
    coName, coIncome, signature
  } = formData;

  const rate       = RATES[loanType] || 10.5;
  const emi        = amount && tenure ? calcEMI(Number(amount), rate, Number(tenure)) : 0;
  const total      = emi * Number(tenure || 0);
  const cost       = total - Number(amount || 0);
  const fee        = Math.min(Math.max(Number(amount || 0) * 0.01, 2000), 25000);
  const income     = Number(monthlyIncome || 0);
  const coInc      = Number(coIncome || 0);
  const totalIncome = income + coInc;
  const emiRatio   = totalIncome > 0 ? ((emi / totalIncome) * 100).toFixed(1) : 0;
  const allConsents = Object.values(consents).every(Boolean);

  const toggle = (key) => setConsents((p) => ({ ...p, [key]: !p[key] }));

  const handleSubmit = () => {
    if (!allConsents) { setConsentError("Please accept all consents to proceed"); return; }
    onFinalSubmit(formData);
  };

  const Section = ({ title, step, children }) => (
    <div className="mb-3 border rounded p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
        <button type="button" onClick={() => goToStep(step)}
          className="text-xs text-blue-600 underline">Edit</button>
      </div>
      {children}
    </div>
  );

  const Row = ({ label, value }) => (
    <div className="flex justify-between text-sm py-1 border-b last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right">{value || "—"}</span>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 8: Review & Submit</h2>

      {/* Pre-Approval Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
        <h3 className="font-bold text-blue-800 mb-3">📊 Pre-Approval Summary</h3>
        <Row label="Loan Type"       value={loanType?.toUpperCase()} />
        <Row label="Loan Amount"     value={`₹${fmt(amount)}`} />
        <Row label="Tenure"          value={`${tenure} months`} />
        <Row label="Interest Rate"   value={`${rate}% p.a.`} />
        <Row label="Estimated EMI"   value={`₹${fmt(emi)}/month`} />
        <Row label="Total Repayment" value={`₹${fmt(total)}`} />
        <Row label="Total Interest"  value={`₹${fmt(cost)}`} />
        <Row label="Processing Fee"  value={`₹${fmt(fee)}`} />
        {emiRatio > 0 && (
          <div className={`mt-2 text-sm p-2 rounded ${Number(emiRatio) > 50 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            EMI-to-Income Ratio: <strong>{emiRatio}%</strong>
            {Number(emiRatio) > 50 && " ⚠️ Exceeds 50% — high risk"}
          </div>
        )}
      </div>

      {/* Sections */}
      <Section title="Loan Details" step={1}>
        <Row label="Type"    value={loanType} />
        <Row label="Amount"  value={`₹${fmt(amount)}`} />
        <Row label="Tenure"  value={`${tenure} months`} />
        <Row label="Purpose" value={purpose} />
      </Section>

      <Section title="Personal Information" step={2}>
        <Row label="Name"   value={name} />
        <Row label="DOB"    value={dob} />
        <Row label="Email"  value={email} />
        <Row label="Mobile" value={mobile} />
      </Section>

      <Section title="KYC Details" step={3}>
        <Row label="PAN"     value={pan     ? `****${pan.slice(-4)}`     : "—"} />
        <Row label="Aadhaar" value={aadhaar ? `****${aadhaar.slice(-4)}` : "—"} />
      </Section>

      <Section title="Address" step={4}>
        <Row label="Address"  value={address} />
        <Row label="PIN Code" value={pincode} />
        <Row label="State"    value={state} />
      </Section>

      <Section title="Employment & Income" step={5}>
        <Row label="Type"    value={employmentType} />
        {companyName && <Row label="Company" value={companyName} />}
        <Row label="Income"  value={monthlyIncome ? `₹${fmt(monthlyIncome)}` : "—"} />
      </Section>

      {coName && (
        <Section title="Co-Applicant" step={6}>
          <Row label="Name"   value={coName} />
          <Row label="Income" value={coIncome ? `₹${fmt(coIncome)}` : "—"} />
        </Section>
      )}

      {/* E-Signature Preview */}
      {signature && (
        <div className="mb-4 border rounded p-3">
          <h3 className="font-semibold text-gray-700 text-sm mb-2">E-Signature</h3>
          <img src={signature} alt="signature" className="border rounded h-16" />
        </div>
      )}

      {/* Consents */}
      <div className="mb-4 border rounded p-3 bg-gray-50">
        <h3 className="font-semibold text-gray-700 text-sm mb-3">Declarations & Consents</h3>
        {[
          { key: "terms",  label: "I have read and agree to the Terms & Conditions and Loan Agreement." },
          { key: "credit", label: "I consent to credit bureau check and KYC verification." },
          { key: "data",   label: "I consent to my data being shared with lending partners for processing." },
          { key: "kfs",    label: "I have reviewed the Key Fact Statement (KFS) and understand the loan terms." },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-start gap-2 mb-2 text-sm cursor-pointer">
            <input type="checkbox" checked={consents[key]} onChange={() => toggle(key)} className="mt-0.5" />
            <span>{label}</span>
          </label>
        ))}
        {consentError && <p className="text-red-500 text-sm mt-1">{consentError}</p>}
      </div>

      {/* Submit */}
      <button type="button" onClick={handleSubmit}
        disabled={!allConsents}
        className="w-full bg-green-600 text-white py-3 rounded font-semibold disabled:bg-gray-400 hover:bg-green-700">
        Submit Application ✅
      </button>
    </div>
  );
}
