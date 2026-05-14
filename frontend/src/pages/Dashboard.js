import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

const StatCard = ({ label, value, tone }) => {
  const tones = {
    slate: "border-slate-200 bg-white text-slate-950",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
    blue: "border-sky-200 bg-sky-50 text-sky-800",
    red: "border-rose-200 bg-rose-50 text-rose-800"
  };

  return (
    <div className={`rounded-md border p-5 shadow-sm ${tones[tone]}`}>
      <p className="text-sm font-semibold opacity-75">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
};

const Dashboard = () => {
  const { request, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ status: "", priority: "", project: "" });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => value && params.append(key, value));
      const [taskData, projectData] = await Promise.all([
        request(`/api/tasks${params.toString() ? `?${params}` : ""}`),
        request("/api/projects")
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

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((task) => task.status === "Done").length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    overdue: tasks.filter((task) => task.status === "Overdue").length
  }), [tasks]);

  if (loading) return <LoadingState label="Loading dashboard..." />;

  return (
    <>
      <section className="visual-hero mb-6 overflow-hidden rounded-md p-6 text-white shadow-soft">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wide text-white/75">{user?.role === "admin" ? "Admin overview" : "My workload"}</p>
          <h1 className="mt-2 text-3xl font-bold">Work that moves together</h1>
          <p className="mt-3 text-sm leading-6 text-white/85">Plan projects, assign clear ownership, and keep overdue work visible before it becomes a blocker.</p>
        </div>
      </section>

      <PageHeader
        eyebrow={user?.role === "admin" ? "Admin overview" : "My workload"}
        title="Dashboard"
        description="Track project work, overdue items, and team delivery from one place."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Tasks" value={stats.total} tone="slate" />
        <StatCard label="Completed" value={stats.completed} tone="green" />
        <StatCard label="In Progress" value={stats.inProgress} tone="blue" />
        <StatCard label="Overdue" value={stats.overdue} tone="red" />
      </div>

      <section className="mt-6 rounded-md border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
        <div className="grid gap-3 md:grid-cols-3">
          <select className="form-input" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="">All statuses</option>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Done</option>
            <option>Overdue</option>
          </select>
          <select className="form-input" value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value })}>
            <option value="">All priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select className="form-input" value={filters.project} onChange={(event) => setFilters({ ...filters, project: event.target.value })}>
            <option value="">All projects</option>
            {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
          </select>
        </div>
      </section>

      <section className="mt-6">
        {tasks.length === 0 ? (
          <EmptyState title="No tasks found" message="Tasks matching the selected filters will appear here." />
        ) : (
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-soft">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Task</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">Assignee</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.map((task) => (
                    <tr key={task._id} className={task.status === "Overdue" ? "bg-red-50" : "bg-white"}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{task.title}</td>
                      <td className="px-4 py-3 text-slate-600">{task.project?.name}</td>
                      <td className="px-4 py-3 text-slate-600">{task.assignedTo?.name}</td>
                      <td className="px-4 py-3"><Badge type="priority" value={task.priority} /></td>
                      <td className="px-4 py-3"><Badge value={task.status} /></td>
                      <td className="px-4 py-3 text-slate-600">{new Date(task.dueDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Dashboard;
