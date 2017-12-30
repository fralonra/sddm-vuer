const {app} = require('electron');

const Window = require('./window');

class SddmVuer {
  constructor () {
    this.window = null;
  }

  init () {
    this.initApp();
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

  createWindow () {
    this.window = new Window();
    this.window.init();
    this.window.show();
  }
}

module.exports = SddmVuer;
