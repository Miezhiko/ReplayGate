module.exports = class Replay extends (require("../Replays")) {
  getConfig() {
    return {
      sort: "name",
      fields: {
        "name": {label: "Replay Name", type: "text"},
        "data": {label: "Data", type: "integer"},
      },
      list: ["name", "data"]
    }
  }
}
