// Seed demo data for the Brounic dashboard.
// Usage: node scripts/seed.mjs [baseUrl]
const BASE = process.argv[2] ?? "http://localhost:3000";

function isoMonthsAgo(months) {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.toISOString().slice(0, 10);
}

const SUPPLY_TASKS = [
  "facp_installation",
  "pvc_piping",
  "device_installation",
  "fire_pump_installation",
  "mcp",
  "fire_pump_power_supply",
];

async function create(body) {
  const res = await fetch(`${BASE}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  const existing = await (await fetch(`${BASE}/api/projects`)).json();
  if (existing.length > 0) {
    console.log(`Database already has ${existing.length} projects — skipping seed.`);
    return;
  }

  const palm = await create({
    type: "supply",
    name: "Palm Residency - Fire Safety",
    clientName: "Skyline Developers",
    location: "Palm Jumeirah",
    contractDate: isoMonthsAgo(2),
    status: "active",
    completedTasks: ["facp_installation", "pvc_piping"],
    notes: "Phase 1 handover scheduled next month.",
  });

  const tech = await create({
    type: "supply",
    name: "Tech Park Towers",
    clientName: "Tech Park LLC",
    location: "Business Bay",
    contractDate: isoMonthsAgo(7),
    status: "completed",
    completedTasks: SUPPLY_TASKS,
    notes: "Commissioned and handed over.",
  });

  await create({
    type: "maintenance",
    name: "Grand Hotel - Fire Systems Maintenance",
    clientName: "Grand Hotel Group",
    location: "Downtown",
    contractDate: isoMonthsAgo(1),
    status: "active",
    notes: "Quarterly inspection of alarm panels and hydrants.",
  });

  await create({
    type: "amc",
    name: "Tech Park Towers - AMC",
    clientName: "Tech Park LLC",
    location: "Business Bay",
    contractDate: isoMonthsAgo(6),
    status: "active",
    parentProjectId: tech.id,
  });

  await create({
    type: "amc",
    name: "Palm Residency - AMC",
    clientName: "Skyline Developers",
    location: "Palm Jumeirah",
    contractDate: isoMonthsAgo(1),
    status: "active",
    parentProjectId: palm.id,
  });

  console.log("Seeded 5 projects (2 supply, 1 maintenance, 2 AMC).");
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
