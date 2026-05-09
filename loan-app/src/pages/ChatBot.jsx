import { useState, useRef, useEffect } from "react";

const RESPONSES = {
  greetings: {
    patterns: ["hello", "hi", "hey", "namaste", "hii", "helo"],
    response: "Hello! 👋 Main LendSwift ka AI Assistant hoon. Aapki loan application mein kaise help kar sakta hoon?"
  },
  loan_types: {
    patterns: ["loan type", "kaun sa loan", "loan kya hai", "types", "personal", "home", "business"],
    response: "Hum 3 types ke loans offer karte hain:\n\n🏠 **Home Loan** - Up to ₹1 Crore @ 8.5% p.a.\n💼 **Personal Loan** - Up to ₹10 Lakh @ 10.5% p.a.\n🏢 **Business Loan** - Up to ₹50 Lakh @ 14% p.a."
  },
  eligibility: {
    patterns: ["eligible", "eligibility", "qualify", "age", "income", "salary", "kitna"],
    response: "Loan eligibility ke liye:\n\n✅ Age: 21-65 years\n✅ Minimum Income: ₹15,000/month (Salaried)\n✅ Valid PAN & Aadhaar\n✅ Good CIBIL Score (700+)\n✅ Indian Resident"
  },
  documents: {
    patterns: ["document", "docs", "papers", "kya chahiye", "required", "upload"],
    response: "Required documents:\n\n📄 PAN Card\n📄 Aadhaar Card\n📄 Salary Slips (3 months)\n📄 Bank Statement (6 months)\n📄 Passport Size Photo\n📄 Address Proof"
  },
  emi: {
    patterns: ["emi", "monthly", "payment", "installment", "kitna bhugtna", "repay"],
    response: "EMI calculation formula:\nEMI = P × r × (1+r)^n / ((1+r)^n - 1)\n\nExample: ₹5 Lakh Personal Loan for 3 years\n📊 EMI = ~₹16,133/month\n📊 Total Payment = ₹5,80,788\n📊 Total Interest = ₹80,788"
  },
  interest: {
    patterns: ["interest", "rate", "byaj", "percent", "%"],
    response: "Interest Rates:\n\n🏠 Home Loan: 8.5% p.a.\n💼 Personal Loan: 10.5% p.a.\n🏢 Business Loan: 14% p.a.\n\nYe rates fixed hain aur RBI guidelines ke according hain."
  },
  apply: {
    patterns: ["apply", "kaise apply", "start", "begin", "shuru", "application"],
    response: "Loan apply karne ke steps:\n\n1️⃣ Register/Login karein\n2️⃣ Loan type select karein\n3️⃣ Personal details bharein\n4️⃣ KYC verification karein\n5️⃣ Documents upload karein\n6️⃣ Review & Submit karein\n\nPura process 10-15 minutes mein complete hota hai! 🚀"
  },
  status: {
    patterns: ["status", "track", "check", "kahan", "progress", "approved", "rejected"],
    response: "Application status check karne ke liye:\n\n📊 Dashboard pe jao\n🔍 Apni application ID search karo\n✅ Status dikhega: Pending/Approved/Rejected\n\nApproval mein 24-48 hours lagte hain."
  },
  time: {
    patterns: ["time", "kitna time", "kab", "when", "days", "hours", "approval"],
    response: "Processing time:\n\n⏱️ Application Review: 24 hours\n⏱️ Document Verification: 24-48 hours\n⏱️ Loan Approval: 2-3 business days\n⏱️ Disbursement: 1-2 days after approval"
  },
  contact: {
    patterns: ["contact", "help", "support", "phone", "email", "call", "helpline"],
    response: "LendSwift Support:\n\n📞 Helpline: 1800-XXX-XXXX (Toll Free)\n📧 Email: support@lendswift.com\n🕐 Timing: Mon-Sat, 9AM-6PM\n\nYa Dashboard pe jao aur 'New Application' click karo!"
  },
  cibil: {
    patterns: ["cibil", "credit score", "credit", "score"],
    response: "CIBIL Score ke baare mein:\n\n⭐ 750+ : Excellent (Best rates milti hain)\n✅ 700-749 : Good (Approval likely)\n⚠️ 650-699 : Fair (Higher interest)\n❌ Below 650 : Poor (Approval difficult)\n\nHum 700+ CIBIL score prefer karte hain."
  },
  kyc: {
    patterns: ["kyc", "pan", "aadhaar", "verify", "verification"],
    response: "KYC Verification process:\n\n1️⃣ PAN Number enter karein (Format: ABCDE1234F)\n2️⃣ OTP verify karein\n3️⃣ Aadhaar Number enter karein (12 digits)\n4️⃣ OTP verify karein\n5️⃣ Consent checkbox tick karein\n\nVerification 1-2 minutes mein complete hoti hai! ✅"
  },
  thanks: {
    patterns: ["thanks", "thank you", "shukriya", "dhanyawad", "ok", "okay", "got it"],
    response: "Aapka swagat hai! 😊 Koi aur sawaal ho toh zaroor poochein. LendSwift mein aapka loan application jaldi approve ho! 🏦✨"
  },
  default: "Mujhe samajh nahi aaya. Kripya in topics ke baare mein poochein:\n\n• Loan Types\n• Eligibility\n• Documents\n• EMI Calculation\n• Interest Rates\n• Application Process\n• CIBIL Score\n• KYC Verification"
};

const getResponse = (input) => {
  const lower = input.toLowerCase();
  for (const key of Object.keys(RESPONSES)) {
    if (key === "default") continue;
    if (RESPONSES[key].patterns.some(p => lower.includes(p))) {
      return RESPONSES[key].response;
    }
  }
  return RESPONSES.default;
};

const QUICK_QUESTIONS = [
  "Loan types kya hain?",
  "Eligibility kya hai?",
  "Documents kya chahiye?",
  "EMI kaise calculate hoti hai?",
  "Apply kaise karein?",
];

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Namaste! 🙏 Main LendSwift Assistant hoon.\n\nAap mujhse loan ke baare mein kuch bhi pooch sakte hain!",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    setMessages(prev => [...prev, { from: "user", text: msg, time }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = getResponse(msg);
      setMessages(prev => [...prev, { from: "bot", text: response, time }]);
      setTyping(false);
    }, 800);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">

      {/* Header */}
      <div className="bg-blue-700 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
            AI
          </div>
          <div>
            <p className="font-semibold text-sm">LendSwift Assistant</p>
            <p className="text-xs text-blue-200">● Online</p>
          </div>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200 text-xl">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line
              ${msg.from === "user"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
              {msg.text}
              <p className={`text-xs mt-1 ${msg.from === "user" ? "text-blue-200" : "text-gray-400"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-3 pb-2">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {QUICK_QUESTIONS.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)}
              className="whitespace-nowrap text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded-full hover:bg-blue-100">
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-3 pb-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Kuch poochein..."
          className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={() => sendMessage()}
          disabled={!input.trim()}
          className="bg-blue-600 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-400">
          ➤
        </button>
      </div>
    </div>
  );
}
