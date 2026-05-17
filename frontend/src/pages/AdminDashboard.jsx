import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  ListTodo,
  ClipboardCheck,
  Shield,
  LogOut,
  Activity,
  Sparkles,
  FolderKanban,
  Radio,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import useRealtimePolling from "../hooks/useRealtimePolling";
import usePollingErrorHandler from "../hooks/usePollingErrorHandler";
import LoadingState from "../components/LoadingState";
import Badge from "../components/Badge";

const STAT_CONFIG = [
  { key: "totalMembers", label: "Total taskers", hint: "Registered members", icon: Users, gradient: "from-slate-800/90 to-slate-900/90", iconColor: "text-cyan-400", delay: 0 },
  { key: "totalTasks", label: "Total tasks", hint: "Across all projects", icon: ListTodo, gradient: "from-emerald-600/80 to-teal-800/90", iconColor: "text-emerald-300", delay: 0.1 },
  { key: "pendingReviews", label: "Pending reviews", hint: "Due soon or in progress", icon: ClipboardCheck, gradient: "from-amber-600/80 to-orange-800/90", iconColor: "text-amber-300", delay: 0.2 },
  { key: "totalProjects", label: "Total projects", hint: "Active workspaces", icon: FolderKanban, gradient: "from-violet-600/80 to-purple-800/90", iconColor: "text-violet-300", delay: 0.3 },
];

function StatCard({ config, value, index }) {
  const Icon = config.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: config.delay, type: "spring", stiffness: 120 }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-6 backdrop-blur-xl ${config.gradient}`}
    >
      <motion.div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, delay: index * 0.5 }}
      />
      <div className="relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
          <Icon className={`h-6 w-6 ${config.iconColor}`} />
        </div>
        <p className="mt-4 text-sm font-medium text-white/70">{config.label}</p>
        <p className="mt-2 text-4xl font-black text-white">{value ?? 0}</p>
        <p className="mt-1 text-xs text-white/50">{config.hint}</p>
      </div>
    </motion.div>
  );
}

function AdminDashboard() {
  const { logout, user, request } = useAuth();
  const navigate = useNavigate();

  const fetchOverview = useCallback(() => request("/api/admin/overview"), [request]);

  const handlePollError = usePollingErrorHandler("Could not load admin dashboard");

  const { data, loading, refreshing, lastUpdated } = useRealtimePolling(fetchOverview, {
    onError: handlePollError,
  });

  const stats = data?.stats ?? {};
  const recentTasks = data?.recentTasks ?? [];

  const lastSyncLabel = useMemo(() => (lastUpdated ? lastUpdated.toLocaleTimeString() : null), [lastUpdated]);

  if (loading && !data) {
    return <LoadingState label="Loading admin dashboard..." />;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b1120] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <motion.div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:px-6">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <motion.div>
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-300/90">
                <Sparkles className="h-3.5 w-3.5" />
                Admin Console
              </p>
              <h1 className="text-3xl font-black text-white md:text-4xl">Admin Dashboard</h1>
              <p className="text-sm text-slate-400">
                {user?.name ? `Signed in as ${user.name}` : "Platform overview"}
              </p>
            </motion.div>
            </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                refreshing ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300" : "border-white/10 bg-white/5 text-slate-400"
              }`}
            >
              <Radio className={`h-3 w-3 ${refreshing ? "animate-pulse" : ""}`} />
              Live{lastSyncLabel ? ` · ${lastSyncLabel}` : ""}
            </span>
            <button
              type="button"
              onClick={() => { logout(); navigate("/select-role"); }}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 p-8 backdrop-blur-2xl"
        >
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/90">Overview</p>
              <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">Platform health at a glance</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                Live metrics from your database — auto-refreshes every 15 seconds.
              </p>
            </div>
            <motion.div
              className="hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md md:block"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Activity className="h-10 w-10 text-emerald-400" />
            </motion.div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {STAT_CONFIG.map((config, index) => (
            <StatCard key={config.key} config={config} value={stats[config.key]} index={index} />
          ))}
        </div>

        <section className="mt-8">
          <h3 className="mb-4 text-lg font-semibold text-white">Recent task activity</h3>
          {recentTasks.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center text-sm text-slate-500">
              No tasks yet. Create tasks from the main app to see activity here.
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <table className="min-w-full text-sm">
                <thead className="border-b border-white/10 bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Task</th>
                    <th className="px-5 py-3">Project</th>
                    <th className="px-5 py-3">Assignee</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTasks.map((task) => (
                    <tr key={task._id} className="border-b border-white/5">
                      <td className="px-5 py-4 font-medium text-white">{task.title}</td>
                      <td className="px-5 py-4 text-slate-300">{task.project?.name}</td>
                      <td className="px-5 py-4 text-slate-300">{task.assignedTo?.name}</td>
                      <td className="px-5 py-4"><Badge value={task.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
