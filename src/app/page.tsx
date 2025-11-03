"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

type Status = "Backlog" | "In Progress" | "In Review" | "Done";

type Priority = "Low" | "Medium" | "High";

type Project = {
  id: string;
  name: string;
  summary: string;
  manager: string;
  dueDate: string;
  status: "On-Track" | "At-Risk" | "Blocked";
  progress: number;
};

type Task = {
  id: string;
  title: string;
  projectId: string;
  assignee: string;
  dueDate: string;
  status: Status;
  priority: Priority;
  tags: string[];
};

type Milestone = {
  id: string;
  label: string;
  date: string;
  owner: string;
  projectId: string;
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
  focus: string[];
  capacity: number;
  avatar: string;
};

type Activity = {
  id: string;
  description: string;
  timestamp: string;
};

const projects: Project[] = [
  {
    id: "prj-analytics",
    name: "Analytics Modernization",
    summary: "Replatforming data pipelines onto Lakehouse architecture.",
    manager: "Samantha Gray",
    dueDate: "2024-12-12",
    status: "On-Track",
    progress: 68,
  },
  {
    id: "prj-marketing",
    name: "Marketing Website Refresh",
    summary: "Design system updates and content migration for marketing site.",
    manager: "Kai Robinson",
    dueDate: "2024-11-05",
    status: "At-Risk",
    progress: 42,
  },
  {
    id: "prj-mobile",
    name: "Mobile App Expansion",
    summary: "Native integrations for partner ecosystem in mobile app.",
    manager: "Noah Patel",
    dueDate: "2025-01-20",
    status: "On-Track",
    progress: 53,
  },
  {
    id: "prj-support",
    name: "Support Automation",
    summary: "Rollout of AI assisted ticket triage and knowledge base.",
    manager: "Carmen Zhao",
    dueDate: "2024-10-28",
    status: "Blocked",
    progress: 24,
  },
];

const initialTasks: Task[] = [
  {
    id: "task-dwh",
    title: "Blueprint Snowflake ingestion strategy",
    projectId: "prj-analytics",
    assignee: "Alex Rivers",
    dueDate: "2024-09-05",
    status: "In Review",
    priority: "High",
    tags: ["data", "architecture"],
  },
  {
    id: "task-funnel",
    title: "Prototype lifecycle funnel dashboard",
    projectId: "prj-analytics",
    assignee: "Morgan Yu",
    dueDate: "2024-08-28",
    status: "In Progress",
    priority: "Medium",
    tags: ["design", "viz"],
  },
  {
    id: "task-copy",
    title: "Finalize hero messaging for homepage",
    projectId: "prj-marketing",
    assignee: "Priya Desai",
    dueDate: "2024-08-30",
    status: "Backlog",
    priority: "High",
    tags: ["content"],
  },
  {
    id: "task-cms",
    title: "Migrate knowledge base to headless CMS",
    projectId: "prj-support",
    assignee: "Leo Martinez",
    dueDate: "2024-09-18",
    status: "Backlog",
    priority: "Medium",
    tags: ["migration"],
  },
  {
    id: "task-notification",
    title: "Design push notification cadence",
    projectId: "prj-mobile",
    assignee: "Jamie Fox",
    dueDate: "2024-09-10",
    status: "In Progress",
    priority: "Low",
    tags: ["ux", "retention"],
  },
  {
    id: "task-search",
    title: "Improve article search relevance",
    projectId: "prj-support",
    assignee: "Riley Chen",
    dueDate: "2024-08-20",
    status: "In Review",
    priority: "High",
    tags: ["ml", "support"],
  },
  {
    id: "task-ios",
    title: "Ship beta build for partner integrations",
    projectId: "prj-mobile",
    assignee: "Jamie Fox",
    dueDate: "2024-09-25",
    status: "Backlog",
    priority: "High",
    tags: ["mobile"],
  },
];

const milestones: Milestone[] = [
  {
    id: "ms-ux",
    label: "Homepage approval",
    date: "2024-09-02",
    owner: "Design Council",
    projectId: "prj-marketing",
  },
  {
    id: "ms-ml",
    label: "Model performance gate",
    date: "2024-09-08",
    owner: "Data Science",
    projectId: "prj-support",
  },
  {
    id: "ms-beta",
    label: "Mobile beta cohort kickoff",
    date: "2024-09-20",
    owner: "Product Ops",
    projectId: "prj-mobile",
  },
  {
    id: "ms-warehouse",
    label: "Warehouse cutover",
    date: "2024-10-01",
    owner: "Analytics Platform",
    projectId: "prj-analytics",
  },
];

