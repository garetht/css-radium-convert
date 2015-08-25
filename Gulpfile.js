var gulp = require('gulp'),
    jsap = require('./asset-pipeline/fileExtractor'),
    babel = require('gulp-babel'),
    watch = require('gulp-watch');

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
  watch('./src/**/*.js', function() {
    gulp.src(['./src/**/*.js'])
      .pipe(watch('./src/**/*.js'))
      .pipe(babel())
      .pipe(gulp.dest('build-es5'))
  });
});

gulp.task('es5ificate-example', function() {
  watch('./example/*.js', function() {
    gulp.src(['./example/*.js'])
      .pipe(watch('./example/*.js'))
      .pipe(babel())
      .pipe(gulp.dest('build-es5-example'))
  })
});

gulp.task('default', ['javascript']);
gulp.task('es5', ['es5ificate', 'es5ificate-example'])
