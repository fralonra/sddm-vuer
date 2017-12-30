const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const {exec, execSync} = require('child_process');
const fs = require('fs');
const path = require('path');
const Sddm = require('./sddm');
const util = require('./util');

const appConfig = path.join(__dirname, './config.js');
const config = require('./config');
const appName = config.appName;
const kw = config.sddmKeywords;
const paths = {
  config: config.sddmConfigPath,
  theme: config.sddmThemePath
};

class Window {
  constructor () {
    this.mainWindow = null;
    this.webContents = null;
  }

  init () {
    this.initSddm();
    this.initIPC();
    this.initWindow();
  }

  initSddm () {
    this.sddm = new Sddm({
      paths: paths,
      kw: kw
    });
  }

  initIPC () {
    ipcMain.on('quit', (event, arg) => {
      app.quit();
    });
    ipcMain.on(`${appName}:sddm:get`, (event, arg) => {
      event.sender.send(`${appName}:sddm:get`, this.sddm.getData());
    });
    ipcMain.on(`${appName}:paths:get`, (event, arg) => {
      event.sender.send(`${appName}:paths:get`, this.sddm.getPath());
    });
    ipcMain.on(`${appName}:paths:set-config`, (event, arg) => {
      this.setConfig();
    });
    ipcMain.on(`${appName}:paths:add-theme`, (event, arg) => {
      this.addThemePath();
    });
    ipcMain.on(`${appName}:paths:remove-theme`, (event, arg) => {
      this.removeThemePath(arg);
    });
    ipcMain.on(`${appName}:themes:get`, (event, arg) => {
      event.sender.send(`${appName}:themes:get`, this.sddm.getThemes());
    });
    ipcMain.on(`${appName}:themes:preview`, (event, arg) => {
      execSync(`sddm-greeter --theme ${arg.path}`);
    });
    ipcMain.on(`${appName}:themes:set`, (event, arg) => {
      this.setSddm(kw.current, arg.name);
    });
  }

  initWindow () {
    const option = {
      resizable: false,
      title: config.appTitle
    };
    this.mainWindow = new BrowserWindow(option);
    this.webContents = this.mainWindow.webContents;
    this.mainWindow.setMenu(null);
    this.mainWindow.loadURL(config.url.home);

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  show () {
    this.mainWindow.show();
  }

  setConfig () {
    dialog.showOpenDialog({
      properties: ['openFile']
    }, (files) => {
      if (typeof files === 'undefined' || files.length === 0) return;
      this.sddm.setConfigPath(files[0]);
      this.webContents.send(`${appName}:paths:set-config`, paths.config);
      util.modifyObj('sddmConfigPath', paths.config, appConfig);
    });
  }

  setSddm (key, value) {
    this.sddm.setData(key, value);
    util.modifyObj(key, value, paths.config, {
      connector: '='
    });
  }

  addThemePath () {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, (files) => {
      if (typeof files === 'undefined' || files.length === 0) return;
      const p = files[0];
      if (paths.theme.indexOf(p) !== -1) return;
      this.sddm.addPath('theme', p);
      this.webContents.send(`${appName}:paths:add-theme`, p);
      this.webContents.send(`${appName}:themes:add`, p, this.sddm.getThemes(p));
      util.modifyObj('sddmThemePath', paths.theme, appConfig, {
        type: 'array'
      });
    });
  }

  removeThemePath (i) {
    this.sddm.removePath('theme', i);
    util.modifyObj('sddmThemePath', paths.theme, appConfig, {
      type: 'array'
    });
  }
}

module.exports = Window;
