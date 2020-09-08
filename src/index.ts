import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

import rep from 'w3gjs';
import { units, heroes } from "./mappings"

ipcMain.on('replay-go', (event, replay) => {
  const highlevel_parser = new rep();
  console.log(
    "parsing: " + replay
  );
  highlevel_parser
    .parse(replay)
    .then((result) => {
      for (let playa of result.players) {
        var new_dict: { [id: string] : number; } = {};
        for (let key in playa.units.summary) {
          let count = playa.units.summary[key];
          let new_key = units[key].substring(2);
          new_dict[new_key] = count;
        }
        playa.units.summary = new_dict;
        for (let hero of playa.heroes) {
          let new_id = heroes[hero.id];
          hero.id = new_id;
        }
      }
      //event.reply('replay-go', result);
      let strx = JSON.stringify(result, null, '  ');
      event.reply('replay-go', strx);
    })
    .catch(console.error);
});

app.on('ready', () => {
  console.log('App is ready');

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
    //TODO: draw cancel button
    //frame: false
  });

  win.removeMenu();

  const indexHTML = path.join(__dirname + '/index.html');
  win.loadFile(indexHTML).then(() => {

  }).catch(e => console.error(e));
});
