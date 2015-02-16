"use strict";

// Load required Grunt tasks. These are installed based on the versions
// listed in "packages.json" when you do "npm install" in this directory.

var gulp = require("gulp");
var gutil = require("gulp-util");
var del = require("del");
var copy = require("gulp-copy");
//var concat = require("gulp-concat");
//var jshint = require("gulp-jshint");
//var uglify = require("gulp-uglify");
//var watch = require("gulp-watch");
var bump = require("gulp-bump");
var fs = require("fs");
  
// load in out build configuration file.
var cfg = require('./build.config.js');

var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

var banner =
    '/**\n' +
    ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd" %>) %>\n' +
    ' * <%= pkg.homepage %>\n' +
    ' * \n' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
    ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
    ' */\n';

/**
 * Increments the version number, etc.
 */
gulp.task('bump', function () {
  gulp.src(['package.json', 'bower.json'])
    .pipe(bump())
    .pipe(gulp.dest('.'));
});

/**
 * The directories to delete when `gulp clean` is executed.
 */
gulp.task('clean', function (cb) {
  del([cfg.build_dir,cfg.compile_dir], cb);
});

/**
 * The `copy` tasks just copies files from A to B. We use it here to copy
 * our project assets (images, fontsm etc.) and javascripts into
 * `build-dir`, and then to copy the assets to `compile_dir`.
 */
gulp.task('copy:build_app_assets', function() {
  gulp.src('./src/assets/**')
    .pipe(copy(cfg.build_dir + '/assets/'));
});

gulp.task('copy:build_vendor_assets', function() {
  gulp.src(cfg.vendor_files.assets)
    .pipe(copy(cfg.build_dir + '/assets/'));
});

gulp.task('copy:build_appjs', function() {
  gulp.src(cfg.app_files.js)
    .pipe(copy(cfg.build_dir));
});

gulp.task('copy:build_vendorjs', function() {
  gulp.src(cfg.vendor_files.js)
    .pipe(copy(cfg.build_dir));
});

gulp.task('copy:build_vendorcss', function() {
  gulp.src(cfg.vendor_files.css)
    .pipe(copy(cfg.build_dir));
});

gulp.task('copy:compile_assets', function() {
  gulp.src(cfg.build_dir+'/assets/**')
    .pipe(copy(cfg.compile_dir + '/assets/'));
  
  gulp.src(vendor_files.css)
    .pipe(copy(cfg.compile_dir));
});
