module.exports = class Analyze extends (require("../Component")) {

  render() {
    return `<h1>Raw data</h1>${this.renderer.settings.userName}`;
  }

}
