import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Register({ onLogin, goToLogin }) {
  const { register, handleSubmit, watch, formState: { errors, isValid } } =
    useForm({ mode: "onTouched" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     data.name,
          email:    data.email,
          mobile:   data.mobile,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        setError(result.detail || result.message || "Registration failed");
        setLoading(false);
        return;
      }

      const result = await res.json();
      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        onLogin(result.user);
      } else {
        setError(result.message || "Registration failed");
      }
    } catch {
      setError("Backend server nahi chal raha. Terminal mein run karo: python -m uvicorn app.main:app --reload --port 8000");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">LendSwift</h1>
          <p className="text-gray-500 text-sm mt-1">Digital Lending Platform</p>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-700">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            placeholder="Enter your full name"
            {...register("name", {
              required: "Name required",
              pattern: { value: /^[A-Za-z. ]+$/, message: "Only letters allowed" }
            })}
            className="w-full p-2 border rounded mb-1"
          />
          {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>}

          <label className="block text-sm font-medium mb-1 mt-2">Email *</label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email required",
              pattern: { value: /^\S+@\S+$/, message: "Invalid email" }
            })}
            className="w-full p-2 border rounded mb-1"
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

          <label className="block text-sm font-medium mb-1 mt-2">Mobile *</label>
          <input
            placeholder="10 digit mobile number"
            {...register("mobile", {
              required: "Mobile required",
              pattern: { value: /^[6-9]\d{9}$/, message: "Invalid mobile number" }
            })}
            className="w-full p-2 border rounded mb-1"
            maxLength={10}
          />
          {errors.mobile && <p className="text-red-500 text-sm mb-2">{errors.mobile.message}</p>}

          <label className="block text-sm font-medium mb-1 mt-2">Password *</label>
          <input
            type="password"
            placeholder="Min 6 characters"
            {...register("password", {
              required: "Password required",
              minLength: { value: 6, message: "Min 6 characters" }
            })}
            className="w-full p-2 border rounded mb-1"
          />
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

          <label className="block text-sm font-medium mb-1 mt-2">Confirm Password *</label>
          <input
            type="password"
            placeholder="Re-enter password"
            {...register("confirmPassword", {
              required: "Please confirm password",
              validate: (val) => val === password || "Passwords do not match"
            })}
            className="w-full p-2 border rounded mb-1"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mb-2">{errors.confirmPassword.message}</p>}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded mb-3">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full bg-blue-600 text-white py-2 rounded mt-2 disabled:bg-gray-400 hover:bg-blue-700"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already account hai?{" "}
          <button onClick={goToLogin} className="text-blue-600 underline font-medium">
            Login karo
          </button>
        </p>
      </div>
    </div>
  );
}
