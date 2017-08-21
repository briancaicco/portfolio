// Defining base pathes
var basePaths = {
    js: './js/',
    node: './node_modules/',
    dev: './src/'
};


// browser-sync watched files
// automatically reloads the page when files changed
var browserSyncWatchFiles = [
    './css/*.min.css',
    './js/*.min.js',
    './templates/**/*',
    './**/*.html'
];


// browser-sync options
// see: https://www.browsersync.io/docs/options/
var browserSyncOptions = {
    server: true,
    index: "index.html",
    notify: false
};


// Defining requirements
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var merge2 = require('merge2');
var imagemin = require('gulp-imagemin');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var clone = require('gulp-clone');
var merge = require('gulp-merge');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var gulpSequence = require('gulp-sequence');


// Run:
// gulp sass + cssnano + rename
// Prepare the min.css for production (with 2 pipes to be sure that "theme.css" == "theme.min.css")
gulp.task('scss-for-prod', function() {
    var source =  gulp.src('./sass/*.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass());

    // var pipe1 = source.pipe(clone())
    //     .pipe(sourcemaps.write(undefined, { sourceRoot: null }))
    //     .pipe(gulp.dest('./css'))
    //     .pipe(rename('custom-editor-style.css'))


    var pipe2 = source.pipe(clone())
        .pipe(minify-css())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./css'));

    return merge(pipe1, pipe2);
});


// Run:
// gulp sourcemaps + sass + reload(browserSync)
// Prepare the child-theme.css for the development environment
gulp.task('scss-for-dev', function() {
    gulp.src('./sass/*.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass())
        .pipe(sourcemaps.write(undefined, { sourceRoot: null }))
        .pipe(gulp.dest('./css'))
});

gulp.task('watch-scss', ['browser-sync'], function () {
    gulp.watch('./sass/**/*.scss', ['scss-for-dev']);
});


// Run:
// gulp sass
// Compiles SCSS files in CSS
gulp.task('sass', function () {
    var stream = gulp.src('./sass/*.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(gulp.dest('./css'))
    return stream;
});



// Run:
// gulp imagemin
// Running image optimizing task
gulp.task('imagemin', function(){
    gulp.src('img/src/**')
    .pipe(imagemin())
    .pipe(gulp.dest('img'))
});


// Run:
// gulp cssnano
// Minifies CSS files
gulp.task('cssnano', function(){
  return gulp.src('./css/theme.css')
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano({discardComments: {removeAll: true}}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./css/'))
});

gulp.task('minify-css', function() {
  return gulp.src('./css/theme.css')
  .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(cleanCSS({compatibility: '*'}))
    .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
    .pipe(rename({suffix: '.min'}))
     .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./css/'));
});

gulp.task('cleancss', function() {
  return gulp.src('./css/*.min.css', { read: false }) // much faster
    .pipe(ignore('theme.css'))
    .pipe(rimraf());
});


// Run: 
// gulp styles. 
// Compiles sass and minifies CSS
gulp.task('styles', function(callback){ 
    gulpSequence('sass', 'minify-css')(callback) 
});
 

// Run: 
// gulp scripts. 
// Uglifies and concat all JS files into one
gulp.task('scripts', function() {
    var scripts = [
        basePaths.dev + 'js/jquery.min.js',
        basePaths.dev + 'js/sammy.min.js',
        basePaths.dev + 'js/sammy.template.js',
        basePaths.dev + 'js/popper.min.js',
        basePaths.dev + 'js/bootstrap4/bootstrap.min.js',
        basePaths.dev + 'js/core.js',  
        basePaths.dev + 'js/navigation.js',
        basePaths.dev + 'js/skip-link-focus-fix.js',
        basePaths.dev + 'js/jquery.waypoints.min.js',
        basePaths.dev + 'js/waypoints.inview.min.js',
        basePaths.dev + 'js/jquery.lettering.js',

    ];
  gulp.src(scripts)
    .pipe(concat('theme.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js/'));

  gulp.src(scripts)
    .pipe(concat('theme.js'))
    .pipe(gulp.dest('./js/'));
});

 
// Run:
// gulp browser-sync
// Starts browser-sync task for starting the server.
gulp.task('browser-sync', function() {
    browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});


// Run:
// gulp watch
// Starts watcher. Watcher runs gulp sass task on changes
gulp.task('watch', function () {
    gulp.watch('./sass/**/*.scss', ['styles']);
    gulp.watch([basePaths.dev + 'js/**/*.js','js/**/*.js','!js/w3.js','!js/theme.js','!js/theme.min.js'], ['scripts']);

    //Inside the watch task.
    gulp.watch('./img/**', ['imagemin'])
});

// Run:
// gulp watch-bs
// Starts watcher with browser-sync. Browser-sync reloads page automatically on your browser
gulp.task('default', ['browser-sync', 'watch', 'scripts', 'styles'], function () { });
