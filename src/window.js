const {app, BrowserWindow} = require('electron');

const config = require('./config');
const appName = config.appName;

class Window {
  constructor () {
    this.mainWindow = null;
    this.webContents = null;
  }

  init () {
    this.initWindow();
  }

  initWindow () {
    const option = {
      resizable: false
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
}

module.exports = Window;
