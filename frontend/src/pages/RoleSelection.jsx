import React from "react";
import { useNavigate } from "react-router-dom";
import { User, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import BrandLogo from "../components/BrandLogo";
import { AuthPage, GlassCard } from "../components/AuthLayout";

const roles = [
  {
    id: "tasker",
    title: "Login as Tasker",
    description: "Access your workspace, manage tasks, and collaborate with your team.",
    cta: "Proceed to tasker login",
    icon: User,
    path: "/login",
    iconBg: "from-cyan-500 to-blue-600",
    iconShadow: "shadow-cyan-500/30",
    accent: "group-hover:border-cyan-400/40 group-hover:shadow-cyan-500/10",
    arrow: "text-cyan-400",
  },
  {
    id: "admin",
    title: "Login as Admin",
    description: "Access the admin panel, manage users, and oversee platform health.",
    cta: "Proceed to admin login",
    icon: ShieldCheck,
    path: "/admin-login",
    iconBg: "from-emerald-500 to-teal-600",
    iconShadow: "shadow-emerald-500/30",
    accent: "group-hover:border-emerald-400/40 group-hover:shadow-emerald-500/10",
    arrow: "text-emerald-400",
  },
];

const RoleCard = ({ role, index, onSelect }) => {
  const Icon = role.icon;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(role.path)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.12, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`group relative w-full overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-8 text-left backdrop-blur-xl transition-all duration-300 hover:bg-white/10 ${role.accent}`}
    >
      <motion.div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl transition group-hover:bg-white/10" />
      <motion.div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${role.iconBg} shadow-lg ${role.iconShadow}`}
        whileHover={{ rotate: 6, scale: 1.05 }}
      >
        <Icon className="h-7 w-7 text-white" />
      </motion.div>
      <h2 className="mt-6 text-2xl font-bold text-white">{role.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">
        {role.description}
      </p>
      <div className={`mt-6 flex items-center gap-2 text-sm font-medium ${role.arrow}`}>
        <span>{role.cta}</span>
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </motion.button>
  );
};

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <AuthPage variant="tasker">
      <div className="mx-auto w-full max-w-4xl">
        <motion.div
          className="mb-10 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BrandLogo onDark />
          <div className="mt-6 flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-cyan-300/90">
            <Sparkles className="h-4 w-4" />
            Choose your portal
            <Sparkles className="h-4 w-4" />
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              TaskFlow Pro
            </span>
          </h1>
          <p className="mt-3 max-w-lg text-sm text-slate-400">
            Select how you want to sign in. Taskers manage day-to-day work; admins oversee the platform.
          </p>
        </motion.div>

        <GlassCard variant="tasker" className="!p-6 md:!p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {roles.map((role, index) => (
              <RoleCard key={role.id} role={role} index={index} onSelect={navigate} />
            ))}
          </div>
        </GlassCard>
      </div>
    </AuthPage>
  );
};

export default RoleSelection;
