const { src, dest, parallel, watch, series } = require("gulp");
const uglify = require("gulp-uglify");
const livereload = require("gulp-livereload");
const concat = require("gulp-concat");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const browserSync = require("browser-sync").create();

var gulp = require("gulp");

// File paths
var DIST_PATH = "public";
var SCRIPTS_PATH = "scripts/**/*.js";
var SASS_PATH = "sass/**/*.scss";
var HTML_PATH = "index.html";
var IMAGES_PATH = "images/**/*.{png,jpeg,jpg,svg,gif}";

//Image Compression
var imagemin = require("gulp-imagemin");
var imageminPngquant = require("imagemin-pngquant");
var imageminJpegRecompress = require("imagemin-jpeg-recompress");

console.log(">>>>>", __dirname);

function compileSass(cb) {
  src(SASS_PATH) // Gets all files ending with .scss in app/scss and children dirs
    .pipe(plumber())
    .pipe(
      sass({
        includePaths: ["scss"].concat()
      })
    )
    .pipe(dest("public/css"))
    .pipe(livereload());
  cb();
}

// Scripts

function scripts(cb) {
  src(SCRIPTS_PATH)
    .pipe(
      plumber(function(err) {
        console.log("scripts task error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(uglify())
    .pipe(concat("appXHR.js"))
    .pipe(sourcemaps.write())
    .pipe(dest(DIST_PATH + "/js"))
    .pipe(livereload());
  cb();
}

// Images

function images(cb) {
  src(IMAGES_PATH)
    .pipe(
      imagemin([
        imagemin.gifsicle(),
        imagemin.jpegtran(),
        imagemin.optipng(),
        imagemin.svgo(),
        imageminPngquant(),
        imageminJpegRecompress()
      ])
    )
    .pipe(dest(DIST_PATH + "/images"));
  cb();
}

// copies only index html
function html(cb) {
  gulp
    .src(HTML_PATH)
    .pipe(dest("public/"))
    .pipe(livereload());
  cb();
}

//Watch
function watcher(cb) {
  watch(`index.html`).on("change", series(html, browserSync.reload));
  watch(`${SASS_PATH}`).on("change", series(compileSass, browserSync.reload));
  watch(`${SCRIPTS_PATH}`).on("change", series(scripts, browserSync.reload));
  watch(`${IMAGES_PATH}`, { events: "all" }, function imgwatch() {
    series(images, browserSync.reload);
  });

  cb();
}

function server(cb) {
  browserSync.init({
    notify: false,
    open: false,
    server: {
      baseDir: DIST_PATH
    }
  });
  cb();
}

// Default
exports.default = series(
  parallel(compileSass, images, scripts, html),
  server,
  watcher
);
