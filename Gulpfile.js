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
var template = require("gulp-template");
var sequence = require("run-sequence");

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
  ' * <%= pkg.name %> v<%= pkg.version %>\n' +
  ' * <%= pkg.homepage %>\n' +
  ' * \n' +
  ' * Copyright (c) <%= today.format("YYYY") %> <%= pkg.author %>\n' +
  ' * Licensed under the <%= pkg.license %> license\n' +
  ' * \n' +
  ' * Date: <%= today.format("YYYY-MM-DD") %>\n' +
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
  del.sync([cfg.build_dir, cfg.compile_dir]);
});

/**
 * The `copy` tasks just copies files from A to B. We use it here to copy
 * our project assets (images, fonts, etc.) and javascripts into
 * `build-dir`, and then to copy the assets to `compile_dir`.
 */
gulp.task('copy:app_assets', function () {
  return gulp.src([path.join('src', cfg.assets_dir, '**')])
    .pipe(tap(function (file) {
      file.path = path.basename(file.path);
    }))
    .pipe(copy(path.join(cfg.build_dir, cfg.assets_dir)));
});

gulp.task('copy:vendor_assets', function () {
  return gulp.src(cfg.vendor_files.assets)
    .pipe(copy(path.join(cfg.build_dir, cfg.assets_dir)));
});

gulp.task('copy:appjs', function () {
  return gulp.src(cfg.app_files.js)
    .pipe(copy(cfg.build_dir));
});

gulp.task('copy:vendorjs', function () {
  return gulp.src(cfg.vendor_files.js)
    .pipe(copy(cfg.build_dir));
});

gulp.task('copy:vendorcss', function () {
  return gulp.src(cfg.vendor_files.css)
    .pipe(copy(cfg.build_dir));
});

/**
 * Copy the application and vendor assets to the build dir concurrently.
 */
gulp.task('copy:assets', ['copy:app_assets', 'copy:vendor_assets']);

/**
 * Copy the application and vendor assets and application and vendor
 * javascript and CSS concurrently.
 */
gulp.task('copy', [
  'copy:assets', 'copy:vendorcss', 'copy:appjs', 'copy:vendorjs']);

/**
 * Copy all the assets from the `build_dir` to the `compile_dir`.
 */
gulp.task('copy:compile', ['copy:assets'], function () {
  gulp.src(path.join(cfg.build_dir, cfg.assets_dir, '**'))
    //.pipe(tap(function (file) {
    //  file.path = path.basename(file.path);
    //}))
    .pipe(copy(path.join(cfg.compile_dir, cfg.assets_dir)));

  return gulp.src(cfg.vendor_files.css)
    .pipe(copy(cfg.compile_dir));
});

/**
 * Concatenates multiple source files into a single file and minifies it.
 */
gulp.task('concat:css', ['copy:vendorcss'], function () {
  return gulp.src(cfg.vendor_files.css)
    .pipe(concat(path.join(cfg.build_dir, asset_suffix + '.css')));
});

/**
 * Concatenates multiple js files into a single js file and minifies it.
 */
gulp.task('concat:js', ['copy:appjs', 'copy:vendorjs'], function () {
  var src = cfg.vendor_files.js.concat([
    path.join('.', 'module.prefix'),
    path.join(cfg.build_dir, 'src', '**', '*.js'),
    path.join('.', 'module.suffix')
  ]);
  
  return gulp.src(src)
    .pipe(concat(pkg.name + '-' + pkg.version + '.js'))
    .pipe(uglify())
    .pipe(header(banner, {pkg : pkg, today: today}))
    .pipe(gulp.dest(path.join(cfg.compile_dir, cfg.assets_dir)));
});

/**
 * Concatenates and minifies the CSS and javascripts concurrently.
 */
gulp.task('concat', ['concat:css', 'concat:js']);

gulp.task('index', ['copy'], function () {
  var files = [
    path.join(cfg.build_dir, 'vendor', '**', '*.js'),
    path.join(cfg.build_dir, 'src', '**', '*.js'),
    path.join(cfg.build_dir, 'vendor', '**', '.css')
  ];

  return gulp.src(files)
    .pipe(tap(function (file) {
      if (path.extname(file.path) === '.js') {
        scripts[path.basename(file.path)] = 0;
      } else {
        styles[path.basename(file.path)] = 0;
      }
    }));
});

/**
 * This task compiles the index.html file as a Gulp Lo-Dash/Underscore
 * template. During development, we don't want to have to wait for
 * compilation, concatenation, minification, etc. So to avoid this steps,
 * we simply add all scripts files directly to the `<head>` of `index.html`.
 */
gulp.task('index:build', ['index'], function () {
  var m = {
    pkg : pkg,
    scripts : Object.keys(scripts),
    styles : Object.keys(styles)
  };
  
  return gulp.src(path.join("src", "index.html"))
    .pipe(template(m))
    .pipe(gulp.dest(cfg.build_dir));
});

/**
 * This task compiles the index.html file as a Gulp Lo-Dash/Underscore
 * template. When its time to have a completely compiled application, we can
 * alter the above to include only a single javascript file and a single CSS
 * file. Now we're back!
 */
gulp.task('index:compile', ['index', 'copy:compile', 'concat'], function () {
  var m = {
    pkg : pkg,
    scripts : [asset_suffix + '.js'],
    styles : []
  };
  
  return gulp.src(path.join("src", "index.html"))
    .pipe(template(m))
    .pipe(gulp.dest(cfg.compile_dir));
});

gulp.task('build', function () {
  sequence('clean', ['index:build']);
});

gulp.task('default', function () {
  sequence('clean', ['index:compile']);
});