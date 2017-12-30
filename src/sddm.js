const fs = require('fs');
const path = require('path');
const util = require('./util');

class Sddm {
  constructor (arg = {}) {
    this.paths = arg.paths ? arg.paths : null;
    this.kw = arg.kw;

    if (!this.paths) throw new Error('paths must be declared when create an instance of Sddm');
    this.initData();
    this.initThemes();
  }

  initData () {
    this.data = {
      currentTheme: 'default'
    };
    fs.readFile(this.paths.config, (err, data) => {
      if (err) return;
      const currentTheme = util.getRawObj(this.kw.current, data, '=');
      this.data.currentTheme = currentTheme !== '' ? currentTheme : this.data.currentTheme;
    });
  }

  setData (key, value) {
    this.data[key] = value;
  }

  getData (key = null) {
    if (!key) return this.data;
    return this.data[key];
  }

  initThemes () {
    this.themes = {};
    this.paths.theme.forEach(p => this.findThemeInPath(p));
  }

  findThemeInPath (p) {
    const dir = fs.readdirSync(p);
    this.themes[p] = [];
    dir.forEach(d => {
      const stats = fs.statSync(path.join(p, d));
      if (stats.isDirectory()) {
        const files = fs.readdirSync(path.join(p, d));
        for (let i in files) {
          if (files[i] === 'Main.qml') {
            this.themes[p].push({
              name: d,
              path: path.join(p, d)
            });
            break;
          }
        }
      }
    });
  }

  getThemes (arg = null) {
    if (!arg) return this.themes;
    return this.themes[arg];
  }

  getPath (arg = null) {
    if (!arg) return this.paths;
    return this.paths[arg];
  }

  setConfigPath (arg) {
    this.paths.config = arg;
  }

  addPath (type, p) {
    this.paths[type].push(p);
    this.findThemeInPath(p);
  }

  removePath (type, i) {
    this.paths[type].splice(i, 1);
  }
}

module.exports = Sddm;
