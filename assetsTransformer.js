const path = require('path');

/**
 * This file is needed in order for enzyme to properly render components that require assets.
 */
module.exports = {
  process(src, filename, config, options) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
  },
};
