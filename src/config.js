const pkg = require('../package.json');

module.exports = {
  appName: pkg.name,
  version: pkg.version,
  sddmPath: '/usr/share/sddm',
  sddmConfigPath: '/etc/sddm.conf',
  sddmThemePath: ['/usr/share/sddm/themes'],
  url: {
    home: `file://${__dirname}/views/home.html`
  }
};
