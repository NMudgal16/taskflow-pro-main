import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Users, Mail, Shield } from "lucide-react";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

const Teams = () => {
  const { request, user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const projects = await request("/api/projects");
      const allMembers = new Map();

      projects.forEach((project) => {
        project.members?.forEach((member) => {
          if (!allMembers.has(member._id)) {
            allMembers.set(member._id, member);
          }
        });
      });

      setMembers(Array.from(allMembers.values()));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  if (loading) return <LoadingState label="Loading team members..." />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1120] px-2 text-white">
      {/* Animated Background */}
      <div className="absolute left-[-100px] top-[-100px] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"></div>
      <div className="absolute bottom-[-100px] right-[-100px] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl"></div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-fuchsia-500/10"></div>
        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Collaboration</p>
          <h1 className="mt-4 text-5xl font-black leading-tight">
            Team Members 👥
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            View and manage all team members across your projects.
          </p>
        </div>
      </motion.section>

      <PageHeader
        eyebrow="Organization"
        title="Team"
        description="Collaborate with your team members."
      />

      {/* Members Grid */}
      <section>
        {members.length === 0 ? (
          <EmptyState
            title="No team members yet"
            message="Team members from your projects will appear here."
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {members.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white">
                      {member.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{member.name}</h3>
                      <p className="flex items-center gap-2 text-sm text-slate-400">
                        <Mail size={14} />
                        {member.email}
                      </p>
                    </div>
                  </div>
                  {member.role && (
                    <Badge
                      value={member.role}
                      type={member.role === "admin" ? "priority" : "status"}
                    />
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                  <Shield size={16} />
                  <span>{member.role === "admin" ? "Administrator" : "Team Member"}</span>
                </div>

                <div className="mt-4 text-xs text-slate-500">
                  Joined {new Date(member.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Teams;
