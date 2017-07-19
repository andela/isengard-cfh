const gulp = require('gulp');
const mocha = require('gulp-mocha');
const bower = require('gulp-bower');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');
const clean = require('gulp-clean');

gulp.task('watch', function() {
  // Watch jade files
  gulp.watch('[app/views/**]', function() {
      // Reload the browser
  });
  // Watch sass files
  gulp.watch(['public/css/common.scss', 'public/css/views/articles.scss'], ['sass']);
  // Watch css files
  gulp.watch(['public/css/**'], ['sass']);
  // Watch html files
  gulp.watch(['public/views/**'], ['livereload']);
});

gulp.task('mochaTest', function() {
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      globals: {
        should: require('should')
      }
    }));
});

gulp.task('bower', function() {
  return bower();
});
// Sass task
gulp.task('sass', function () {
  return gulp.src(['public/css/common.scss, public/css/views/articles.scss'])
   .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
   .pipe(gulp.dest('public/css/common.css'));
});
// Nodemon task
gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    ignore: ['README.md', 'node_modules/**', '.DS_Store']
  });
});
// Bower task
gulp.task('bower', function() {
  return bower()
  .pipe(gulp.dest('./public/lib'));
});

// Jshint
gulp.task('jshint', function() {
  return gulp.src(['gruntfile.js', 'public/js/**/*.js', 'test/**/*.js', 'app/**/*.js'])
    .pipe(jshint());
});

// Concurrent Tasks
gulp.task('concurrent', ['watch', 'nodemon']);

/** Installation Sequence */
gulp.task('install', ['clean']);

// Delete bower_components folder
gulp.task('clean', ['move:route'], function() {
  return gulp.src('bower_components', { read: false })
  .pipe(clean());
});
// Move route.js in angular-ui-utils
gulp.task('move:route', ['move:bootstrap'], function() {
  gulp.src('public/lib/angular-ui-utils/modules/route/**/*.*')
  .pipe(gulp.dest('public/lib/angular-ui-utils/modules/'));
});

// Move bootstrap files
gulp.task('move:bootstrap', ['runbower'], function() {
  gulp.src('public/lib/bootstrap/dist/**/*.*')
  .pipe(gulp.dest('public/lib/bootstrap/'));
});

// Bower task
gulp.task('runbower', ['bower']);

// Default task(s)
gulp.task('default', ['jshint', 'concurrent', 'sass']);

// Test task
gulp.task('test', ['mochaTest']);
