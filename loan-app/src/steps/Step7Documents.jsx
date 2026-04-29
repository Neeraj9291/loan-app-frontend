import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function Step7Documents({ next, back, loanType, employmentType }) {
  const sigRef = useRef(null);
  const [sigError, setSigError] = useState("");
  const [signature, setSignature] = useState("");
  const [docs, setDocs] = useState({});
  const [docErrors, setDocErrors] = useState({});

  const REQUIRED_DOCS = [
    { key: "pan_card",    label: "PAN Card Copy",              all: true },
    { key: "aadhaar",     label: "Aadhaar Card (Front+Back)",  all: true },
    { key: "photo",       label: "Passport Size Photo",        all: true },
    { key: "bank_stmt",   label: "Bank Statement (6 months)",  all: true },
    { key: "salary_slip", label: "Salary Slips (3 months)",    empTypes: ["Salaried"] },
    { key: "itr",         label: "ITR (Last 2 years)",         empTypes: ["Self-Employed", "Business Owner"] },
    { key: "property",    label: "Property Documents",         loanTypes: ["home"] },
    { key: "biz_reg",     label: "Business Registration Cert", loanTypes: ["business"] },
    { key: "gst_returns", label: "GST Returns (4 quarters)",   loanTypes: ["business"] },
  ].filter((doc) => {
    if (doc.all) return true;
    if (doc.loanTypes && !doc.loanTypes.includes(loanType)) return false;
    if (doc.empTypes && !doc.empTypes.includes(employmentType)) return false;
    return true;
  });

  const handleFile = (key, file) => {
    if (!file) return;
    const maxMB = key === "bank_stmt" || key === "property" ? 10 : 5;
    if (file.size > maxMB * 1024 * 1024) {
      setDocErrors((p) => ({ ...p, [key]: `Max ${maxMB}MB allowed` }));
      return;
    }
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      setDocErrors((p) => ({ ...p, [key]: "Only PDF, JPG, PNG allowed" }));
      return;
    }
    setDocErrors((p) => ({ ...p, [key]: "" }));
    const reader = new FileReader();
    reader.onload = (e) => setDocs((p) => ({ ...p, [key]: { name: file.name, url: e.target.result, type: file.type } }));
    reader.readAsDataURL(file);
  };

  const clearSig = () => { sigRef.current.clear(); setSignature(""); setSigError(""); };

  const handleSubmit = () => {
    const missing = REQUIRED_DOCS.filter((d) => !docs[d.key]);
    if (missing.length > 0) {
      const errs = {};
      missing.forEach((d) => { errs[d.key] = "This document is required"; });
      setDocErrors(errs);
      return;
    }
    if (sigRef.current.isEmpty()) { setSigError("Signature is required"); return; }
    const sig = sigRef.current.toDataURL("image/png");
    setSignature(sig);
    next({ documents: docs, signature: sig });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Step 7: Documents & E-Signature</h2>

      {/* Document Upload */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Required Documents</h3>
        {REQUIRED_DOCS.map((doc) => (
          <div key={doc.key} className="mb-3 p-3 border rounded bg-gray-50">
            <label className="block text-sm font-medium mb-1">{doc.label} *</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFile(doc.key, e.target.files[0])}
              className="w-full text-sm" />
            {docErrors[doc.key] && <p className="text-red-500 text-xs mt-1">{docErrors[doc.key]}</p>}
            {docs[doc.key] && (
              <div className="mt-2 flex items-center gap-2">
                {docs[doc.key].type.startsWith("image/") ? (
                  <img src={docs[doc.key].url} alt="preview" className="h-12 w-12 object-cover rounded border" />
                ) : (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">📄 PDF</span>
                )}
                <span className="text-xs text-green-600">✅ {docs[doc.key].name}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* E-Signature */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">E-Signature *</h3>
        <p className="text-xs text-gray-500 mb-2">Draw your signature below using mouse or touch</p>
        <div className="border-2 border-dashed border-gray-400 rounded bg-white">
          <SignatureCanvas ref={sigRef} penColor="black"
            canvasProps={{ width: 400, height: 150, className: "w-full" }} />
        </div>
        {sigError && <p className="text-red-500 text-sm mt-1">{sigError}</p>}
        <button type="button" onClick={clearSig}
          className="mt-2 text-sm text-red-500 underline">Clear Signature</button>
      </div>

      <div className="flex justify-between mt-4">
        <button type="button" onClick={back} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">← Back</button>
        <button type="button" onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Next →</button>
      </div>
    </div>
  );
}
