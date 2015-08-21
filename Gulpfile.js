var gulp = require('gulp'),
    tsap = require('./asset-pipeline/fileExtractor');

gulp.task('javascript', tsap({
  entrypointGlob: './src/entrypoints/*.js',
  destinationPath: './build'
}));

gulp.task('javascript-watch', tsap({
  entrypointGlob: './src/entrypoints/*.js',
  destinationPath: './build',
  isWatchMode: true
}));

gulp.task('default', ['javascript']);
