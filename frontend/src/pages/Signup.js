import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import ThemeModeToggle from "../components/ThemeModeToggle";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
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
    <main className="auth-visual relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeModeToggle />
      </div>
      <section className="w-full max-w-md rounded-md bg-white/95 p-8 shadow-soft backdrop-blur transition-colors duration-300 dark:bg-slate-900/95">
        <BrandLogo />
        <h1 className="mt-2 text-2xl font-bold text-slate-950 transition-colors duration-300 dark:text-white">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600 transition-colors duration-300 dark:text-slate-300">Choose a role and start organizing project work in minutes.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Name</span>
            <input className="form-input mt-1" placeholder="Enter your name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
            <input className="form-input mt-1" type="email" placeholder="Enter your email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span>
            <input className="form-input mt-1" type="password" placeholder="Enter your password" minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Role</span>
            <select className="form-input mt-1" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Signup"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account? <Link className="font-semibold text-slate-950 transition hover:text-[var(--accent)] dark:text-white" to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default Signup;
