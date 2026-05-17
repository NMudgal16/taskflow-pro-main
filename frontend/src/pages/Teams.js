import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Shield, Radio } from "lucide-react";
import Badge from "../components/Badge";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";
import useRealtimePolling from "../hooks/useRealtimePolling";
import usePollingErrorHandler from "../hooks/usePollingErrorHandler";

const Teams = () => {
  const { request } = useAuth();

  const fetchMembers = useCallback(async () => {
    const projects = await request("/api/projects");
    const allMembers = new Map();
    projects.forEach((project) => {
      project.members?.forEach((member) => {
        if (!allMembers.has(member._id)) {
          allMembers.set(member._id, member);
        }
      });
    });
    return Array.from(allMembers.values());
  }, [request]);

  const handlePollError = usePollingErrorHandler("Could not load team members");

  const { data: membersData, loading, refreshing, lastUpdated } = useRealtimePolling(
    fetchMembers,
    { onError: handlePollError }
  );

  const members = membersData ?? [];

  const lastSyncLabel = useMemo(() => {
    if (!lastUpdated) return null;
    return lastUpdated.toLocaleTimeString();
  }, [lastUpdated]);

  if (loading && !membersData) return <LoadingState label="Loading team members..." />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1120] px-2 text-white">
      <div className="absolute left-[-100px] top-[-100px] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-[-100px] right-[-100px] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-fuchsia-500/10" />
        <motion.div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Collaboration</p>
            <h1 className="mt-4 text-5xl font-black leading-tight">Team Members</h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Members from your projects, updated live.
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
              refreshing
                ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-300"
                : "border-white/10 bg-white/5 text-slate-400"
            }`}
          >
            <Radio className={`h-3 w-3 ${refreshing ? "animate-pulse" : ""}`} />
            Live{lastSyncLabel ? ` · ${lastSyncLabel}` : ""}
          </span>
        </motion.div>
      </motion.section>

      <PageHeader
        eyebrow="Organization"
        title="Team"
        description="Collaborate with your team members."
      />

      <section>
        {members.length === 0 ? (
          <EmptyState
            title="No team members yet"
            message="Team members will appear here once added to projects or registered."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, index) => (
              <motion.article
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30">
                    <Users className="h-6 w-6 text-cyan-300" />
                  </div>
                  <Badge value={member.role === "admin" ? "Admin" : "Member"} />
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">{member.name}</h3>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </p>
                {member.role === "admin" && (
                  <p className="mt-3 flex items-center gap-1 text-xs text-emerald-400">
                    <Shield className="h-3.5 w-3.5" />
                    Platform administrator
                  </p>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Teams;
