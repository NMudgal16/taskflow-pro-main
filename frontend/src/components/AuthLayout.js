import { motion } from "framer-motion";

const accentMap = {
  tasker: {
    blobA: "bg-cyan-500/20",
    blobB: "bg-fuchsia-500/20",
    ring: "from-cyan-500 via-fuchsia-500 to-cyan-500",
    shadow: "hover:shadow-cyan-500/20",
  },
  admin: {
    blobA: "bg-emerald-500/20",
    blobB: "bg-teal-500/20",
    ring: "from-emerald-500 via-teal-400 to-emerald-500",
    shadow: "hover:shadow-emerald-500/20",
  },
};

export const AuthBackground = ({ variant = "tasker" }) => {
  const colors = accentMap[variant] || accentMap.tasker;

  return (
    <>
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className={`absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl ${colors.blobA} animate-pulse`}
        />
        <motion.div
          className={`absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl ${colors.blobB}`}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.75, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${colors.blobA} opacity-30`}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/70 via-transparent to-[#0f172a]/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ delay: 0.3 }}
      />
    </>
  );
};

export const GlassCard = ({ children, variant = "tasker", className = "" }) => {
  const colors = accentMap[variant] || accentMap.tasker;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      className={`relative w-full rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 ${colors.shadow} ${className}`}
    >
      <motion.div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-r opacity-10 blur-xl ${colors.ring}`}
        animate={{ opacity: [0.08, 0.14, 0.08] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      />
      <motion.div className="relative z-10">{children}</motion.div>
    </motion.div>
  );
};

export const AuthPage = ({ variant = "tasker", children, className = "" }) => (
  <main
    className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#0a0e27] to-[#0f172a] p-6 ${className}`}
  >
    <AuthBackground variant={variant} />
    <motion.div
      className="relative z-10 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.15 }}
    >
      {children}
    </motion.div>
  </main>
);

export const AuthInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  accent = "cyan",
  suffix,
}) => {
  const focus =
    accent === "emerald"
      ? "focus:border-emerald-400 focus:ring-emerald-400/40"
      : "focus:border-cyan-400 focus:ring-cyan-400/40";
  const underline =
    accent === "emerald" ? "via-emerald-400" : "via-cyan-400";

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
    >
      <label className="mb-2 block text-sm font-medium text-slate-200">{label}</label>
      <motion.div className="relative">
        <input
          className={`w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none backdrop-blur-md transition-all duration-300 focus:ring-2 group-hover:border-white/20 ${focus} ${suffix ? "pr-12" : ""}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        {suffix}
        <div
          className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent ${underline} to-transparent opacity-0 transition-opacity duration-300 group-focus-within:opacity-100`}
        />
      </motion.div>
    </motion.div>
  );
};

export const AuthButton = ({ children, loading, variant = "tasker", className = "", ...props }) => {
  const gradient =
    variant === "admin"
      ? "from-emerald-500 to-teal-500 hover:shadow-emerald-500/40"
      : "from-cyan-500 to-fuchsia-500 hover:shadow-cyan-500/40";

  return (
    <motion.button
      className={`group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r px-4 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 ${gradient} ${className}`}
      whileTap={{ scale: 0.98 }}
      disabled={loading}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            {children}
          </>
        ) : (
          children
        )}
      </span>
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
};
