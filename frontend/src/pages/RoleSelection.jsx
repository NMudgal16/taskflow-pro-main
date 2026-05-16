import React from "react";
import { useNavigate } from "react-router-dom";
import { User, ShieldCheck } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1118] p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
        <button
          onClick={() => navigate("/login")}
          className="group bg-gradient-to-br from-[#0f1724] to-[#111827] border border-slate-800 rounded-xl p-8 flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-[#5268ff] p-3 text-white shadow-[0_10px_24px_rgba(82,104,255,0.2)]">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Login as Tasker</div>
              <div className="text-sm text-slate-400">Access tasker dashboard and manage tasks</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-300 opacity-90 group-hover:text-white">Proceed to tasker login</div>
        </button>

        <button
          onClick={() => navigate("/admin-login")}
          className="group bg-gradient-to-br from-[#0f1724] to-[#111827] border border-slate-800 rounded-xl p-8 flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-[#10b981] p-3 text-white shadow-[0_10px_24px_rgba(16,185,129,0.18)]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Login as Admin</div>
              <div className="text-sm text-slate-400">Access admin panel and manage the platform</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-300 opacity-90 group-hover:text-white">Proceed to admin login</div>
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
