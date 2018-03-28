/**
 * Created by hubert on 6/06/17.
 */
const gulp = require ('gulp');
const gutil = require('gulp-util');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const fs = require('fs');

const setVersion = function (cb) {
    gutil.log('Start setVersion')
    const command = 'git describe --tags --abbrev=10 --dirty --always';
    const opt = {env: process.env};
    exec(command, opt, function (err, stdout) {
        if (err != null) {
            throw "Cannot get version from git: " + err
        }
        gutil.log('Version ' + stdout.trim());
        fs.writeFileSync('dist/version.json', '{ "version" : "' + stdout.trim() + '" }');
        cb()
    });
}
// Set version
gulp.task('set-version', setVersion );


/*   DOCKER  */

const dockerImageName = 'docker.taktik.be/ozone_component_demo';

gulp.task('release', function (cb) {
    gutil.log('Repare release');

    const build = spawn(`npm`, ['run', 'start'], {env: process.env});
    build.stdout.on('data', (data) => {
        process.stdout.write(data.toString());
    });
    build.stderr.on('data', (data) => {
        process.stderr.write(data.toString());
    });
    build.on('close', () => setVersion(cb))
});

gulp.task('docker:build', ['release'], function (cb) {
    const version = JSON.parse(fs.readFileSync('dist/version.json')).version;
    gutil.log('Building docker image ' + dockerImageName + ':' + version);

    const build = spawn(`docker`, ['build', '--pull', '-t', dockerImageName + ':' + version, '.'], {env: process.env});
    build.stdout.on('data', (data) => {
        process.stdout.write(data.toString());
    });
    build.stderr.on('data', (data) => {
        process.stderr.write(data.toString());
    });
    build.on('close', cb)
});

gulp.task('docker:push', ['docker:build'], function (cb) {
    const version = JSON.parse(fs.readFileSync('dist/version.json')).version;
    if (version.includes('-dirty')) {
        gutil.log("You should not push a dirty docker image")
       // throw "You should not push a dirty docker image"
    }
    exec('docker push ' + dockerImageName + ':' + version, {env: process.env}, function (err, stdout) {
        if (err != null) {
            throw "Failed to push docker image: " + err
        }
        gutil.log('Pushed docker image ' + dockerImageName + ':' + version);
        cb()
    });
});



