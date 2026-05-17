import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import BrandLogo from "../components/BrandLogo";
import {
  AuthPage,
  GlassCard,
  AuthInput,
  AuthButton,
} from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      const savedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (savedUser?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        setError("Not an admin user. Please login using admin credentials.");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage variant="admin">
      <motion.div
        className="mx-auto w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <GlassCard variant="admin">
          <motion.div
            className="absolute -top-3 -right-3"
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles className="h-5 w-5 text-emerald-400" fill="currentColor" />
          </motion.div>

          <motion.div className="flex justify-center">
            <BrandLogo onDark />
          </motion.div>

          <motion.div
            className="mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30"
            whileHover={{ scale: 1.05, rotate: 3 }}
          >
            <ShieldCheck className="h-7 w-7 text-white" />
          </motion.div>

          <h1 className="mt-5 text-center text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent">
            Admin Sign In
          </h1>
          <p className="mt-2 text-center text-sm leading-relaxed text-slate-300">
            Secure access to platform controls and oversight
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <AuthInput
              label="Email"
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              accent="emerald"
            />

            <AuthInput
              label="Password"
              type={show ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              accent="emerald"
              suffix={
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-white"
                  aria-label="Toggle password"
                >
                  {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </motion.div>
            )}

            <AuthButton type="submit" loading={loading} variant="admin">
              {loading ? "Signing in..." : "Sign in to Admin Panel"}
            </AuthButton>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 border-t border-white/10 pt-6">
            <Link
              to="/select-role"
              className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-300"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
              Back to role selection
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </AuthPage>
  );
};

export default AdminLogin;
