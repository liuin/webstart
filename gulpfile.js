// 引入 gulp
var gulp = require('gulp'); 

// 引入组件
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var del = require('del');
var notify = require('gulp-notify');
var concat = require('gulp-concat');

// 检查脚本
/*
gulp.task('lint', function() {
    gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
*/

// 编译Sass
/*
gulp.task('sass', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});
*/

//压缩CSS
gulp.task('styles', function() {
  return gulp.src(['css/reset.css','css/idangerous.swiper.css','css/style.css'])
    .pipe(minifycss())
    .pipe(concat("css.css"))
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'styles task complete' }));
});

//js压缩
gulp.task('script', function() {
  return gulp.src(['js/jquery-1.10.1.min.js','js/idangerous.swiper-2.1.min.js','js/script.js'])
    .pipe(concat("js.js"))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'script task complete' }));
});

//压缩图片
gulp.task('images', function() {
  return gulp.src('images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

//清除任务
gulp.task('clean', function(cb) {
    del(['dist/css/*', 'dist/js/*', 'dist/img/*'], cb)
});


// 默认任务

gulp.task('default', ['clean'], function() {
    gulp.start('styles','script','images');
});
