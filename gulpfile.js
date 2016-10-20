var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('sass', function() {
    gulp.src([
        'modules/**/*.scss'
    ])
        .pipe(concat('style.js'))
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest('build'));
});

gulp.task('compress', function() {
    gulp.src([
        'node_modules/angular/angular.js',
        'modules/libraries/**/*.js',
        'app.js',
        'modules/**/*.js'

    ])
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
    gulp.watch('modules/styles/*.scss', ['sass']);
    gulp.watch('modules/**/*.js', ['compress']);
});

gulp.task('default', ['sass', 'compress', 'watch']);
