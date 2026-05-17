import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import BrandLogo from "../components/BrandLogo";
import {
  AuthPage,
  GlassCard,
  AuthInput,
  AuthButton,
} from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPage variant="tasker">
      <motion.div className="mx-auto w-full max-w-md">
        <GlassCard variant="tasker">
          <motion.div
            className="absolute -top-3 -right-3"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles className="h-5 w-5 text-fuchsia-400" fill="currentColor" />
          </motion.div>

          <div className="flex justify-center">
            <BrandLogo onDark />
          </div>

          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-fuchsia-200 bg-clip-text text-transparent">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm leading-relaxed text-slate-300">
            Choose a role and start organizing project work in minutes
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <AuthInput
              label="Name"
              placeholder="Enter your name"
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              required
            />
            <AuthInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              required
            />
            <AuthInput
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              required
            />
            <motion.div
              className="group"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Role
              </label>
              <select
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none backdrop-blur-md transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40"
                value={form.role}
                onChange={(event) =>
                  setForm({ ...form, role: event.target.value })
                }
              >
                <option value="member" className="bg-slate-900">
                  Member
                </option>
                <option value="admin" className="bg-slate-900">
                  Admin
                </option>
              </select>
            </motion.div>

            <AuthButton type="submit" loading={loading} variant="tasker">
              {loading ? "Creating account..." : "Create account"}
            </AuthButton>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            Already have an account?{" "}
            <Link
              className="group relative font-semibold text-cyan-300 transition hover:text-cyan-200"
              to="/login"
            >
              Sign in
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-cyan-300 transition-all group-hover:w-full" />
            </Link>
          </p>

          <motion.div className="mt-4 flex justify-center border-t border-white/10 pt-4">
            <Link
              to="/select-role"
              className="group flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-300"
            >
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
              Back to role selection
            </Link>
          </motion.div>
        </GlassCard>
      </motion.div>
    </AuthPage>
  );
};

export default Signup;
