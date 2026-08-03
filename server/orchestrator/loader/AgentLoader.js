const fs = require("fs");
const path = require("path");

class AgentLoader {
  constructor(basePath) {
    this.basePath = basePath;
    this.agents = [];
  }

  load() {
    this.agents = [];

    if (!fs.existsSync(this.basePath)) {
      throw new Error(`No existe el directorio: ${this.basePath}`);
    }

    const groups = fs.readdirSync(this.basePath);

    for (const group of groups) {
      const groupPath = path.join(this.basePath, group);

      if (!fs.statSync(groupPath).isDirectory()) continue;

      const files = fs.readdirSync(groupPath);

      for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const data = JSON.parse(
          fs.readFileSync(path.join(groupPath, file), "utf8")
        );

        this.agents.push(data);
      }
    }

    this.agents.sort((a, b) => a.id - b.id);

    return this.agents;
  }

  getAll() {
    return this.agents;
  }

  getById(id) {
    return this.agents.find(agent => agent.id === id);
  }

  getByGroup(group) {
    return this.agents.filter(agent => agent.group === group);
  }
}

module.exports = AgentLoader;
