import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
    <main className="auth-visual flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-md bg-white/95 p-8 shadow-soft backdrop-blur">
        <BrandLogo />
        <h1 className="mt-2 text-2xl font-bold text-slate-950">Sign in to your workspace</h1>
        <p className="mt-2 text-sm text-slate-600">A focused place for projects, priorities, and team follow-through.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input className="form-input mt-1" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <input className="form-input mt-1" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </label>
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Need an account? <Link className="font-semibold text-slate-950" to="/signup">Create one</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
