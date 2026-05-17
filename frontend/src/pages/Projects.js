import { useCallback, useMemo, useState } from "react";
import { Folder, Plus, Search, Trash2, UserPlus, X } from "lucide-react";
import toast from "react-hot-toast";
import LoadingState from "../components/LoadingState";
import { useAuth } from "../context/AuthContext";
import useRealtimePolling from "../hooks/useRealtimePolling";
import usePollingErrorHandler from "../hooks/usePollingErrorHandler";

const filters = ["All", "active", "on hold", "completed", "cancelled"];

const ProjectFormModal = ({ form, saving, setForm, onClose, onSubmit }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-8 backdrop-blur-sm">
    <form onSubmit={onSubmit} className="w-full max-w-[520px] overflow-hidden rounded-xl border border-[#303852] bg-[#1b1f2b] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between border-b border-[#303852] px-5 py-4">
        <h2 className="text-xl font-bold text-white">New Project</h2>
        <button type="button" onClick={onClose} className="rounded-md p-1 text-slate-500 transition hover:bg-[#252b40] hover:text-white" aria-label="Close new project form">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4 px-5 py-5">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Project Name *</span>
          <input className="mt-2 h-11 w-full rounded-lg border border-[#303852] bg-[#252b40] px-4 text-base font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30" placeholder="My awesome project..." value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Description</span>
          <textarea className="mt-2 min-h-[82px] w-full resize-none rounded-lg border border-[#303852] bg-[#252b40] px-4 py-3 text-base font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30" placeholder="What is this project about..." value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Status</span>
            <select className="mt-2 h-11 w-full rounded-lg border border-[#303852] bg-[#252b40] px-4 text-base font-bold text-white outline-none transition focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="active">Active</option>
              <option value="on hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Priority</span>
            <select className="mt-2 h-11 w-full rounded-lg border border-[#303852] bg-[#252b40] px-4 text-base font-bold text-white outline-none transition focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Deadline</span>
            <input className="mt-2 h-11 w-full rounded-lg border border-[#303852] bg-[#252b40] px-4 text-base font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30" type="date" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Tags (comma separated)</span>
            <input className="mt-2 h-11 w-full rounded-lg border border-[#303852] bg-[#252b40] px-4 text-base font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30" placeholder="design, frontend..." value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} />
          </label>
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row">
          <button className="h-11 flex-1 rounded-lg bg-[#5268ff] px-4 text-base font-bold text-white shadow-[0_12px_30px_rgba(82,104,255,0.35)] transition hover:bg-[#6377ff] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Project"}
          </button>
          <button className="h-11 rounded-lg border border-[#303852] bg-[#252b40] px-5 text-base font-bold text-slate-200 transition hover:bg-[#303852]" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  </div>
);

