/**
 * Created by hubert on 6/06/17.
 */
const gulp = require ('gulp');
const runSequence = require('run-sequence');
const ts = require('gulp-typescript');
const merge = require('merge2');

/**
 * gulp ts
 * compile project's typeScript code
 */
gulp.task('ts', function(){
    const tsProject = ts.createProject('tsconfig.json');

    var tsResult = tsProject.src()
        .pipe(tsProject());

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
        tsResult.dts
            .pipe(gulp.dest('.')),
        tsResult.js
            .pipe(gulp.dest('.'))
    ]);
});

/**
 * gulp ts:watch
 * Rerun ts task when a ts file changes
 */
gulp.task('ts:watch', function() {
    gulp.watch(['elements/**/*.ts','!elements/**/*.d.ts'], ['ts']);
});


/**
 * gulp test:browserstack
 * Runs WCT on BrowserStack. Requires two environment variables:
 * BROWSERSTACK_KEY and BROWSERSTACK_USER.
 */
gulp.task('test:browserstack', function(cb) {
    var user = process.env.BROWSERSTACK_USER;
    var key = process.env.BROWSERSTACK_KEY;
    if (!user || !key) {
        throw new Error('Missing BrowserStack credentials. Did you forget to set BROWSERSTACK_USER and/or BROWSERSTACK_KEY?');
    }
    runSequence(
        'starttunnel',

        // "wct:sauce" is currently the name of the task that WCT uses to start tests.
        // The name does not imply a requirement of SauceLabs.
        'wct:sauce',

        'stoptunnel',
        cb);
});


var browserStack = require('gulp-browserstack');
// Starts BrowserStack tunnel
gulp.task('starttunnel', function() {
    return throughObjToPromise(browserStack.startTunnel({
        key: process.env.BROWSERSTACK_KEY,'force': 'true'
    }));
});

// Stops BrowserStack tunnel
gulp.task('stoptunnel', function() {
    return throughObjToPromise(browserStack.stopTunnel());
});
function throughObjToPromise(obj) {
    var p = new Promise(function(resolve, reject) {
        var fn = obj._transform;
        fn('', '', function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
    return p;
}

/**
 * gulp test
 * Alias for wct
 * Load tasks for web-component-tester
 * Adds tasks for `gulp test:local` and `gulp test:remote`
 */
require('web-component-tester').gulp.init(gulp);
