import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
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

const Tasks = () => {
  const { isAdmin, request } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const createTask = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await request("/api/tasks", { method: "POST", body: JSON.stringify(form) });
      setForm(initialForm);
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
    <>
      <section className="mb-6 overflow-hidden rounded-md border border-slate-200 bg-white shadow-soft">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <div
            className="hidden min-h-52 bg-cover bg-center lg:block"
            style={{ backgroundImage: "linear-gradient(90deg, rgba(15,23,42,0.3), rgba(15,23,42,0.05)), url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80')" }}
          />
          <div className="p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Task pipeline</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">Focus the next move</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Priority, status, owner, and due date stay visible so every handoff has context.</p>
          </div>
        </div>
      </section>

      <PageHeader
        eyebrow="Task management"
        title="Tasks"
        description={isAdmin ? "Create, assign, and monitor work across every project." : "Update the status of the tasks assigned to you."}
      />

      {isAdmin && (
        <form onSubmit={createTask} className="mb-6 rounded-md border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
          <div className="grid gap-3 lg:grid-cols-2">
            <input className="form-input" placeholder="Task title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            <input className="form-input" placeholder="Task description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
            <select className="form-input" value={form.project} onChange={(event) => setForm({ ...form, project: event.target.value, assignedTo: "" })} required>
              <option value="">Select project</option>
              {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
            </select>
            <select className="form-input" value={form.assignedTo} onChange={(event) => setForm({ ...form, assignedTo: event.target.value })} required disabled={!selectedProject}>
              <option value="">Select assignee</option>
              {selectedProject?.members?.map((member) => <option key={member._id} value={member._id}>{member.name} ({member.email})</option>)}
            </select>
            <select className="form-input" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <select className="form-input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option>Todo</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
            <input className="form-input" type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required />
            <button className="btn-primary" type="submit" disabled={saving}>{saving ? "Creating..." : "Create Task"}</button>
          </div>
        </form>
      )}

      {tasks.length === 0 ? (
        <EmptyState title="No tasks yet" message={isAdmin ? "Create a task after adding members to a project." : "Assigned tasks will appear here."} />
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <article key={task._id} className={`overflow-hidden rounded-md border shadow-sm ${task.status === "Overdue" ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}`}>
              <div className="h-1.5" style={{ background: task.status === "Overdue" ? "#ef4444" : "var(--accent)" }} />
              <div className="p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">{task.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge value={task.status} />
                    <Badge type="priority" value={task.priority} />
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{task.project?.name}</span>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">Due {new Date(task.dueDate).toLocaleDateString()}</span>
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
                  {isAdmin && <button className="btn-danger" type="button" onClick={() => deleteTask(task._id)}>Delete</button>}
                </div>
              </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
};

export default Tasks;
