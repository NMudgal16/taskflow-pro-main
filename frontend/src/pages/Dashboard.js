import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import toast from "react-hot-toast";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  CheckCircle,
  Clock3,
  AlertTriangle,
  FolderKanban,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Star,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Sparkles,
} from "lucide-react";

import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

// 3D Stats Card with tilt effect
const StatCard3D = ({ label, value, icon, gradient, trend, trendValue, delay }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glowIntensity, setGlowIntensity] = useState(0);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 5;
      const rotateX = ((centerY - y) / centerY) * 5;
      setRotation({ x: rotateX, y: rotateY });
      setGlowIntensity(Math.max(Math.abs(rotateX / 5), Math.abs(rotateY / 5)));
    }
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlowIntensity(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(6,182,212,${glowIntensity * 0.3})`,
      }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 p-6 backdrop-blur-xl ${gradient} transition-all duration-200`}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white/70">{label}</p>
            <h2 className="mt-2 text-4xl font-black text-white">{value}</h2>
            {trend && (
              <div className="mt-2 flex items-center gap-1">
                {trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-rose-400" />
                )}
                <span className={`text-xs ${trend === "up" ? "text-emerald-400" : "text-rose-400"}`}>
                  {trendValue} from last month
                </span>
              </div>
            )}
          </div>
          <div className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur-md">
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 3D Progress Ring Component
const ProgressRing = ({ value, label, color, delay }) => {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="relative flex flex-col items-center"
    >
      <svg className="h-32 w-32 -rotate-90 transform">
        <circle
          cx="64"
          cy="64"
          r="40"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="64"
          cy="64"
          r="40"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ delay: delay + 0.3, duration: 1.5, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.8 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="text-2xl font-bold text-white">{Math.round(value)}%</span>
      </motion.div>
      <p className="mt-2 text-sm text-slate-300">{label}</p>
    </motion.div>
  );
};

