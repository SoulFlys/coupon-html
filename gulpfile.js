const gulp = require('gulp');
const jade = require('gulp-jade');
const sass = require('gulp-sass');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const production = process.env.NODE_ENV === 'production';

// 打包后更改资源路径为cdn
const path = require('path');
const fs = require('fs');
const revCollector = require('gulp-rev-collector');

gulp.task('html', function() {
    return gulp.src('./src/*.jade')
        .pipe(jade({pretty: '\t'}))
        .pipe(gulp.dest('./docs/'))
});

gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass({
            outputStyle: 'expanded',
            indentWidth: 4
        }))
        .pipe(autoprefixer({browsers: ['last 50 versions']}))
        .pipe(gulp.dest('./docs/css/'));
});

gulp.task('css', function() {
    return gulp.src('./src/css/*.css')
        .pipe(autoprefixer({browsers: ['last 50 versions']}))
        .pipe(gulp.dest('./docs/css/'))
});

gulp.task('script', function() {
    return gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(production ? uglify() : jshint())
        .pipe(gulp.dest('./docs/js/'));
});

gulp.task('lib', function() {
    return gulp.src('./src/lib/**')
        .pipe(gulp.dest('./docs/lib/'))
});

gulp.task('image', function() {
    return gulp.src('./src/img/*.*')
        .pipe(gulp.dest('./docs/img/'));
});

gulp.task('ico', function() {
    return gulp.src('./src/*.ico')
        .pipe(gulp.dest('./docs/'));
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

gulp.task('writeRevManifest', function() {
    writeRevManifest();
});

gulp.task('revHtml', function () {
    return gulp.src(['./rev-manifest.json', './docs/*.html'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                './css': 'http://static.67one.com/css/',
                './js': 'http://static.67one.com/js/',
                './img': 'http://static.67one.com/img/',
                './lib': 'http://static.67one.com/lib/',
            }
        }))
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeEmptyAttributes: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest('./docs/'));
});

gulp.task('revCss', function () {
    return gulp.src(['./rev-manifest.json', './docs/css/*.css'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                '../img': 'http://static.67one.com/img/'
            }
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./docs/css/'));
});


gulp.task('default', ['html', 'css', 'sass', 'script', 'lib', 'image', 'ico', 'server', 'auto']);
gulp.task('build', ['html', 'css', 'sass', 'script', 'lib', 'image', 'ico']);
gulp.task('push', ['writeRevManifest', 'revHtml', 'revCss']);


function writeRevManifest() {
    let docsPath = path.resolve(__dirname, './docs/');
    let docs = fs.readdirSync(docsPath);
    let files = {};

    docs.forEach(item => {
        let fileDirPath = docsPath.replace(/\\/g, '/') + '/' + item;
        let stat = fs.statSync(fileDirPath)
        if(stat.isDirectory()){
            let filesList = fs.readdirSync(fileDirPath);
            filesList.forEach(file => {
                files[file] = file;
            })
        }
    });

    fs.writeFileSync('rev-manifest.json', JSON.stringify(files))
}
