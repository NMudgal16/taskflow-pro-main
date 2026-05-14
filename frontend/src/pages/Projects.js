import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const { isAdmin, request } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [memberEmails, setMemberEmails] = useState({});

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      setProjects(await request("/api/projects"));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await request("/api/projects", { method: "POST", body: JSON.stringify(form) });
      setForm({ name: "", description: "" });
      toast.success("Project created");
      fetchProjects();
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
      fetchProjects();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await request(`/api/projects/${projectId}`, { method: "DELETE" });
      toast.success("Project deleted");
      fetchProjects();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeMember = async (projectId, memberId) => {
    try {
      await request(`/api/projects/${projectId}/members/${memberId}`, { method: "DELETE" });
      toast.success("Member removed");
      fetchProjects();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <LoadingState label="Loading projects..." />;

  return (
    <>
      <section className="mb-6 grid overflow-hidden rounded-md border border-slate-200 bg-white shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Project portfolio</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">Build a cleaner operating rhythm</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Keep every project connected to the people responsible for the work, then assign tasks only to the right team members.</p>
        </div>
        <div
          className="hidden min-h-48 bg-cover bg-center lg:block"
          style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.1), rgba(15,23,42,0.2)), url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80')" }}
        />
      </section>

      <PageHeader
        eyebrow="Project management"
        title="Projects"
        description={isAdmin ? "Create project spaces and add member accounts by email." : "View the projects where you are a member."}
      />

      {isAdmin && (
        <form onSubmit={createProject} className="mb-6 rounded-md border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
          <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
            <input className="form-input" placeholder="Project name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <input className="form-input" placeholder="Project description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
            <button className="btn-primary" type="submit" disabled={saving}>{saving ? "Creating..." : "Create Project"}</button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <EmptyState title="No projects yet" message={isAdmin ? "Create the first project to start assigning team work." : "Ask an admin to add you to a project."} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {projects.map((project) => (
            <article key={project._id} className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
              <div className="h-2" style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-dark))" }} />
              <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">{project.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                </div>
                {isAdmin && <button className="btn-danger" type="button" onClick={() => deleteProject(project._id)}>Delete</button>}
              </div>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Members</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.members?.length ? project.members.map((member) => (
                    <span key={member._id} className="inline-flex items-center gap-2 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {member.name} ({member.email})
                      {isAdmin && (
                        <button
                          type="button"
                          className="font-bold text-slate-500 hover:text-red-600"
                          onClick={() => removeMember(project._id, member._id)}
                          aria-label={`Remove ${member.name}`}
                        >
                          x
                        </button>
                      )}
                    </span>
                  )) : <span className="text-sm text-slate-500">No members added</span>}
                </div>
              </div>

              {isAdmin && (
                <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input className="form-input" type="email" placeholder="member@email.com" value={memberEmails[project._id] || ""} onChange={(event) => setMemberEmails({ ...memberEmails, [project._id]: event.target.value })} />
                  <button className="btn-secondary" type="button" onClick={() => addMember(project._id)}>Add Member</button>
                </div>
              )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
};

export default Projects;
