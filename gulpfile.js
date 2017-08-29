var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

// Static Server
gulp.task('serve', function() {
  browserSync.init({
    server: '.'
  });
});

// Watching scss/less/html files
gulp.task('watch', ['serve', 'sass', 'js'], function() {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/index.html').on('change', browserSync.reload);
});

// Compile SASS into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src('src/scss/*.scss')
    .pipe(sass({
      sourceComments: 'map',
      sourceMap: 'scss'
    }))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream());
});

// Compile ES6 JavaScript modules & auto-inject into browsers
gulp.task('js', function() {
  return browserify('src/js/index.js')
    .transform('babelify', { presets: ['env', 'react'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('assets/js'))
    .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
gulp.task('server', ['serve']);
gulp.task('dev', ['watch']);
