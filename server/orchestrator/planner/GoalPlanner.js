class GoalPlanner {
  plan(goal) {
    const text = (goal || "").toLowerCase();

    const agents = new Set([100]);

    if (text.includes("ia") || text.includes("ai")) agents.add(41);
    if (text.includes("backend") || text.includes("api")) agents.add(12);
    if (text.includes("deploy")) agents.add(93);
    if (text.includes("seguridad")) agents.add(58);

    agents.add(1);

    return [...agents];
  }
}

module.exports = GoalPlanner;