const Projects = () => {
  const { isAdmin, request } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [form, setForm] = useState({ name: "", description: "", status: "active", priority: "Medium", deadline: "", tags: "" });
  const [memberEmails, setMemberEmails] = useState({});

  const fetchProjects = useCallback(
    () => request("/api/projects"),
    [request]
  );

  const handlePollError = usePollingErrorHandler("Could not load projects");

  const { data: projectsData, loading, refresh } = useRealtimePolling(fetchProjects, {
    onError: handlePollError,
  });

  const projects = projectsData ?? [];

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (projectsData ?? []).filter((project) => {
      const matchesSearch = !query || project.name?.toLowerCase().includes(query) || project.description?.toLowerCase().includes(query);
      const projectStatus = project.status || "active";
      const matchesFilter = activeFilter === "All" || projectStatus === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, projectsData, search]);

  const createProject = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await request("/api/projects", { method: "POST", body: JSON.stringify({ name: form.name, description: form.description }) });
      setForm({ name: "", description: "", status: "active", priority: "Medium", deadline: "", tags: "" });
      setShowForm(false);
      toast.success("Project created");
      refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const addMember = async (projectId) => {
    try {
      await request(`/api/projects/${projectId}/members`, {
        method: "POST",
        body: JSON.stringify({ email: memberEmails[projectId] })
      });
      setMemberEmails({ ...memberEmails, [projectId]: "" });
      toast.success("Member added");
      refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await request(`/api/projects/${projectId}`, { method: "DELETE" });
      toast.success("Project deleted");
      refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeMember = async (projectId, memberId) => {
    try {
      await request(`/api/projects/${projectId}/members/${memberId}`, { method: "DELETE" });
      toast.success("Member removed");
      refresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading && !projectsData) return <LoadingState label="Loading projects..." />;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#0f1118] text-slate-200">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
          <p className="mt-2 text-lg font-medium text-slate-500">{projects.length} projects total</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="inline-flex items-center justify-center gap-3 rounded-lg bg-[#5268ff] px-6 py-3 text-lg font-bold text-white shadow-[0_10px_24px_rgba(82,104,255,0.35)] transition hover:bg-[#6377ff]"
        >
          <Plus className="h-5 w-5" />
          New Project
        </button>
      </header>

      <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center">
        <label className="relative block w-full max-w-[400px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            className="h-[52px] w-full rounded-lg border border-[#303852] bg-[#252b40] pl-12 pr-4 text-lg font-medium text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-[#5268ff] focus:ring-2 focus:ring-[#5268ff]/30"
            placeholder="Search projects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`h-[37px] rounded-lg border px-4 text-base font-bold transition ${
                activeFilter === filter
                  ? "border-[#5268ff] bg-[#5268ff] text-white"
                  : "border-[#303852] bg-[#252b40] text-slate-300 hover:border-[#5268ff]/70 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {showForm && <ProjectFormModal form={form} saving={saving} setForm={setForm} onClose={() => setShowForm(false)} onSubmit={createProject} />}

      {filteredProjects.length === 0 ? (
        <section className="flex min-h-[520px] items-center justify-center text-center">
          <div>
            <Folder className="mx-auto h-14 w-14 text-slate-700" />
            <h2 className="mt-7 text-2xl font-semibold text-slate-300">No projects found</h2>
            <p className="mt-4 text-lg font-medium text-slate-600">Create your first project to get started</p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-8 inline-flex items-center justify-center gap-3 rounded-lg bg-[#5268ff] px-6 py-3 text-lg font-bold text-white shadow-[0_12px_30px_rgba(82,104,255,0.35)] transition hover:bg-[#6377ff]"
            >
              <Plus className="h-5 w-5" />
              Create Project
            </button>
          </div>
        </section>
      ) : (
        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {filteredProjects.map((project) => (
            <article key={project._id} className="overflow-hidden rounded-xl border border-[#303852] bg-[#1b2030] shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
              <div className="h-1.5 bg-[#5268ff]" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{project.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{project.description}</p>
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => deleteProject(project._id)}
                      className="rounded-lg border border-red-500/25 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
                      aria-label={`Delete ${project.name}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Members</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.members?.length ? project.members.map((member) => (
                      <span key={member._id} className="inline-flex items-center gap-2 rounded-lg bg-[#252b40] px-3 py-1.5 text-xs font-semibold text-slate-300">
                        {member.name} ({member.email})
                        {isAdmin && (
                          <button
                            type="button"
                            className="text-slate-500 transition hover:text-red-300"
                            onClick={() => removeMember(project._id, member._id)}
                            aria-label={`Remove ${member.name}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </span>
                    )) : <span className="text-sm text-slate-600">No members added</span>}
                  </div>
                </div>

                {isAdmin && (
                  <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
                    <input className="form-input" type="email" placeholder="member@email.com" value={memberEmails[project._id] || ""} onChange={(event) => setMemberEmails({ ...memberEmails, [project._id]: event.target.value })} />
                    <button className="btn-secondary gap-2" type="button" onClick={() => addMember(project._id)}>
                      <UserPlus className="h-4 w-4" />
                      Add Member
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
