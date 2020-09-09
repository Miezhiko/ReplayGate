import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

import rep from 'w3gjs';
import { units, heroes } from "./mappings"
import { ParserOutput } from 'w3gjs/dist/types/parsers/ReplayParser';

interface Dataset {
  yAxisID: string;
  fill: boolean;
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
}

interface ReplayResult {
  result: ParserOutput;
  data: Dataset[];
  labels: string[];
}

function random_rgba() {
  var o = Math.round, r = Math.random, s = 255;
  return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
}

ipcMain.on('replay-go', (event, replay) => {
  const highlevel_parser = new rep();
  console.log(
    "parsing: " + replay
  );
  highlevel_parser
    .parse(replay)
    .then((result) => {
      var apm_graph: Dataset[] = [];
      var labels: string[] = [];
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
        let color = random_rgba();
        apm_graph.push(
          { yAxisID: "apm"
          , fill: false
          , label: playa.name
          , data: playa.actions.timed
          , backgroundColor: color
          , borderColor: color }
        );
      }
      if (apm_graph.length > 0) {
        for (let i = 0; i < apm_graph[0].data.length; i++) {
          labels.push(i.toString());
        }
      }
      let res = { result: result, data: apm_graph, labels: labels };
      event.reply('replay-go', res);
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
