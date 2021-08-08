const Events = require("../utils/Events")
const {dialog} = require('electron').remote

const settingsKey = "settings"
module.exports = class Settings extends (require("../Component")) {

  constructor(componentName, renderer) {
    super(componentName, renderer)
    if (!this.load()) {
      this.save()
    }
    Events.delegate(document.body, "click", "#settingsForm #storageFolder", () => {
      const value = this.renderer.settings.dataStorageFolder
      const result = dialog.showOpenDialog({defaultPath: value, properties: ['openDirectory', 'createDirectory']})
      let newValue
      if(result) newValue = result[0]
      if(newValue && newValue !== value) {
        document.getElementById("storageFolder").value = newValue
        document.getElementById("settingsSubmitButton").disabled = false
      }
    })
    Events.delegate(document.body, "input", "#settingsForm input", () => {
      document.getElementById("settingsSubmitButton").disabled = false
    })
    Events.delegate(document.body, "submit", "#settingsForm", (event) => {
      event.preventDefault()
      this.transferFormData()
      this.save()
      document.getElementById("settingsSubmitButton").disabled = true
    })
  }

  render() {
    return `
    <h1>Settings</h1>
    <form id="settingsForm">
      <div class="form-group">
      <label for="storageFolder">Replays Folder</label>
      <input value="${this.renderer.settings.replaysStorageFolder}" type="text" class="form-control" id="replaysFolder">
      <label for="storageFolder">Settings Folder</label>
      <input readonly value="${this.renderer.settings.dataStorageFolder}" type="text" class="form-control" id="storageFolder">
      </div>
      <div class="form-group">
      <label for="userName">Username:</label>
      <input type="text" value="${this.renderer.settings.userName}" class="form-control" id="userName" aria-describedby="username field" placeholder="Enter a text">
      <small class="form-text text-muted">User</small>
      </div>
      <button id="settingsSubmitButton" type="submit" class="btn btn-primary" disabled>Save</button>
    </form>`
  }

  transferFormData() {
    this.renderer.settings.replaysStorageFolder = document.getElementById("replaysFolder").value
    this.renderer.settings.dataStorageFolder = document.getElementById("storageFolder").value
    this.renderer.settings.userName = document.getElementById("userName").value
  }

  load() {
    if (localStorage.getItem(settingsKey)) {
      this.renderer.settings = JSON.parse(localStorage.getItem(settingsKey))
      return true
    } else {
      return false
    }
  }

  save() {
    localStorage.setItem(settingsKey, JSON.stringify(this.renderer.settings))
  }

}
