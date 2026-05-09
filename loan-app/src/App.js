import React, { useState, useEffect, useRef } from "react";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import Dashboard        from "./pages/Dashboard";
import ChatBot          from "./pages/ChatBot";
import Step1Loan        from "./steps/Step1Loan";
import Step2Personal    from "./steps/Step2Personal";
import Step3KYC         from "./steps/Step3KYC";
import Step4Address     from "./steps/Step4Address";
import Step5Employment  from "./steps/Step5Employment";
import Step6CoApplicant from "./steps/Step6CoApplicant";
import Step7Documents   from "./steps/Step7Documents";
import Step8Review      from "./steps/Step8Review";

const STEP_LABELS = [
  "Loan Details", "Personal Info", "KYC",
  "Address", "Employment", "Co-Applicant",
  "Documents", "Review"
];

const DRAFT_KEY = "lendswift_draft";

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    const hoursDiff = (Date.now() - new Date(draft.savedAt)) / (1000 * 60 * 60);
    if (hoursDiff > 72) { localStorage.removeItem(DRAFT_KEY); return null; }
    return draft;
  } catch { return null; }
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export default function App() {
  const [page, setPage]             = useState("login");
  const [user, setUser]             = useState(null);
  const [step, setStep]             = useState(1);
  const [formData, setFormData]     = useState({});
  const [submitted, setSubmitted]   = useState(false);
  const [appId, setAppId]           = useState("");
  const [showResume, setShowResume] = useState(false);
  const [savedDraft, setSavedDraft] = useState(null);
  const [saveMsg, setSaveMsg]       = useState("");
  const [showChat, setShowChat]     = useState(false);
  const autoSaveTimer               = useRef(null);

  useEffect(() => {
    if (Object.keys(formData).length === 0) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({
          formData, step,
          savedAt: new Date().toISOString(),
          version: "1.0"
        }));
        setSaveMsg("Draft saved ✅");
        setTimeout(() => setSaveMsg(""), 2500);
      } catch (e) {
        console.error("Auto-save failed", e);
      }
    }, 30000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [formData, step]);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (saved && token) {
      setUser(JSON.parse(saved));
      setPage("dashboard");
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); setPage("login");
    setStep(1); setFormData({}); setSubmitted(false);
  };

  const handleNewApplication = () => {
    setStep(1);
    setFormData({});
    setSubmitted(false);
    const draft = loadDraft();
    if (draft) { setSavedDraft(draft); setShowResume(true); }
    setPage("form");
  };

  const resumeDraft = () => {
    setFormData(savedDraft.formData);
    setStep(savedDraft.step);
    setShowResume(false);
  };

  const startFresh = () => {
    clearDraft();
    setShowResume(false);
    setFormData({});
    setStep(1);
  };

  const coRequired = formData.coApplicantRequired;
  const totalSteps = coRequired ? 8 : 7;

  const handleNext = (data) => {
    const updated = { ...formData, ...data };
    setFormData(updated);
    if (step === 5 && !updated.coApplicantRequired) setStep(7);
    else setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 7 && !coRequired) setStep(5);
    else setStep((s) => s - 1);
  };

  const handleFinalSubmit = async (data) => {
    const finalData = { ...formData, ...data };
    const id = "LND" + Date.now();
    setAppId(id);
    clearDraft();
    try {
      await fetch("http://localhost:8000/api/application/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(finalData),
      });
    } catch { }
    setSubmitted(true);
  };

  const progressStep = coRequired ? step : step > 5 ? step - 1 : step;
  const progress = Math.round((progressStep / totalSteps) * 100);

  if (page === "login") {
    return <Login onLogin={handleLogin} goToRegister={() => setPage("register")} />;
  }

  if (page === "register") {
    return <Register onLogin={handleLogin} goToLogin={() => setPage("login")} />;
  }

  if (page === "dashboard") {
    return (
      <>
        <Dashboard user={user} onNewApplication={handleNewApplication} onLogout={handleLogout} />
        <button onClick={() => setShowChat(!showChat)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 text-2xl z-40">
          💬
        </button>
        {showChat && <ChatBot onClose={() => setShowChat(false)} />}
      </>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-1">Application ID:</p>
          <p className="text-lg font-bold text-blue-700 mb-4">{appId}</p>
          <p className="text-sm text-gray-400 mb-6">
            We will contact you on {formData.mobile} within 24 hours.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setPage("dashboard")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Go to Dashboard
            </button>
            <button onClick={() => { setStep(1); setFormData({}); setSubmitted(false); }}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300">
              Apply Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {showResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-2">📋 Saved Application Found</h3>
            <p className="text-gray-600 text-sm mb-1">
              Saved on{" "}
              <strong>{new Date(savedDraft?.savedAt).toLocaleString("en-IN")}</strong>
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Last step: <strong>{STEP_LABELS[(savedDraft?.step || 1) - 1]}</strong>
            </p>
            <div className="flex gap-3">
              <button onClick={resumeDraft}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium">
                Resume
              </button>
              <button onClick={startFresh}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 font-medium">
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => setPage("dashboard")}>
          🏦 LendSwift
        </h1>
        <div className="flex items-center gap-4">
          {saveMsg && (
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">{saveMsg}</span>
          )}
          <button onClick={() => setPage("dashboard")} className="text-sm text-white underline">
            Dashboard
          </button>
          <span className="text-sm">👤 {user?.name}</span>
          <button onClick={handleLogout}
            className="bg-white text-blue-700 text-sm px-3 py-1 rounded hover:bg-gray-100">
            Logout
          </button>
        </div>
      </nav>

      <div className="flex items-center justify-center py-6">
        <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-lg">
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Step {progressStep} of {totalSteps}</span>
              <span>{progress}% complete</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded"
              role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}
              aria-label={`Step ${progressStep} of ${totalSteps} - ${STEP_LABELS[step - 1]}`}>
              <div className="bg-blue-600 h-2 rounded transition-all duration-300"
                style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              {STEP_LABELS.slice(0, totalSteps).map((label, i) => {
                const stepNum = i + 1;
                const actualStep = !coRequired && stepNum >= 6 ? stepNum + 1 : stepNum;
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold
                      ${step === actualStep ? "bg-blue-600 text-white" :
                        step > actualStep ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                      {step > actualStep ? "✓" : stepNum}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-1 text-center font-medium">
              {STEP_LABELS[step - 1]}
            </p>
          </div>

          {step === 1 && <Step1Loan next={handleNext} defaultValues={formData} />}
          {step === 2 && <Step2Personal next={handleNext} back={handleBack} defaultValues={formData} />}
          {step === 3 && <Step3KYC next={handleNext} back={handleBack} mobile={formData.mobile} />}
          {step === 4 && <Step4Address next={handleNext} back={handleBack} defaultValues={formData} />}
          {step === 5 && <Step5Employment next={handleNext} back={handleBack} defaultValues={formData} loanType={formData.loanType} />}
          {step === 6 && coRequired && <Step6CoApplicant next={handleNext} back={handleBack} defaultValues={formData} maritalStatus={formData.maritalStatus} />}
          {step === 7 && <Step7Documents next={handleNext} back={handleBack} loanType={formData.loanType} employmentType={formData.employmentType} />}
          {step === 8 && <Step8Review formData={formData} goToStep={(s) => setStep(s)} onFinalSubmit={handleFinalSubmit} />}
        </div>
      </div>

      {/* Chat Button */}
      <button onClick={() => setShowChat(!showChat)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 text-2xl z-40">
        💬
      </button>

      {showChat && <ChatBot onClose={() => setShowChat(false)} />}
    </div>
  );
}
