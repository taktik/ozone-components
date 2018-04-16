/**
 * Created by hubert on 6/06/17.
 */
const gulp = require ('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const merge = require('merge2');


/**
 * gulp ts
 * compile project's typeScript code
 */
gulp.task('ts', ['clean'], function(){
    const tsProject = ts.createProject('tsconfig.json');

    var tsResult = tsProject.src()
        .pipe(tsProject());

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
        tsResult.dts
            .pipe(gulp.dest('dist')),
        tsResult.js
            .pipe(gulp.dest('dist'))
    ]);
});


/**
 * gulp copy
 * Copy html files in dist directory
 **/
gulp.task('copy', ['clean'], function() {
    return gulp.src(['./src/**/*.html'] )
        .pipe(gulp.dest('./dist'));
});

/**
 * gulp build
 * Generate a npm ready package in dist directory
 **/
gulp.task('build', ['ts', 'copy']);

/**
 * gulp clean
 * Clean build directory
 */
gulp.task('clean', function() {
    return gulp.src(['./dist'] )
        .pipe(clean());
});

gulp.task('default', ['build']);