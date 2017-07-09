const gulp = require('gulp');
const mocha = require('gulp-mocha');
const bower = require('gulp-bower');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');



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
   .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
   .pipe(gulp.dest('public/css/common.css'));
});
// Nodemon task
gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: {
        'NODE_ENV': 'development',
        'PORT': 3000
    },
    ignore: ['README.md', 'node_modules/**', '.DS_Store']
  })
});
// Bower task
gulp.task('bower', function() {
  return bower({
      verbosity: 2,
      directory: './public/lib'
  });
});

// Jshint
gulp.task('jshint', function() {
  return gulp.src(['gruntfile.js', 'public/js/**/*.js', 'test/**/*.js', 'app/**/*.js'])
    .pipe(jshint());
});
// Concurrent Tasks
gulp.task('concurrent', ['watch', 'nodemon']);
// Default task(s)
gulp.task('default', ['jshint', 'sass'] );
// Test task
gulp.task('test', ['mochaTest']);
// Bower task
gulp.task('install', ['bower']);