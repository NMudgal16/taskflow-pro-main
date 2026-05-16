import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      // After login, AuthContext saves user. Check role.
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (savedUser?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        setError("Not an admin user. Please login using admin credentials.");
        // logout if logged in mistakenly
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1118] p-6">
      <div className="w-full max-w-md bg-[#0b0d12] border border-slate-800 rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-white mb-4">Admin Login</h2>
        <p className="text-sm text-slate-400 mb-6">Sign in with your admin account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-md bg-[#0f1724] border border-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#5268ff]"
            />
          </div>

          <div className="relative">
            <label className="text-sm text-slate-300">Password</label>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-md bg-[#0f1724] border border-slate-800 px-3 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[#5268ff]"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-8 text-slate-400 hover:text-white p-1"
              aria-label="Toggle password"
            >
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#5268ff] px-4 py-2 font-semibold text-white hover:bg-[#40539d] transition"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
