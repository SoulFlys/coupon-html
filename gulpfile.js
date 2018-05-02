var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('default', function() {
    return gulp.src('*.jade')
            .pipe(jade())
            .pipe(minify())
            .pipe(gulp.dest('docs/'));
});



// var gulp = require('gulp');
//
// // 引入组件
// var jshint = require('gulp-jshint');
// var sass = require('gulp-sass');
// var concat = require('gulp-concat');
// var uglify = require('gulp-uglify');
// var rename = require('gulp-rename');
//
// // 检查脚本
// gulp.task('lint', function() {
//     gulp.src('./js/*.js')
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });
//
// // 编译Sass
// gulp.task('sass', function() {
//     gulp.src('./scss/*.scss')
//         .pipe(sass())
//         .pipe(gulp.dest('./css'));
// });
//
// // 合并，压缩文件
// gulp.task('scripts', function() {
//     gulp.src('./js/*.js')
//         .pipe(concat('all.js'))
//         .pipe(gulp.dest('./dist'))
//         .pipe(rename('all.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('./dist'));
// });
//
// // 默认任务
// gulp.task('default', function(){
//     gulp.run('lint', 'sass', 'scripts');
//
//     // 监听文件变化
//     gulp.watch('./js/*.js', function(){
//         gulp.run('lint', 'sass', 'scripts');
//     });
// });




















// var gulp = require('gulp');
// var autoprefixer = require('gulp-autoprefixer');
// var concat = require('gulp-concat');
// var imagemin = require('gulp-imagemin');
// var htmlmin = require('gulp-htmlmin');
// var rev = require('gulp-rev');
// var revCollector = require('gulp-rev-collector');
// var uglify = require('gulp-uglify');
//
// // 处理CSS
// gulp.task('css', function () {
//     return gulp.src('./css/*.css', {base: './'})
//                .pipe(autoprefixer())
//                .pipe(gulp.dest('./dist'));
// });
//
// // 此处就不做CSS压缩的演示了，原理相同。
//
// // 压缩js
// gulp.task('js', function() {
//     return gulp.src('./js/*.js', {base: './'})
//                .pipe(uglify())
//                .pipe(gulp.dest('./dist'));
// });
//
// // 压缩图片
// gulp.task('image', function () {
//     return gulp.src('./images/*', {base: './'})
//                .pipe(imagemin())
//                .pipe(gulp.dest('./dist'));
// });
//
// // 压缩html
// gulp.task('html', function () {
//     return gulp.src('./*.html')
//                .pipe(htmlmin({
//                    removeComments: true,
//                    collapseWhitespace: true,
//                    minifyJS: true
//                }))
//                .pipe(gulp.dest('./dist'));
// });
//
// // 生成hash文件名
// gulp.task('rev',['css', 'js', 'image', 'html'], function () {
//     // 其中加!前缀的是表示过滤该文件
//     return gulp.src(['./dist/**/*', '!**/*.html'], {base: './dist'})
//                .pipe(rev())
//                .pipe(gulp.dest('./dist'))
//                .pipe(rev.manifest())
//                .pipe(gulp.dest('./rev'));
// });
//
// // 替换文件路径
// gulp.task('revCollector',['rev'], function () {
//     // 根据生成的json文件，去替换html里的路径
//     return gulp.src(['./rev/*.json', './dist/*.html'])
//                .pipe(revCollector())
//                .pipe(gulp.dest('./dist'));
// });
// // gulp中默认以default为任务名称
// gulp.task('default', ['revCollector']);

























// // Utilities
// var autoprefixer = require('autoprefixer');
// var cssnano = require('cssnano');
// var fs = require('fs');
//
// // Gulp
// var gulp = require('gulp');
//
// // Gulp plugins
// var concat = require('gulp-concat');
// var gutil = require('gulp-util');
// var header = require('gulp-header');
// var postcss = require('gulp-postcss');
// var rename = require('gulp-rename');
// var runSequence = require('run-sequence');
//
// // Misc/global vars
// var pkg = JSON.parse(fs.readFileSync('package.json'));
// var activatedAnimations = activateAnimations();
//
// // Task options
// var opts = {
//   destPath: './',
//   concatName: 'animate.css',
//
//   autoprefixer: {
//     browsers: ['last 2 versions'],
//     cascade: false
//   },
//
//   minRename: {
//     suffix: '.min'
//   },
//
//   banner: [
//     '@charset "UTF-8";\n',
//     '/*!',
//     ' * <%= name %> -<%= homepage %>',
//     ' * Version - <%= version %>',
//     ' * Licensed under the MIT license - http://opensource.org/licenses/MIT',
//     ' *',
//     ' * Copyright (c) <%= new Date().getFullYear() %> <%= author.name %>',
//     ' */\n\n'
//   ].join('\n')
// };
//
// // ----------------------------
// // Gulp task definitions
// // ----------------------------
//
// gulp.task('default', function() {
//   runSequence('createCSS', 'addHeader');
// });
//
// gulp.task('createCSS', function() {
//   return gulp.src(activatedAnimations)
//     .pipe(concat(opts.concatName))
//     .pipe(postcss([
//       autoprefixer(opts.autoprefixer)
//     ]))
//     .pipe(gulp.dest(opts.destPath))
//     .pipe(postcss([
//       autoprefixer(opts.autoprefixer),
//       cssnano({reduceIdents: {keyframes: false}})
//     ]))
//     .pipe(rename(opts.minRename))
//     .pipe(gulp.dest(opts.destPath));
// });
//
// gulp.task('addHeader', function() {
//   return gulp.src('*.css')
//     .pipe(header(opts.banner, pkg))
//     .pipe(gulp.dest(opts.destPath));
// });
//
// // ----------------------------
// // Helpers/functions
// // ----------------------------
//
// // Read the config file and return an array of the animations to be activated
// function activateAnimations() {
//   var categories = JSON.parse(fs.readFileSync('animate-config.json')),
//     category, files, file,
//     target = [ 'source/_base.css' ],
//     count = 0;
//
//   for (category in categories) {
//     if (categories.hasOwnProperty(category)) {
//       files = categories[category];
//
//       for (var i = 0; i < files.length; ++i) {
//         target.push('source/' + category + '/' + files[i] + '.css');
//         count += 1;
//       }
//     }
//   }
//
//   if (!count) {
//     gutil.log('No animations activated.');
//   } else {
//     gutil.log(count + (count > 1 ? ' animations' : ' animation') + ' activated.');
//   }
//
//   return target;
// }
