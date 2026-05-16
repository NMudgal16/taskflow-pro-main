import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import Badge from "../components/Badge";
import LoadingState from "../components/LoadingState";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  title: "",
  description: "",
  project: "",
  assignedTo: "",
  priority: "Medium",
  status: "Todo",
  dueDate: ""
};

const statusOptions = ["All Status", "Todo", "In Progress", "Review", "Done"];
const priorityOptions = ["All Priority", "Low", "Medium", "High"];

const TaskFormModal = ({ form, projects, saving, selectedProject, setForm, onClose, onSubmit }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-sm">
    <form onSubmit={onSubmit} className="w-full max-w-[632px] overflow-hidden rounded-2xl border border-[#303852] bg-[#1b1f2b] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between border-b border-[#303852] px-6 py-5">
        <h2 className="text-2xl font-bold text-white">New Task</h2>
        <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-500 transition hover:bg-[#252b40] hover:text-white" aria-label="Close new task form">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-5 px-6 py-8">
        <label className="block">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Task Title *</span>
          <input className="mt-2 h-[52px] w-full rounded-lg border border-[#303852] bg-[#252b40] px-5 text-lg font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30" placeholder="What needs to be done..." value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
        </label>

        <label className="block">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Description</span>
          <textarea className="mt-2 min-h-[102px] w-full resize-none rounded-lg border border-[#303852] bg-[#252b40] px-5 py-4 text-lg font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30" placeholder="Add task details..." value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Project</span>
            <select className="mt-2 h-[52px] w-full rounded-lg border border-[#303852] bg-[#252b40] px-5 text-lg font-bold text-white outline-none transition focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30" value={form.project} onChange={(event) => setForm({ ...form, project: event.target.value, assignedTo: "" })} required>
              <option value="">Select project</option>
              {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Assignee</span>
            <select className="mt-2 h-[52px] w-full rounded-lg border border-[#303852] bg-[#252b40] px-5 text-lg font-bold text-white outline-none transition focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30 disabled:opacity-50" value={form.assignedTo} onChange={(event) => setForm({ ...form, assignedTo: event.target.value })} required disabled={!selectedProject}>
              <option value="">Select assignee</option>
              {selectedProject?.members?.map((member) => <option key={member._id} value={member._id}>{member.name} ({member.email})</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Status</span>
            <select className="mt-2 h-[52px] w-full rounded-lg border border-[#303852] bg-[#252b40] px-5 text-lg font-bold text-white outline-none transition focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option>Todo</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Priority</span>
            <select className="mt-2 h-[52px] w-full rounded-lg border border-[#303852] bg-[#252b40] px-5 text-lg font-bold text-white outline-none transition focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-300">Deadline</span>
            <input className="mt-2 h-[52px] w-full rounded-lg border border-[#303852] bg-[#252b40] px-5 text-lg font-bold text-white outline-none transition focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30" type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required />
          </label>
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <button className="h-12 flex-1 rounded-lg bg-[#5268ff] px-5 text-lg font-bold text-white shadow-[0_12px_30px_rgba(82,104,255,0.35)] transition hover:bg-[#6377ff] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Task"}
          </button>
          <button className="h-12 rounded-lg border border-[#303852] bg-[#252b40] px-6 text-lg font-bold text-slate-200 transition hover:bg-[#303852]" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
);

const Tasks = () => {
  const { isAdmin, request } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [form, setForm] = useState(initialForm);

  const selectedProject = useMemo(() => {
    return projects.find((project) => project._id === form.project);
  }, [projects, form.project]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [taskData, projectData] = await Promise.all([
        request("/api/tasks"),
        request("/api/projects")
      ]);
      setTasks(taskData);
      setProjects(projectData);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch = !query || task.title?.toLowerCase().includes(query) || task.description?.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "All Status" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "All Priority" || task.priority === priorityFilter;
      const matchesOverdue = !overdueOnly || task.status === "Overdue";
      return matchesSearch && matchesStatus && matchesPriority && matchesOverdue;
    });
  }, [overdueOnly, priorityFilter, search, statusFilter, tasks]);

  const createTask = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await request("/api/tasks", { method: "POST", body: JSON.stringify(form) });
      setForm(initialForm);
      setShowForm(false);
      toast.success("Task created");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await request(`/api/tasks/${taskId}`, { method: "PUT", body: JSON.stringify({ status }) });
      toast.success("Task updated");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await request(`/api/tasks/${taskId}`, { method: "DELETE" });
      toast.success("Task deleted");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <LoadingState label="Loading tasks..." />;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#0f1118] text-slate-200">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Tasks</h1>
          <p className="mt-2 text-lg font-medium text-slate-500">{tasks.length} tasks</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#5268ff] px-6 py-3 text-lg font-bold text-white shadow-[0_10px_24px_rgba(82,104,255,0.35)] transition hover:bg-[#6377ff]"
        >
          <Plus className="h-5 w-5" />
          New Task
        </button>
      </header>

      <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center">
        <label className="relative block w-full max-w-[400px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            className="h-[52px] w-full rounded-lg border border-[#303852] bg-[#252b40] pl-12 pr-4 text-lg font-medium text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30"
            placeholder="Search tasks..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select className="h-[52px] rounded-lg border border-[#5268ff] bg-[#252b40] px-6 text-lg font-bold text-white outline-none transition focus:ring-2 focus:ring-[#5268ff]/30" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          {statusOptions.map((status) => <option key={status}>{status}</option>)}
        </select>

        <select className="h-[52px] rounded-lg border border-[#303852] bg-[#252b40] px-6 text-lg font-bold text-white outline-none transition focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
          {priorityOptions.map((priority) => <option key={priority}>{priority}</option>)}
        </select>

        <button
          type="button"
          onClick={() => setOverdueOnly((current) => !current)}
          className={`h-[49px] rounded-lg border px-5 text-lg font-bold transition ${
            overdueOnly
              ? "border-red-500 bg-red-500 text-white"
              : "border-red-500/40 bg-red-950/40 text-red-300 hover:bg-red-900/60"
          }`}
        >
          Overdue Only
        </button>
      </div>

      {showForm && (
        <TaskFormModal
          form={form}
          projects={projects}
          saving={saving}
          selectedProject={selectedProject}
          setForm={setForm}
          onClose={() => setShowForm(false)}
          onSubmit={createTask}
        />
      )}

      {filteredTasks.length === 0 ? (
        <section className="flex min-h-[520px] items-center justify-center text-center">
          <div>
            <h2 className="text-2xl font-semibold text-slate-500">No tasks found</h2>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-6 inline-flex items-center justify-center gap-3 rounded-lg bg-[#5268ff] px-6 py-3 text-lg font-bold text-white shadow-[0_12px_30px_rgba(82,104,255,0.35)] transition hover:bg-[#6377ff]"
            >
              <Plus className="h-5 w-5" />
              Create Task
            </button>
          </div>
        </section>
      ) : (
        <div className="mt-8 grid gap-5">
          {filteredTasks.map((task) => (
            <article key={task._id} className={`overflow-hidden rounded-xl border shadow-[0_18px_44px_rgba(0,0,0,0.18)] ${task.status === "Overdue" ? "border-red-500/30 bg-red-950/30" : "border-[#303852] bg-[#1b2030]"}`}>
              <div className="h-1.5" style={{ background: task.status === "Overdue" ? "#ef4444" : "#5268ff" }} />
              <div className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{task.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{task.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge value={task.status} />
                      <Badge type="priority" value={task.priority} />
                      <span className="rounded-lg bg-[#252b40] px-3 py-1.5 text-xs font-semibold text-slate-300">{task.project?.name}</span>
                      <span className="rounded-lg bg-[#252b40] px-3 py-1.5 text-xs font-semibold text-slate-300">Due {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">Assigned to {task.assignedTo?.name} ({task.assignedTo?.email})</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                    <select className="form-input min-w-40" value={task.status} onChange={(event) => updateStatus(task._id, event.target.value)}>
                      <option>Todo</option>
                      <option>In Progress</option>
                      <option>Done</option>
                      <option>Overdue</option>
                    </select>
                    {isAdmin && (
                      <button className="rounded-lg border border-red-500/25 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20" type="button" onClick={() => deleteTask(task._id)} aria-label={`Delete ${task.title}`}>
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