// Analytics Chart Component
const AnalyticsChart = ({ tasks }) => {
  const priorityData = useMemo(() => {
    const high = tasks.filter(t => t.priority === "High").length;
    const medium = tasks.filter(t => t.priority === "Medium").length;
    const low = tasks.filter(t => t.priority === "Low").length;
    const total = tasks.length || 1;
    return [
      { label: "High", value: (high / total) * 100, color: "#ef4444", count: high },
      { label: "Medium", value: (medium / total) * 100, color: "#f59e0b", count: medium },
      { label: "Low", value: (low / total) * 100, color: "#10b981", count: low },
    ];
  }, [tasks]);

  const weeklyData = [
    { day: "Mon", value: 65, color: "#06b6d4" },
    { day: "Tue", value: 72, color: "#8b5cf6" },
    { day: "Wed", value: 58, color: "#06b6d4" },
    { day: "Thu", value: 84, color: "#8b5cf6" },
    { day: "Fri", value: 78, color: "#d946ef" },
    { day: "Sat", value: 45, color: "#06b6d4" },
    { day: "Sun", value: 52, color: "#f59e0b" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-8 grid gap-6 lg:grid-cols-2"
    >
      {/* Weekly Activity */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-cyan-400" />
          Weekly Activity
        </h3>
        <div className="grid gap-4">
          {weeklyData.map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>{item.day}</span>
                <span>{item.value}%</span>
              </div>
              <div className="h-4 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
          <PieChart className="h-5 w-5 text-fuchsia-400" />
          Priority Distribution
        </h3>
        <div className="space-y-4">
          {priorityData.map((item, i) => (
            <motion.div
              key={i}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.8 }}
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{item.label}</span>
                <span className="text-white font-semibold">{item.count} tasks</span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
              <div className="text-right text-xs text-slate-400 mt-1">{item.value.toFixed(1)}%</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Productivity Score Component
const ProductivityScore = ({ tasks }) => {
  const score = useMemo(() => {
    const completed = tasks.filter(t => t.status === "Done").length;
    const total = tasks.length || 1;
    const onTime = tasks.filter(t => t.status === "Done" && new Date(t.dueDate) >= new Date()).length;
    return Math.round(((completed / total) * 0.6 + (onTime / completed || 0) * 0.4) * 100);
  }, [tasks]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-cyan-500/10 p-6 backdrop-blur-2xl"
    >
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-500 p-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Productivity Score</h3>
            <p className="text-sm text-slate-300">Based on task completion and timeliness</p>
          </div>
        </div>
        <div className="relative">
          <svg className="h-24 w-24 -rotate-90 transform">
            <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - score / 100) }}
              transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
              style={{ strokeDasharray: 2 * Math.PI * 40 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </svg>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
              {score}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { request, user } = useAuth();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    project: "",
  });

  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(
        ([key, value]) => value && params.append(key, value)
      );

      const [taskData, projectData] = await Promise.all([
        request(`/api/tasks${params.toString() ? `?${params}` : ""}`),
        request("/api/projects"),
      ]);

      setTasks(taskData);
      setProjects(projectData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [filters, request]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((task) => task.status === "Done").length,
      inProgress: tasks.filter((task) => task.status === "In Progress").length,
      overdue: tasks.filter((task) => task.status === "Overdue").length,
    }),
    [tasks]
  );

  if (loading) return <LoadingState label="Loading dashboard..." />;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b1120] px-4 py-6 text-white md:px-6">
      {/* Background glow */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_40%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.12),_transparent_40%)]" />
      </div>

      {/* Animated gradient overlays */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute left-[-100px] top-[-100px] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
      </motion.div>

      <div className="relative z-10">
        {/* Hero Section with Particle Effect */}
        <motion.section
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-cyan-500/10 p-8 backdrop-blur-2xl"
        >
          <div className="absolute inset-0 opacity-20"></div>
          
          <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-cyan-300">
                <Sparkles className="h-4 w-4" />
                {user?.role === "admin" ? "Admin Overview" : "My Workspace"}
              </p>
              <h1 className="mt-4 text-5xl font-black leading-tight md:text-6xl">
                Crazy Productivity
                <br />
                Dashboard <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">⚡</span>
              </h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                Track projects, monitor deadlines, and manage your entire workflow
                with futuristic visuals and real-time updates.
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="hidden md:block"
            >
              <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 p-4 backdrop-blur-md">
                <Activity className="h-12 w-12 text-cyan-400" />
              </div>
            </motion.div>
          </div>
        </motion.section>

        <PageHeader
          eyebrow="Workspace"
          title="Dashboard"
          description="Manage everything beautifully."
        />

        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard3D
            label="Total Tasks"
            value={stats.total}
            icon={<FolderKanban size={30} />}
            gradient="bg-gradient-to-br from-slate-800 to-slate-900"
            trend="up"
            trendValue="12%"
            delay={0}
          />
          <StatCard3D
            label="Completed"
            value={stats.completed}
            icon={<CheckCircle size={30} />}
            gradient="bg-gradient-to-br from-emerald-500 to-green-700"
            trend="up"
            trendValue="8%"
            delay={0.1}
          />
          <StatCard3D
            label="In Progress"
            value={stats.inProgress}
            icon={<Clock3 size={30} />}
            gradient="bg-gradient-to-br from-cyan-500 to-blue-700"
            delay={0.2}
          />
          <StatCard3D
            label="Overdue"
            value={stats.overdue}
            icon={<AlertTriangle size={30} />}
            gradient="bg-gradient-to-br from-rose-500 to-red-700"
            trend="down"
            trendValue="5%"
            delay={0.3}
          />
        </div>

        {/* Progress Rings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl md:grid-cols-3"
        >
          <ProgressRing 
            value={(stats.completed / stats.total) * 100 || 0} 
            label="Completion Rate" 
            color="#10b981"
            delay={0.5}
          />
          <ProgressRing 
            value={(stats.inProgress / stats.total) * 100 || 0} 
            label="In Progress" 
            color="#06b6d4"
            delay={0.6}
          />
          <ProgressRing 
            value={Math.max(0, 100 - (stats.overdue / stats.total) * 100) || 0} 
            label="On Track" 
            color="#f59e0b"
            delay={0.7}
          />
        </motion.div>

        {/* Productivity Score */}
        <ProductivityScore tasks={tasks} />

        {/* Analytics Charts */}
        <AnalyticsChart tasks={tasks} />

        {/* Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <select
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none backdrop-blur-md transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
              value={filters.status}
              onChange={(event) =>
                setFilters({ ...filters, status: event.target.value })
              }
            >
              <option className="text-black">All statuses</option>
              <option className="text-black">Todo</option>
              <option className="text-black">In Progress</option>
              <option className="text-black">Done</option>
              <option className="text-black">Overdue</option>
            </select>

            <select
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none backdrop-blur-md transition-all duration-300 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40"
              value={filters.priority}
              onChange={(event) =>
                setFilters({ ...filters, priority: event.target.value })
              }
            >
              <option className="text-black">All priorities</option>
              <option className="text-black">Low</option>
              <option className="text-black">Medium</option>
              <option className="text-black">High</option>
            </select>

            <select
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none backdrop-blur-md transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
              value={filters.project}
              onChange={(event) =>
                setFilters({ ...filters, project: event.target.value })
              }
            >
              <option className="text-black">All projects</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id} className="text-black">
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </motion.section>

        {/* Task Table */}
        <section className="mt-8">
          {tasks.length === 0 ? (
            <EmptyState
              title="No tasks found"
              message="Tasks matching filters will appear here."
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-2xl"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-white/10 bg-white/5 text-left uppercase tracking-wider text-slate-300">
                    <tr>
                      <th className="px-6 py-4">Task</th>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Assignee</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, index) => (
                      <motion.tr
                        key={task._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.03 }}
                        whileHover={{
                          scale: 1.01,
                          backgroundColor: "rgba(255,255,255,0.05)",
                        }}
                        className={`border-b border-white/5 transition-all ${
                          task.status === "Overdue"
                            ? "bg-red-500/10"
                            : "bg-transparent"
                        }`}
                      >
                        <td className="px-6 py-5 font-bold text-white">
                          {task.title}
                        </td>
                        <td className="px-6 py-5 text-slate-300">
                          {task.project?.name}
                        </td>
                        <td className="px-6 py-5 text-slate-300">
                          {task.assignedTo?.name}
                        </td>
                        <td className="px-6 py-5">
                          <Badge type="priority" value={task.priority} />
                        </td>
                        <td className="px-6 py-5">
                          <Badge value={task.status} />
                        </td>
                        <td className="px-6 py-5 text-slate-300">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;