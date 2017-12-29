const {app, ipcMain} = require('electron');
const {exec, execSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const Window = require('./window');

const config = require('./config');
const appName = config.appName;
const configPath = config.sddmConfigPath;
const themePath = config.sddmThemePath;

class SddmVuer {
  constructor () {
    this.window = null;
    this.themes = [];
  }

  init () {
    this.initSddm();
    this.initApp();
    this.initIPC();
  }

  initSddm () {
    this.initThemes();
  }

  initThemes () {
    themePath.forEach(p => {
      const dir = fs.readdirSync(p);
      dir.forEach(d => {
        const stats = fs.statSync(path.join(themePath, d));
        if (stats.isDirectory()) {
          this.themes.push({
            name: d,
            path: path.join(themePath, d)
          });
        }
      });
    });
  }

  initApp () {
    app.on('ready', () => {
      this.createWindow();
    });
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') app.quit();
    });
    app.on('activate', () => {
      if (this.window === null) this.createWindow();
    });
  }

  initIPC () {
    ipcMain.on('quit', (event, arg) => {
      app.quit();
    });
    ipcMain.on(`${appName}:themes:get`, (event, arg) => {
      event.sender.send(`${appName}:themes:get`, this.themes);
    });
    ipcMain.on(`${appName}:themes:preview`, (event, arg) => {
      execSync(`sddm-greeter --theme ${arg.path}`);
    });
  }

  createWindow () {
    this.window = new Window();
    this.window.init();
    this.window.show();
  }
}

module.exports = SddmVuer;
