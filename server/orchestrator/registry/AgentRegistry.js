class AgentRegistry {
  constructor() {
    this.byId = new Map();
    this.byGroup = new Map();
  }

  register(agents) {
    this.byId.clear();
    this.byGroup.clear();

    for (const agent of agents) {
      this.byId.set(agent.id, agent);

      if (!this.byGroup.has(agent.group)) {
        this.byGroup.set(agent.group, []);
      }

      this.byGroup.get(agent.group).push(agent);
    }
  }

  get(id) {
    return this.byId.get(id);
  }

  getGroup(group) {
    return this.byGroup.get(group) || [];
  }

  getAll() {
    return [...this.byId.values()];
  }

  count() {
    return this.byId.size;
  }
}

module.exports = AgentRegistry;
