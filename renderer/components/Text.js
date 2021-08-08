module.exports = class Replays extends (require("../Component")) {

  render() {
    return `
      <div id="drag-file">
        <h2>Drag replay files here</h2>
      </div>
      <canvas id="apmChart"></canvas>
      <div id="results">
      </div>
    `;
  }

}