const team: TeamMember[] = [
  {
    id: "user-01",
    name: "Alex Rivers",
    role: "Program Lead",
    focus: ["Delivery", "Stakeholder"],
    capacity: 0.65,
    avatar: "AR",
  },
  {
    id: "user-02",
    name: "Priya Desai",
    role: "Content Strategist",
    focus: ["Copy", "Localization"],
    capacity: 0.8,
    avatar: "PD",
  },
  {
    id: "user-03",
    name: "Jamie Fox",
    role: "Mobile PM",
    focus: ["Integrations", "Activation"],
    capacity: 0.55,
    avatar: "JF",
  },
  {
    id: "user-04",
    name: "Riley Chen",
    role: "Machine Learning Lead",
    focus: ["Search", "Automation"],
    capacity: 0.7,
    avatar: "RC",
  },
];

const activityLog: Activity[] = [
  {
    id: "act-01",
    description: "Samantha marked warehouse runbook ready for review",
    timestamp: "2024-08-18T08:45:00Z",
  },
  {
    id: "act-02",
    description: "Kai attached copy deck draft to marketing refresh",
    timestamp: "2024-08-17T16:12:00Z",
  },
  {
    id: "act-03",
    description: "Carmen escalated vendor blocker on support automation",
    timestamp: "2024-08-17T14:01:00Z",
  },
  {
    id: "act-04",
    description: "Morgan moved lifecycle funnel dashboard to In Review",
    timestamp: "2024-08-16T10:27:00Z",
  },
];

const STATUSES: Status[] = ["Backlog", "In Progress", "In Review", "Done"];

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const formatTimeAgo = (value: string) => {
  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const createTaskId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `task-${crypto.randomUUID()}`;
  }
  return `task-${Math.random().toString(36).slice(2, 10)}`;
};

