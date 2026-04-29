import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Login({ onLogin, goToRegister }) {
  const { register, handleSubmit, formState: { errors, isValid } } =
    useForm({ mode: "onTouched" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("http://localhost:8000/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user",  JSON.stringify(result.user));
        onLogin(result.user);
      } else {
        setError(result.message || "Login failed");
      }
    } catch {
      setError("Server error. Backend chal raha hai?");
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

        <h2 className="text-xl font-semibold mb-4 text-gray-700">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-sm font-medium mb-1">Email *</label>
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

          <label className="block text-sm font-medium mb-1 mt-2">Password *</label>
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password required",
              minLength: { value: 6, message: "Min 6 characters" }
            })}
            className="w-full p-2 border rounded mb-1"
          />
          {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-2 rounded mb-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full bg-blue-600 text-white py-2 rounded mt-2 disabled:bg-gray-400 hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Account nahi hai?{" "}
          <button onClick={goToRegister} className="text-blue-600 underline">
            Register karo
          </button>
        </p>
      </div>
    </div>
  );
}
