import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const statItems = [
  { label: "Total taskers", value: "—" },
  { label: "Total tasks", value: "—" },
  { label: "Pending reviews", value: "—" }
];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/select-role");
  };

  return (
    <div className="min-h-screen bg-[#0f1118] text-slate-200 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-400">Overview of platform metrics</p>
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="rounded-md bg-[#242a42] px-4 py-2 text-slate-300 hover:bg-[#2c334a] transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {statItems.map((s) => (
            <div key={s.label} className="rounded-xl bg-[#0b0d12] p-6 border border-slate-800">
              <div className="text-sm text-slate-400">{s.label}</div>
              <div className="mt-3 text-3xl font-bold text-white">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm text-slate-400">Note: Replace stats with real data from API when available.</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
