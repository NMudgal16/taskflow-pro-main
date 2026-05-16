import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sparkles as SparklesIcon } from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";

// Simple card component
const TiltCard = ({ children }) => {
  return (
    <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl transition-all duration-300 shadow-2xl hover:shadow-cyan-500/20">
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 opacity-10 blur-xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(form);
      toast.success("Welcome back ✨");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#0a0e27] to-[#0f172a]">
      {/* Background gradient with animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/60 via-transparent to-[#0f172a]/40 z-0" />

      {/* Floating Glass Card */}
      <div className="relative z-10">
        <TiltCard>
          <div className="relative">
            {/* Decorative sparkle icons */}
            <div className="absolute -top-4 -right-4 animate-pulse">
              <SparklesIcon className="h-6 w-6 text-cyan-400" fill="#06b6d4" />
            </div>
            <div className="absolute -bottom-4 -left-4 animate-pulse delay-700">
              <SparklesIcon className="h-5 w-5 text-fuchsia-400" fill="#d946ef" />
            </div>

            <div className="flex justify-center">
              <BrandLogo />
            </div>

            <h1 className="mt-6 text-center text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-fuchsia-200 bg-clip-text text-transparent">
              Welcome Back
            </h1>

            <p className="mt-2 text-center text-sm leading-relaxed text-slate-300">
              Organize projects, manage priorities, and keep your team in sync ✨
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Email */}
              <div className="group">
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Email
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none backdrop-blur-md transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 group-hover:border-white/20"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    required
                  />
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white placeholder:text-slate-400 outline-none backdrop-blur-md transition-all duration-300 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40 group-hover:border-white/20"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(event) =>
                      setForm({ ...form, password: event.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 transition-all duration-300 hover:text-white hover:scale-110"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="group relative text-sm text-cyan-300 transition-all duration-300 hover:text-cyan-200"
                >
                  <span>Forgot Password?</span>
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-cyan-300 transition-all duration-300 group-hover:w-full" />
                </button>
              </div>

              {/* Login Button */}
              <button
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/40 disabled:opacity-70"
                type="submit"
                disabled={loading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </span>
                <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-500 group-hover:translate-y-0" />
                {isHovered && !loading && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                )}
              </button>
            </form>

            {/* Signup */}
            <p className="mt-6 text-center text-sm text-slate-300">
              Don't have an account?{" "}
              <Link
                className="group relative font-semibold text-cyan-300 transition-all duration-300 hover:text-cyan-200"
                to="/signup"
              >
                Create one
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-cyan-300 transition-all duration-300 group-hover:w-full" />
              </Link>
            </p>
          </div>
        </TiltCard>
      </div>
    </main>
  );
};

export default Login;