const getStatusAccent = (status: Project["status"]) => {
  switch (status) {
    case "On-Track":
      return "bg-emerald-500/15 text-emerald-600";
    case "At-Risk":
      return "bg-amber-500/15 text-amber-600";
    case "Blocked":
      return "bg-rose-500/15 text-rose-600";
  }
};

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [newTask, setNewTask] = useState({
    title: "",
    projectId: projects[0]?.id ?? "",
    assignee: "",
    dueDate: "",
    priority: "Medium" as Priority,
    tags: "",
  });
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesProject =
        selectedProject === "all" || task.projectId === selectedProject;
      const term = search.trim().toLowerCase();
      const matchesSearch = !term
        ? true
        : [task.title, task.assignee, task.tags.join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(term);
      return matchesProject && matchesSearch;
    });
  }, [search, selectedProject, tasks]);

  const byStatus = useMemo(() => {
    return STATUSES.reduce<Record<Status, Task[]>>((acc, status) => {
      acc[status] = filteredTasks
        .filter((task) => task.status === status)
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
      return acc;
    }, {} as Record<Status, Task[]>);
  }, [filteredTasks]);

  const upcomingMilestones = useMemo(
    () =>
      [...milestones]
        .filter((milestone) => new Date(milestone.date) >= new Date())
        .sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    []
  );

  const completedTasks = tasks.filter((task) => task.status === "Done");
  const overdueTasks = tasks.filter(
    (task) =>
      new Date(task.dueDate) < new Date() && task.status !== "Done"
  );

  const handleStatusChange = (taskId: string, status: Status) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
            }
          : task
      )
    );
  };

  const handlePriorityChange = (taskId: string, priority: Priority) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              priority,
            }
          : task
      )
    );
  };

  const handleCreateTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTask.title || !newTask.dueDate || !newTask.projectId) {
      return;
    }
    const tags = newTask.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setTasks((prev) => [
      ...prev,
      {
        id: createTaskId(),
        title: newTask.title,
        projectId: newTask.projectId,
        assignee: newTask.assignee || "Unassigned",
        dueDate: newTask.dueDate,
        status: "Backlog",
        priority: newTask.priority,
        tags,
      },
    ]);
    setNewTask({
      title: "",
      projectId: newTask.projectId,
      assignee: "",
      dueDate: "",
      priority: "Medium",
      tags: "",
    });
  };

  const getProject = (projectId: string) =>
    projects.find((project) => project.id === projectId);

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_#2e1065,_#020617_60%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 pb-16 pt-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-300">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
              Command Center
            </div>
            <h1 className="mt-2 text-4xl font-semibold text-white md:text-5xl">
              Project Management Workspace
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
              Monitor delivery health, orchestrate execution, and keep every
              initiative aligned. Track projects, unblock work, and coordinate
              your teams in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <button className="rounded-full bg-violet-500/20 px-4 py-2 font-medium text-violet-200 transition hover:bg-violet-400/30">
              Export Snapshot
            </button>
            <button className="rounded-full border border-violet-400/40 px-4 py-2 font-medium text-slate-200 transition hover:border-violet-400">
              Share Dashboard
            </button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Active Projects"
            value={projects.length}
            delta="+1 vs last sprint"
            trend="up"
          />
          <MetricCard
            label="On-Track"
            value={projects.filter((p) => p.status === "On-Track").length}
            delta="78% healthy"
            trend="neutral"
          />
          <MetricCard
            label="Tasks Due"
            value={overdueTasks.length}
            delta={overdueTasks.length > 0 ? "Resolve today" : "All clear"}
            trend={overdueTasks.length > 0 ? "down" : "up"}
          />
          <MetricCard
            label="Completed"
            value={completedTasks.length}
            delta="Past 7 days"
            trend="up"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Delivery Boards
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Segment workstreams, prioritize, and move deliverables to the
                  finish line.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <span className="text-xs uppercase tracking-widest text-slate-300">
                    Project
                  </span>
                  <select
                    className="bg-transparent text-sm font-medium text-white focus:outline-none"
                    value={selectedProject}
                    onChange={(event) => setSelectedProject(event.target.value)}
                  >
                    <option value="all" className="bg-slate-900 text-white">
                      All projects
                    </option>
                    {projects.map((project) => (
                      <option
                        key={project.id}
                        value={project.id}
                        className="bg-slate-900 text-white"
                      >
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <span className="text-xs uppercase tracking-widest text-slate-300">
                    Search
                  </span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Tasks, teammates, tags"
                    className="w-48 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              {STATUSES.map((status) => (
                <div
                  key={status}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-200">
                      {status}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {byStatus[status]?.length ?? 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {(byStatus[status] ?? []).map((task) => {
                      const project = getProject(task.projectId);
                      return (
                        <article
                          key={task.id}
                          className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {task.title}
                              </p>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                                {project && (
                                  <span className="rounded-full bg-violet-500/15 px-2 py-1 text-violet-200">
                                    {project.name}
                                  </span>
                                )}
                                <span className="rounded-full bg-slate-800 px-2 py-1">
                                  {task.assignee}
                                </span>
                                <span className="rounded-full bg-slate-800 px-2 py-1">
                                  Due {formatDate(task.dueDate)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 text-xs text-slate-200">
                              <label className="flex flex-col gap-1 text-right">
                                <span className="text-[10px] uppercase tracking-widest text-slate-400">
                                  Status
                                </span>
                                <select
                                  className="rounded-full border border-white/10 bg-slate-900 px-2 py-1 text-xs font-semibold text-slate-100"
                                  value={task.status}
                                  onChange={(event) =>
                                    handleStatusChange(
                                      task.id,
                                      event.target.value as Status
                                    )
                                  }
                                >
                                  {STATUSES.map((option) => (
                                    <option
                                      key={option}
                                      value={option}
                                      className="bg-slate-900"
                                    >
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label className="flex flex-col gap-1 text-right">
                                <span className="text-[10px] uppercase tracking-widest text-slate-400">
                                  Priority
                                </span>
                                <select
                                  className="rounded-full border border-white/10 bg-slate-900 px-2 py-1 text-xs font-semibold text-slate-100"
                                  value={task.priority}
                                  onChange={(event) =>
                                    handlePriorityChange(
                                      task.id,
                                      event.target.value as Priority
                                    )
                                  }
                                >
                                  {PRIORITIES.map((option) => (
                                    <option
                                      key={option}
                                      value={option}
                                      className="bg-slate-900"
                                    >
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>
                          </div>
                          {task.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-300">
                              {task.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-white/10 px-2 py-0.5"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </article>
                      );
                    })}
                    {(byStatus[status] ?? []).length === 0 && (
                      <div className="rounded-xl border border-dashed border-white/10 bg-slate-900/40 p-4 text-center text-xs text-slate-500">
                        No work items yet
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-lg font-semibold text-white">
                Quick Add Task
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Capture the next deliverable. Newly created tasks start in the
                backlog for triage.
              </p>
              <form className="mt-4 flex flex-col gap-3" onSubmit={handleCreateTask}>
                <input
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline focus:outline-2 focus:outline-violet-400"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(event) =>
                    setNewTask((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <select
                    className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white focus:outline focus:outline-2 focus:outline-violet-400"
                    value={newTask.projectId}
                    onChange={(event) =>
                      setNewTask((current) => ({
                        ...current,
                        projectId: event.target.value,
                      }))
                    }
                  >
                    {projects.map((project) => (
                      <option
                        key={project.id}
                        value={project.id}
                        className="bg-slate-900"
                      >
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    required
                    className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white focus:outline focus:outline-2 focus:outline-violet-400"
                    value={newTask.dueDate}
                    onChange={(event) =>
                      setNewTask((current) => ({
                        ...current,
                        dueDate: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline focus:outline-2 focus:outline-violet-400"
                    placeholder="Assignee"
                    value={newTask.assignee}
                    onChange={(event) =>
                      setNewTask((current) => ({
                        ...current,
                        assignee: event.target.value,
                      }))
                    }
                  />
                  <select
                    className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white focus:outline focus:outline-2 focus:outline-violet-400"
                    value={newTask.priority}
                    onChange={(event) =>
                      setNewTask((current) => ({
                        ...current,
                        priority: event.target.value as Priority,
                      }))
                    }
                  >
                    {PRIORITIES.map((option) => (
                      <option
                        key={option}
                        value={option}
                        className="bg-slate-900"
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline focus:outline-2 focus:outline-violet-400"
                  placeholder="Tags (comma separated)"
                  value={newTask.tags}
                  onChange={(event) =>
                    setNewTask((current) => ({
                      ...current,
                      tags: event.target.value,
                    }))
                  }
                />
                <button
                  type="submit"
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400"
                >
                  Add Task
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-lg font-semibold text-white">Team Focus</h2>
              <p className="mt-1 text-sm text-slate-300">
                Balance capacity and spotlight current areas of ownership.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {team.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/30 text-sm font-semibold text-violet-100">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-xs uppercase tracking-widest text-slate-400">
                          {member.role}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
                          {member.focus.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-white/10 px-2 py-0.5"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        CAPACITY
                      </span>
                      <div className="relative h-2 w-28 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-violet-400"
                          style={{ width: `${Math.round(member.capacity * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-300">
                        {Math.round(member.capacity * 100)}% allocated
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Initiative Pulse</h2>
              <button className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-200">
                Export Table
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-300">
              Inspect project health indicators across the portfolio at a
              glance.
            </p>
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
                <thead className="bg-slate-950/60 text-xs uppercase tracking-widest text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Project</th>
                    <th className="px-5 py-3">Manager</th>
                    <th className="px-5 py-3">Due</th>
                    <th className="px-5 py-3">Progress</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-slate-950/30">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-5 py-4">
                        <div className="text-base font-semibold text-white">
                          {project.name}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          {project.summary}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm">{project.manager}</td>
                      <td className="px-5 py-4 text-sm text-slate-300">
                        {formatDate(project.dueDate)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-2 w-28 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full bg-violet-400"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-white">
                            {project.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusAccent(project.status)}`}
                        >
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-lg font-semibold text-white">Milestone Radar</h2>
              <p className="mt-1 text-sm text-slate-300">
                Stay ahead of deadlines across the roadmap.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {upcomingMilestones.map((milestone) => {
                  const project = getProject(milestone.projectId);
                  return (
                    <div
                      key={milestone.id}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {milestone.label}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Owned by {milestone.owner}
                        </p>
                        {project && (
                          <p className="mt-2 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                            {project.name}
                          </p>
                        )}
                      </div>
                      <div className="text-right text-sm text-slate-200">
                        <p className="font-semibold">{formatDate(milestone.date)}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(milestone.date).toDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-lg font-semibold text-white">Activity Feed</h2>
              <p className="mt-1 text-sm text-slate-300">
                Latest portfolio updates from across teams.
              </p>
              <div className="mt-4 flex flex-col gap-4">
                {activityLog.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-violet-400" />
                    <div className="flex-1">
                      <p className="text-sm text-white">{item.description}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">
                        {formatTimeAgo(item.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: number;
  delta: string;
  trend: "up" | "down" | "neutral";
};

function MetricCard({ label, value, delta, trend }: MetricCardProps) {
  const accent =
    trend === "up"
      ? "text-emerald-300"
      : trend === "down"
        ? "text-rose-300"
        : "text-slate-300";

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className={`mt-2 text-sm font-medium ${accent}`}>{delta}</p>
    </div>
  );
}
