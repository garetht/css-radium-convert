var browserify = require('browserify'),
    _ = require('lodash'),
    vinylizr = require('vinyl-source-stream'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    gulp = require('gulp');

var babelify = require('babelify'),
    uglifyify = require('uglifyify'),
    watchify = require('watchify'),
    factorify = require('factor-bundle');

var bundler = function(bundlableBrowserifyRoot, factorCommonFiles, factorCommonFilesTo, destinationPath) {
  var bundle = bundlableBrowserifyRoot
    .bundle()
    .on('error', function(e) {
      console.log(e.message);
      if (e.codeFrame) {
        console.log(e.codeFrame);
      }
    })

  if (factorCommonFiles) {
    bundle = bundle.pipe(vinylizr(factorCommonFilesTo || "common.js"));
  }

  return bundle.pipe(gulp.dest(destinationPath));
};

module.exports = function(opts) {
  var entryPoints = opts.files,
      destinationPath = opts.destinationPath,
      isWatchMode = opts.isWatchMode,
      factorCommonFiles = opts.factorCommonFiles,
      factorCommonFilesTo = opts.factorCommonFilesTo,
      isProductionMode = opts.isProductionMode;

  var bundlePoints = entryPoints.map(function(point) {
        return destinationPath + '/' + path.basename(point);
      }),
      entryPaths = entryPoints.map(function(point) {
        return './' + point;
      }),
      watchFn = isWatchMode ? watchify : _.identity;

  var browserifyRoot = watchFn(browserify({
    entries: [entryPaths],
    debug: !isProductionMode,
    cache: {},
    packageCache: {},
    fullPaths: !isProductionMode
  })).transform(babelify.configure({
    optional: ["runtime"]
  }));

  mkdirp.sync(destinationPath);

  if (isProductionMode) {
    browserifyRoot = browserifyRoot.transform({
      global: true
    }, uglifyify);
  }

  if (factorCommonFiles) {
    browserifyRoot = browserifyRoot.plugin(factorify, {
      o: bundlePoints
    });
  }

  if (isWatchMode) {
    browserifyRoot.on('update', function() {
      return bundler(browserifyRoot,
        factorCommonFiles,
        factorCommonFilesTo,
        destinationPath);
    });
  }
  return bundler(browserifyRoot,
    factorCommonFiles,
    factorCommonFilesTo,
    destinationPath);
};
