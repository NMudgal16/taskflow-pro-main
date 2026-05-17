/**
 * Seed the database with sample users, projects, and tasks.
 *
 * Usage:
 *   node scripts/seed.js          # add missing seed data (safe to re-run)
 *   node scripts/seed.js --clear  # wipe collections then seed
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");

const shouldClear = process.argv.includes("--clear");

const getMongoUri = () => {
  const uri = process.env.MONGODB_URI;
  const isPlaceholder =
    uri &&
    (uri.includes("<password>") ||
      uri.includes("<REPLACE_WITH_PASSWORD>") ||
      uri.includes("<db_password>") ||
      uri.includes("<"));

  if (isPlaceholder) {
    return "mongodb://127.0.0.1:27017/taskflow";
  }
  return uri;
};

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(12, 0, 0, 0);
  return date;
};

const daysAgo = (days) => daysFromNow(-days);

const MEMBER_DEFS = [
  { name: "Alice Johnson", email: "alice@taskflow.local", password: "Member123!" },
  { name: "Bob Martinez", email: "bob@taskflow.local", password: "Member123!" },
  { name: "Carol Lee", email: "carol@taskflow.local", password: "Member123!" },
  { name: "David Kim", email: "david@taskflow.local", password: "Member123!" },
];

const PROJECT_DEFS = [
  {
    name: "Website Redesign",
    description: "Refresh marketing site UI, improve performance, and ship new landing pages.",
    memberEmails: ["alice@taskflow.local", "bob@taskflow.local", "carol@taskflow.local"],
    includeAdmin: true,
  },
  {
    name: "Mobile App Launch",
    description: "Prepare iOS and Android builds, app store assets, and beta testing.",
    memberEmails: ["alice@taskflow.local", "carol@taskflow.local", "david@taskflow.local"],
    includeAdmin: false,
  },
  {
    name: "API Integration",
    description: "Connect third-party services, webhooks, and internal dashboards.",
    memberEmails: ["bob@taskflow.local", "david@taskflow.local"],
    includeAdmin: true,
  },
  {
    name: "Customer Support Portal",
    description: "Build ticket workflow, knowledge base, and SLA tracking for support team.",
    memberEmails: [
      "alice@taskflow.local",
      "bob@taskflow.local",
      "carol@taskflow.local",
      "david@taskflow.local",
    ],
    includeAdmin: true,
  },
];

const resolveUser = (email, usersByEmail) => usersByEmail.get(email.toLowerCase());

const seedUsers = async () => {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@taskflow.local").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: process.env.ADMIN_NAME || "Administrator",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log("Created admin:", adminEmail);
  } else {
    console.log("Admin ready:", adminEmail);
  }

  const members = [];
  for (const def of MEMBER_DEFS) {
    let user = await User.findOne({ email: def.email });
    if (!user) {
      user = await User.create({ ...def, role: "member" });
      console.log("Created member:", def.email);
    } else {
      console.log("Member ready:", def.email);
    }
    members.push(user);
  }

  const usersByEmail = new Map();
  usersByEmail.set(admin.email, admin);
  members.forEach((member) => usersByEmail.set(member.email, member));

  return { admin, members, usersByEmail };
};

const seedProjects = async (admin, usersByEmail) => {
  const projects = [];

  for (const def of PROJECT_DEFS) {
    const memberIds = def.memberEmails
      .map((email) => resolveUser(email, usersByEmail)?._id)
      .filter(Boolean);

    if (def.includeAdmin) {
      memberIds.push(admin._id);
    }

    const uniqueMemberIds = [...new Set(memberIds.map(String))].map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    let project = await Project.findOne({ name: def.name });
    if (!project) {
      project = await Project.create({
        name: def.name,
        description: def.description,
        createdBy: admin._id,
        members: uniqueMemberIds,
      });
      console.log("Created project:", def.name);
    } else {
      const existing = new Set(project.members.map(String));
      let updated = false;
      uniqueMemberIds.forEach((id) => {
        if (!existing.has(String(id))) {
          project.members.push(id);
          updated = true;
        }
      });
      if (updated) {
        await project.save();
        console.log("Updated project members:", def.name);
      } else {
        console.log("Project ready:", def.name);
      }
    }

    projects.push(project);
  }

  return projects;
};

const upsertTask = async (def, admin) => {
  if (!def.project?._id || !def.assignedTo?._id) return false;

  const exists = await Task.findOne({
    title: def.title,
    project: def.project._id,
  });

  if (exists) return false;

  await Task.create({
    title: def.title,
    description: def.description,
    project: def.project._id,
    assignedTo: def.assignedTo._id,
    priority: def.priority,
    status: def.status,
    dueDate: def.dueDate,
    createdBy: admin._id,
    createdAt: def.createdAt || new Date(),
  });
  console.log("Created task:", def.title, `→ ${def.assignedTo.name}`);
  return true;
};

const buildTaskDefs = (admin, members, projects) => {
  const byEmail = (email) => members.find((m) => m.email === email) || admin;
  const projectByName = (name) => projects.find((p) => p.name === name);

  const website = projectByName("Website Redesign");
  const mobile = projectByName("Mobile App Launch");
  const api = projectByName("API Integration");
  const support = projectByName("Customer Support Portal");

  const alice = byEmail("alice@taskflow.local");
  const bob = byEmail("bob@taskflow.local");
  const carol = byEmail("carol@taskflow.local");
  const david = byEmail("david@taskflow.local");

  return [
    // Alice — personal workspace
    {
      title: "Design new homepage mockups",
      description: "Create Figma layouts for desktop and mobile breakpoints.",
      project: website,
      assignedTo: alice,
      priority: "High",
      status: "In Progress",
      dueDate: daysFromNow(5),
      createdAt: daysAgo(3),
    },
    {
      title: "Review brand color palette",
      description: "Finalize primary and accent colors for the redesign.",
      project: website,
      assignedTo: alice,
      priority: "Medium",
      status: "Todo",
      dueDate: daysFromNow(8),
      createdAt: daysAgo(1),
    },
    {
      title: "Beta build for TestFlight",
      description: "Upload iOS beta build and share with internal testers.",
      project: mobile,
      assignedTo: alice,
      priority: "High",
      status: "Todo",
      dueDate: daysFromNow(7),
      createdAt: daysAgo(1),
    },
    {
      title: "Knowledge base articles",
      description: "Write top 10 FAQ articles for common customer issues.",
      project: support,
      assignedTo: alice,
      priority: "Medium",
      status: "Todo",
      dueDate: daysFromNow(12),
      createdAt: daysAgo(1),
    },
    // Bob
    {
      title: "Implement responsive navigation",
      description: "Update header component and mobile menu interactions.",
      project: website,
      assignedTo: bob,
      priority: "Medium",
      status: "Todo",
      dueDate: daysFromNow(10),
      createdAt: daysAgo(2),
    },
    {
      title: "Stripe webhook handler",
      description: "Listen for payment events and update subscription status.",
      project: api,
      assignedTo: bob,
      priority: "High",
      status: "In Progress",
      dueDate: daysFromNow(4),
      createdAt: daysAgo(5),
    },
    {
      title: "Rate limit monitoring",
      description: "Add alerts when API rate limits spike above threshold.",
      project: api,
      assignedTo: bob,
      priority: "Low",
      status: "Done",
      dueDate: daysAgo(3),
      createdAt: daysAgo(12),
    },
    {
      title: "Support escalation playbook",
      description: "Document when to escalate tickets to tier-2 support.",
      project: support,
      assignedTo: bob,
      priority: "Medium",
      status: "In Progress",
      dueDate: daysFromNow(9),
      createdAt: daysAgo(2),
    },
    // Carol
    {
      title: "Optimize image assets",
      description: "Compress hero images and enable lazy loading.",
      project: website,
      assignedTo: carol,
      priority: "Low",
      status: "Done",
      dueDate: daysAgo(2),
      createdAt: daysAgo(8),
    },
    {
      title: "App store screenshots",
      description: "Prepare screenshot sets for all required device sizes.",
      project: mobile,
      assignedTo: carol,
      priority: "Medium",
      status: "Overdue",
      dueDate: daysAgo(1),
      createdAt: daysAgo(10),
    },
    {
      title: "Ticket auto-assignment rules",
      description: "Route new tickets based on category and agent availability.",
      project: support,
      assignedTo: carol,
      priority: "High",
      status: "In Progress",
      dueDate: daysFromNow(6),
      createdAt: daysAgo(2),
    },
    {
      title: "Accessibility audit fixes",
      description: "Fix contrast and keyboard navigation issues on landing pages.",
      project: website,
      assignedTo: carol,
      priority: "High",
      status: "Todo",
      dueDate: daysFromNow(11),
      createdAt: daysAgo(0),
    },
    // David
    {
      title: "Android crash fixes",
      description: "Fix login crash on Android 14 devices.",
      project: mobile,
      assignedTo: david,
      priority: "High",
      status: "In Progress",
      dueDate: daysFromNow(3),
      createdAt: daysAgo(4),
    },
    {
      title: "Document REST endpoints",
      description: "Add OpenAPI spec for public integration endpoints.",
      project: api,
      assignedTo: david,
      priority: "Medium",
      status: "Todo",
      dueDate: daysFromNow(14),
      createdAt: daysAgo(1),
    },
    {
      title: "SLA dashboard widgets",
      description: "Show average response time and resolution time per team.",
      project: support,
      assignedTo: david,
      priority: "Medium",
      status: "Overdue",
      dueDate: daysAgo(2),
      createdAt: daysAgo(7),
    },
    {
      title: "OAuth provider testing",
      description: "Verify Google and GitHub sign-in on staging.",
      project: api,
      assignedTo: david,
      priority: "High",
      status: "In Progress",
      dueDate: daysFromNow(5),
      createdAt: daysAgo(3),
    },
    // Admin — tasker login (Login as Tasker)
    {
      title: "Approve Q2 project roadmap",
      description: "Review milestones and sign off on cross-team deliverables.",
      project: website,
      assignedTo: admin,
      priority: "High",
      status: "In Progress",
      dueDate: daysFromNow(4),
      createdAt: daysAgo(2),
    },
    {
      title: "Weekly team standup notes",
      description: "Summarize blockers and wins from each project lead.",
      project: support,
      assignedTo: admin,
      priority: "Medium",
      status: "Todo",
      dueDate: daysFromNow(2),
      createdAt: daysAgo(1),
    },
    {
      title: "Security review for API keys",
      description: "Rotate staging keys and confirm vault access policies.",
      project: api,
      assignedTo: admin,
      priority: "High",
      status: "Todo",
      dueDate: daysFromNow(6),
      createdAt: daysAgo(0),
    },
    {
      title: "Onboard new support lead",
      description: "Schedule intro sessions and share portal documentation.",
      project: support,
      assignedTo: admin,
      priority: "Low",
      status: "Done",
      dueDate: daysAgo(1),
      createdAt: daysAgo(6),
    },
    {
      title: "Homepage launch checklist",
      description: "Final QA pass before publishing the redesigned homepage.",
      project: website,
      assignedTo: admin,
      priority: "Medium",
      status: "Overdue",
      dueDate: daysAgo(1),
      createdAt: daysAgo(5),
    },
  ];
};

const seedTasks = async (admin, members, projects) => {
  const taskDefs = buildTaskDefs(admin, members, projects);
  let created = 0;

  for (const def of taskDefs) {
    if (await upsertTask(def, admin)) created += 1;
  }

  return created;
};

const printPerUserSummary = async (admin, members) => {
  const allUsers = [admin, ...members];
  console.log("\n--- Tasks per user (tasker workspace) ---");
  for (const user of allUsers) {
    const count = await Task.countDocuments({ assignedTo: user._id });
    const projects = await Project.countDocuments({ members: user._id });
    console.log(`  ${user.email}: ${count} tasks, ${projects} projects`);
  }
};

const printSummary = () => {
  console.log("\n--- Seed complete ---");
  console.log("Login as Tasker (/login):\n");
  console.log("  Members (password Member123!):");
  console.log("    alice@taskflow.local, bob@taskflow.local,");
  console.log("    carol@taskflow.local, david@taskflow.local");
  console.log("\n  Admin as tasker (same /login page):");
  console.log("    admin@taskflow.local / Admin123!  (or your ADMIN_* from .env)");
  console.log("\nLogin as Admin (/admin-login):");
  console.log("    admin@taskflow.local — full admin panel\n");
};

const run = async () => {
  const uri = getMongoUri();
  if (!uri) {
    console.error("MONGODB_URI is not set in backend/.env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB\n");

  if (shouldClear) {
    await Promise.all([
      Task.deleteMany({}),
      Project.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log("Cleared users, projects, and tasks.\n");
  }

  const { admin, members, usersByEmail } = await seedUsers();
  const projects = await seedProjects(admin, usersByEmail);
  const tasksCreated = await seedTasks(admin, members, projects);

  const totals = {
    users: await User.countDocuments(),
    projects: await Project.countDocuments(),
    tasks: await Task.countDocuments(),
  };

  console.log(`\nTotals: ${totals.users} users, ${totals.projects} projects, ${totals.tasks} tasks`);
  console.log(`New tasks this run: ${tasksCreated}`);
  await printPerUserSummary(admin, members);
  printSummary();

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
