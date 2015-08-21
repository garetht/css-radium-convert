var glob = require('glob'),
    browserifier = require('./browserifier');

module.exports = function(opts) {
  var entrypointGlob = opts.entrypointGlob || '',
      destinationPath = opts.destinationPath || '',
      isWatchMode = opts.isWatchMode || false,
      isProductionMode = opts.isProductionMode || false,
      factorCommonFiles = opts.factorCommonFiles || true,
      factorCommonFilesTo = opts.factorCommonFilesTo || 'common.js';

  return function() {
    glob(entrypointGlob, function(err, files) {
      return browserifier({
        files: files,
        destinationPath: destinationPath,
        factorCommonFiles: factorCommonFiles,
        factorCommonFilesTo: factorCommonFilesTo,
        isWatchMode: isWatchMode,
        isProductionMode: isProductionMode
      })
    });
  };
}
