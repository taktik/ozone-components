/**
 * Created by hubert on 8/06/17.
 */
const gulp = require('gulp');
const inject = require('gulp-inject');
const clean = require('gulp-clean');

gulp.task('index', function () {
    var target = gulp.src('./ozone/include_template.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['./ozone/model/*.js'], {read: false});

    return target.pipe(inject(sources))
        .pipe(gulp.dest('./build'));
});

var build = require('gulp-build');

gulp.task('build', function() {
    gulp.src('ozone/model/*.js')
        .pipe(build())
        .pipe(gulp.dest('dist'))
});

/**
 * Clean build directory
 */
gulp.task('clean', function() {
    return gulp.src(['./dist'] )
        .pipe(clean());
});


gulp.task('type', function() {
    return gulp.src(['./ozone/model/*.d.ts'])
        .pipe(gulp.dest('./type'));
})
