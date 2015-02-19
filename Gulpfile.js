"use strict";

// Load required Grunt tasks. These are installed based on the versions
// listed in "packages.json" when you do "npm install" in this directory.

var fs = require("fs");
var path = require("path");
var del = require("del");

var gulp = require("gulp");
var gutil = require("gulp-util");
var gulpif = require('gulp-if');
var copy = require("gulp-copy");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var bump = require("gulp-bump");
var moment = require("moment");
var header = require("gulp-header");
var tap = require("gulp-tap");

//var jshint = require("gulp-jshint");
//var watch = require("gulp-watch");
  
// load in out build configuration file.
var cfg = require('./build.config.js');

// We are reading the file through fs because teh bump task needs to
// overwrite it and we cannot do it if the file is readed using the
// require() function.
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

var today = moment();

var banner =
  '/**\n' +
  ' * <%= pkg.name %> - v<%= pkg.version %> - <%= today.format("yyyy-mm-dd") %>)\n' +
  ' * <%= pkg.homepage %>\n' +
  ' * \n' +
  ' * Copyright (c) <%= today.format("yyyy") %> <%= pkg.author %>\n' +
  ' * Licensed <%= pkg.license %>\n' +
  ' */\n';

var asset_suffix = path.join(cfg.assets_dir, pkg.name + '-' + pkg.version);

// we'll keep the name of script files and styles in memory.
var scripts = {}, styles = {};

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
gulp.task('clean', function () {
  del([cfg.build_dir, cfg.compile_dir]);
});

/**
 * The `copy` tasks just copies files from A to B. We use it here to copy
 * our project assets (images, fontsm etc.) and javascripts into
 * `build-dir`, and then to copy the assets to `compile_dir`.
 */
gulp.task('copy:build_app_assets', function () {
  gulp.src(path.join('.', 'src', cfg.assets_dir, '**'))
    .pipe(copy(path.join(cfg.build_dir, cfg.assets_dir)));
});

gulp.task('copy:build_vendor_assets', function () {
  gulp.src(cfg.vendor_files.assets)
    .pipe(copy(path.join(cfg.build_dir, cfg.assets_dir)));
});

gulp.task('copy:build_appjs', function () {
  gulp.src(cfg.app_files.js)
    .pipe(copy(cfg.build_dir));
});

gulp.task('copy:build_vendorjs', function () {
  gulp.src(cfg.vendor_files.js)
    .pipe(copy(cfg.build_dir));
});

gulp.task('copy:build_vendorcss', function () {
  gulp.src(cfg.vendor_files.css)
    .pipe(copy(cfg.build_dir));
});

gulp.task('copy:compile_assets', function () {
  gulp.src(path.join(cfg.build_dir, cfg.assets_dir, '**'))
    .pipe(copy(cfg.compile_dir + cfg.assets_dir));
  
  gulp.src(cfg.vendor_files.css)
    .pipe(copy(cfg.compile_dir));
});

/**
 * Concatenates multiple source files into a single file and minifies it
 * we are compiling it.
 */
gulp.task('concat:css', function () {
  gulp.src(cfg.vendor_files.css)
    .pipe(concat(path.join(cfg.build_dir, asset_suffix + '.css')));
});

/**
 * Concatenates multiple js files into a single js file and minifies it
 * we are compiling.
 */
gulp.task('concat:js', function () {
  var src = cfg.vendor_files.js.concat([
    'module.prefix',
    path.join(cfg.build_dir, 'src', '**', '*.js'),
    'module.suffix'
  ]);
  
  gulp.src(src)
    .pipe(header(banner, {pkg : pkg}))
    .pipe(gulp.dest(path.join(cfg.compile_dir, asset_suffix + '.js')));
});

/**
 * Minify the compiled sources.
 */
gulp.task('uglify', function () {
  gulp.src(path.join(cfg.compile_dir, asset_suffix + '.js'))
    .pipe(uglify());
});

/**
 * This task compiles the index.html file as a Gulp Lo-Dash/Underscore
 * template. During development, we don't want to have to wait for
 * compilation, concatenation, minification, etc. So to avoid this steps,
 * we simply add all scripts files directly to the `<head>` of `index.html`.
 */
gulp.task('index:build', function () {
  var files = cfg.vendor_files.js.concat([
    path.join(cfg.build_dir, 'src', '**', '*.js'),
    path.join(cfg.build_dir, 'assets', asset_suffix + '.css')
  ]).concat(cfg.vendor_files.css);

  return gulp.src(files)
    .pipe(tap(function (file) {
      if (path.extname(file.path) === '.js') {
        scripts[path.basename(file.path)] = 0;
      } else {
        styles[path.basename(file.path)] = 0;
      }
    }));
});

gulp.task('default', ['clean', 'index:build'], function () {
  console.log(scripts);
});