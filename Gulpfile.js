var gulp = require('gulp'),
    jsap = require('./asset-pipeline/fileExtractor'),
    babel = require('gulp-babel');

gulp.task('javascript', jsap({
  entrypointGlob: './src/entrypoints/*.js',
  destinationPath: './build'
}));

gulp.task('javascript-watch', jsap({
  entrypointGlob: './src/entrypoints/*.js',
  destinationPath: './build',
  isWatchMode: true
}));

gulp.task('es5ificate', function() {
  gulp.src(['./src/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest('build-es5'))
});

gulp.task('default', ['javascript']);
