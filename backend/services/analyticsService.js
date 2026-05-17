const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const { getTaskFilterForWorkspace } = require("../utils/workspaceScope");

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CHART_COLORS = ["#06b6d4", "#8b5cf6", "#06b6d4", "#8b5cf6", "#d946ef", "#06b6d4", "#f59e0b"];

const refreshOverdueTasks = async () => {
  await Task.updateMany(
    { dueDate: { $lt: new Date() }, status: { $nin: ["Done", "Overdue"] } },
    { $set: { status: "Overdue" } }
  );
};

const getTaskFilterForUser = (user) => getTaskFilterForWorkspace(user);

const buildStats = (tasks) => ({
  total: tasks.length,
  completed: tasks.filter((t) => t.status === "Done").length,
  inProgress: tasks.filter((t) => t.status === "In Progress").length,
  overdue: tasks.filter((t) => t.status === "Overdue").length,
  todo: tasks.filter((t) => t.status === "Todo").length,
});

const calcTrend = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? { direction: "up", value: 100 } : { direction: "up", value: 0 };
  }
  const change = Math.round(((current - previous) / previous) * 100);
  return {
    direction: change >= 0 ? "up" : "down",
    value: Math.abs(change),
  };
};

const buildTrends = (tasks) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const recent = tasks.filter((t) => new Date(t.createdAt) >= thirtyDaysAgo);
  const previous = tasks.filter((t) => {
    const created = new Date(t.createdAt);
    return created >= sixtyDaysAgo && created < thirtyDaysAgo;
  });

  const recentStats = buildStats(recent);
  const previousStats = buildStats(previous);

  return {
    total: calcTrend(recentStats.total, previousStats.total),
    completed: calcTrend(recentStats.completed, previousStats.completed),
    inProgress: calcTrend(recentStats.inProgress, previousStats.inProgress),
    overdue: calcTrend(recentStats.overdue, previousStats.overdue),
  };
};

const buildWeeklyActivity = (tasks) => {
  const days = [];
  const now = new Date();

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const next = new Date(date);
    next.setDate(next.getDate() + 1);

    const count = tasks.filter((t) => {
      const created = new Date(t.createdAt);
      return created >= date && created < next;
    }).length;

    const maxCount = Math.max(
      ...Array.from({ length: 7 }, (_, idx) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - idx));
        d.setHours(0, 0, 0, 0);
        const n = new Date(d);
        n.setDate(n.getDate() + 1);
        return tasks.filter((t) => {
          const created = new Date(t.createdAt);
          return created >= d && created < n;
        }).length;
      }),
      1
    );

    days.push({
      day: DAY_LABELS[date.getDay()],
      count,
      value: Math.round((count / maxCount) * 100),
      color: CHART_COLORS[6 - i],
    });
  }

  return days;
};

const buildPriorityDistribution = (tasks) => {
  const high = tasks.filter((t) => t.priority === "High").length;
  const medium = tasks.filter((t) => t.priority === "Medium").length;
  const low = tasks.filter((t) => t.priority === "Low").length;
  const total = tasks.length || 1;

  return [
    { label: "High", value: (high / total) * 100, color: "#ef4444", count: high },
    { label: "Medium", value: (medium / total) * 100, color: "#f59e0b", count: medium },
    { label: "Low", value: (low / total) * 100, color: "#10b981", count: low },
  ];
};

const buildProductivityScore = (tasks) => {
  const completed = tasks.filter((t) => t.status === "Done").length;
  const total = tasks.length || 1;
  const onTime = tasks.filter(
    (t) => t.status === "Done" && new Date(t.dueDate) >= new Date(t.updatedAt || t.createdAt)
  ).length;
  return Math.round(((completed / total) * 0.6 + (onTime / (completed || 1)) * 0.4) * 100);
};

const getDashboardOverview = async (user, query = {}) => {
  await refreshOverdueTasks();

  const filter = getTaskFilterForUser(user);
  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;
  if (query.project) filter.project = query.project;

  const tasks = await Task.find(filter)
    .populate("project", "name description members")
    .populate("assignedTo", "name email role")
    .populate("createdBy", "name email role")
    .sort({ dueDate: 1, createdAt: -1 });

  const allTasksForAnalytics = await Task.find(getTaskFilterForUser(user));

  return {
    stats: buildStats(tasks),
    trends: buildTrends(allTasksForAnalytics),
    weeklyActivity: buildWeeklyActivity(allTasksForAnalytics),
    priorityDistribution: buildPriorityDistribution(tasks),
    productivityScore: buildProductivityScore(tasks),
    tasks,
    updatedAt: new Date().toISOString(),
  };
};

const getAdminOverview = async () => {
  await refreshOverdueTasks();

  const [totalMembers, totalTasks, totalProjects, pendingReviews] = await Promise.all([
    User.countDocuments({ role: "member" }),
    Task.countDocuments(),
    Project.countDocuments(),
    Task.countDocuments({
      status: { $in: ["Todo", "In Progress"] },
      dueDate: { $lte: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
    }),
  ]);

  const recentTasks = await Task.find()
    .populate("assignedTo", "name email")
    .populate("project", "name")
    .sort({ createdAt: -1 })
    .limit(8);

  return {
    stats: {
      totalMembers,
      totalTasks,
      totalProjects,
      pendingReviews,
    },
    recentTasks,
    updatedAt: new Date().toISOString(),
  };
};

const getUsersList = async () => {
  const users = await User.find({ role: "member" })
    .select("name email role createdAt")
    .sort({ createdAt: -1 });
  return users;
};

module.exports = {
  getDashboardOverview,
  getAdminOverview,
  getUsersList,
  refreshOverdueTasks,
};
