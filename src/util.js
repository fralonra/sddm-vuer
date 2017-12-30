const fs = require('fs');

const util = {
  modifyObj (key, value, file, option = {}) {
    const opt = {
      connector: ': ',
      type: 'string'
    };
    Object.keys(opt).forEach(k => {
      if (option[k]) opt[k] = option[k];
    });

    const data = fs.readFileSync(file).toString().split('\n');
    let target = null;
    for (let i in data) {
      if (data[i].match(key + opt.connector)) {
        target = i;
        break;
      }
    }
    if (!target) return;

    if (typeof value === 'string' && opt.type !== 'string') opt.type = 'string';

    if (opt.type === 'string') value = `'${value}'`;
    else if (opt.type === 'array') {
      let str = [];
      value.forEach(v => {
        str.push(`'${v}'`);
      });
      value = `[${str.join(', ')}]`;
    }

    const oldValue = data[target].split(opt.connector)[1].split(/(,$|$)/)[0];
    data[target] = data[target].replace(oldValue, value);
    fs.writeFileSync(file, data.join('\n'));
  },

  getRawObj (key, raw, connector = ': ') {
    if (typeof raw !== 'string') raw = String(raw);
    return raw.split(key + connector)[1].split(/(,|\n)/)[0];
  }
};

module.exports = util;
