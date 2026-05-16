const statusColors = {
  Todo: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
  "In Progress": "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/60 dark:text-blue-200 dark:ring-blue-800",
  Done: "bg-green-50 text-green-700 ring-green-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:ring-emerald-800",
  Overdue: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/60 dark:text-red-200 dark:ring-red-800"
};

const priorityColors = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:ring-emerald-800",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:ring-amber-800",
  High: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:ring-rose-800"
};

const Badge = ({ type = "status", value }) => {
  const colorMap = type === "priority" ? priorityColors : statusColors;
  return (
    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ring-1 transition-colors duration-300 ${colorMap[value] || "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"}`}>
      {value}
    </span>
  );
};

export default Badge;
