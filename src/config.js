const pkg = require('../package.json');

module.exports = {
  appName: pkg.name,
  version: pkg.version,
  appTitle: 'Sddm-Vuer',
  sddmPath: '/usr/share/sddm',
  sddmConfigPath: '/etc/sddm.conf',
  sddmThemePath: ['/usr/share/sddm/themes'],
  sddmKeywords: {
    current: 'Current'
  },
  url: {
    home: `file://${__dirname}/views/home.html`
  }
};
