import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import BrandLogo from "../components/BrandLogo";
import {
  AuthPage,
  GlassCard,
  AuthInput,
  AuthButton,
} from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(form);
      toast.success("Welcome back");
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
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles className="h-5 w-5 text-cyan-400" fill="currentColor" />
          </motion.div>
          <motion.div
            className="absolute -bottom-3 -left-3"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-fuchsia-400" fill="currentColor" />
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <BrandLogo onDark />
          </motion.div>

          <motion.h1
            className="mt-6 text-center text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-fuchsia-200 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Welcome Back
          </motion.h1>

          <p className="mt-2 text-center text-sm leading-relaxed text-slate-300">
            Organize projects, manage priorities, and keep your team in sync
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              required
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 transition hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                type="button"
                className="group relative text-sm text-cyan-300 transition hover:text-cyan-200"
              >
                <span>Forgot password?</span>
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-cyan-300 transition-all group-hover:w-full" />
              </button>
            </motion.div>

            <AuthButton type="submit" loading={loading} variant="tasker">
              {loading ? "Signing in..." : "Sign in"}
            </AuthButton>
          </form>

          <p className="mt-6 text-center text-sm text-slate-300">
            Don&apos;t have an account?{" "}
            <Link
              className="group relative font-semibold text-cyan-300 transition hover:text-cyan-200"
              to="/signup"
            >
              Create one
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

export default Login;
