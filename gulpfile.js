var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    babel = require("gulp-babel"),
    uglify = require('gulp-uglify'),
    plumber = require("gulp-plumber"),
    browserSync = require('browser-sync').create();

var path = {
    dist: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        images: 'dist/images/',
        fonts: 'dist/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/**/*.js', //В стилях и скриптах нам понадобятся только main файлы
        css: 'src/css/**/*.css',
        scss: 'src/scss/**/*.scss',
        images: 'src/images/**/*.*', //Синтаксис images/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        all: '**/*.*',
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        css: 'src/css/**/*.css',
        scss: 'src/scss/**/*.scss',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    }
};

gulp.task('browserSync', function() {
    browserSync.init({
        server: "./dist"
    });
    browserSync.watch(path.watch.all).on('change', browserSync.reload)
});

gulp.task('sass', function () {
    return gulp.src(path.src.scss)
        .pipe(plumber()) // error Handler
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.dist.css))
});

// Copying html
gulp.task('html', function() {
    return gulp.src(path.src.html)
        .pipe(plumber()) // error Handler
        .pipe(gulp.dest(path.dist.html))
});

// Copying css
gulp.task('css', function() {
    return gulp.src(path.src.css)
        .pipe(plumber()) // error Handler
        .pipe(gulp.dest(path.dist.css))
});

// Copying js
gulp.task('js', function() {
    return gulp.src(path.src.js)
        .pipe(plumber()) // error Handler
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.js))
});

// Copying fonts
gulp.task('fonts', function() {
    return gulp.src(path.src.fonts)
        .pipe(plumber()) // error Handler
        .pipe(gulp.dest(path.dist.fonts))
});

// Copying images
gulp.task('images', function() {
    return gulp.src(path.src.images)
        .pipe(plumber()) // error Handler
        .pipe(gulp.dest(path.dist.images))
});

gulp.task('build', gulp.series('html', 'js', 'css', 'sass', 'fonts', 'images'));

gulp.task('watch', function () {
    gulp.watch(path.src.html, gulp.series('html'));
    gulp.watch(path.src.scss, gulp.series('sass'));
    gulp.watch(path.src.css, gulp.series('css'));
    gulp.watch(path.src.js, gulp.series('js'));
    gulp.watch(path.src.fonts, gulp.series('fonts'));
    gulp.watch(path.src.images, gulp.series('images'));
});

gulp.task('default', gulp.series('build', gulp.parallel('browserSync', 'watch')));