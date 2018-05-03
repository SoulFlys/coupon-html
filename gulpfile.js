var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var production = process.env.NODE_ENV === 'production';

gulp.task('html', function() {
    gulp.src('./src/*.jade')
        .pipe(jade({pretty: production ? false : '\t'}))
        .pipe(gulp.dest('./docs/'));
});

gulp.task('sass', function() {
    gulp.src('./src/scss/*.scss')
        .pipe(sass({
            outputStyle: production ? 'compressed' : 'expanded',
            indentWidth: production ? 0 : 4
        }))
        .pipe(autoprefixer({browsers: ['last 50 versions']}))
        .pipe(gulp.dest('./docs/css/'));
});

gulp.task('css', function() {
    gulp.src('./src/css/*.css')
        .pipe(autoprefixer({browsers: ['last 50 versions']}))
        .pipe(gulp.dest('./docs/css/'));
});

gulp.task('script', function() {
    gulp.src(['./src/js/*.js', '!./src/js/swiper-4.2.2.min.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(production ? uglify() : jshint())
        .pipe(gulp.dest('./docs/js/'));
});

gulp.task('image', function() {
    gulp.src('./src/img/*.*')
        .pipe(gulp.dest('./docs/img/'));
});

gulp.task('server', function() {
    browserSync.init({server: "./docs"});
});

gulp.task('auto', function() {
    gulp.watch('./src/*.jade', ['html']);
    gulp.watch('./src/css/*.css', ['css']);
    gulp.watch('./src/scss/*.scss', ['sass']);
    gulp.watch('./src/js/*.js', ['script']);
    gulp.watch('./src/img/*.*', ['image']);
    gulp.watch('./docs/**/*.*').on('change', browserSync.reload);
});


gulp.task('default', ['html', 'css', 'sass', 'script', 'image', 'server', 'auto']);
gulp.task('build', ['html', 'css', 'sass', 'script', 'image']);
