var gulp = require('gulp')
var uglify = require('gulp-uglify')
var livereload = require('gulp-livereload')
var concat = require('gulp-concat')
var minifyCss = require('gulp-minify-css')
var autoprefixer = require('gulp-autoprefixer')
var plumber = require('gulp-plumber')
var sourcemaps = require('gulp-sourcemaps')
var sass = require('gulp-sass')
var babel = require('gulp-babel')
var del = require('del')
var zip = require('gulp-zip')
var fs = require('fs');



// File paths
var DIST_PATH = 'public'
var SCRIPTS_PATH = 'scripts/**/*.js'
var SASS_PATH = 'sass/**/*.scss'
var HTML_PATH = 'index.html'
var IMAGES_PATH = 'images/**/*.{png,jpeg,jpg,svg,gif}'

//Image Compression
var imagemin = require('gulp-imagemin')
var imageminPngquant = require('imagemin-pngquant')
var imageminJpegRecompress = require('imagemin-jpeg-recompress')



console.log('>>>>>',__dirname)

gulp.task('sass', function() {
  return gulp.src(SASS_PATH) // Gets all files ending with .scss in app/scss and children dirs
    .pipe(plumber())
    .pipe(sass({
      includePaths: ["scss"].concat()
  }))
    .pipe(gulp.dest('public/css'))
})

// Scripts

gulp.task('scripts', (done) => {
  console.log('fifi starting SCRIPTS task')
  return gulp.src(SCRIPTS_PATH)
      .pipe(plumber(function(err){
          console.log('scripts task error')
          console.log(err)
          this.emit('end');
      }))
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(uglify())
      .pipe(concat('appXHR.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(DIST_PATH+'/js'))
      .pipe(livereload())
  //done()
})

// Images

gulp.task('images',(done) => {
  return gulp.src(IMAGES_PATH)
  .pipe(imagemin(
      [
          imagemin.gifsicle(),
          imagemin.jpegtran(),
          imagemin.optipng(),
          imagemin.svgo(),
          imageminPngquant(),
          imageminJpegRecompress()
      ]
  ))
  .pipe(gulp.dest(DIST_PATH+'/images'))
  done()
})



// copies only index html
gulp.task('html', function () {
  gulp.src(HTML_PATH)
      .pipe(gulp.dest('./public/'));
});

//Watch
gulp.task('watch', function(done){
  console.log('Big Brother is watching you')
  require('./server.js')
  livereload.listen()
  gulp.watch(SCRIPTS_PATH, gulp.series('scripts'))
  //gulp.watch(CSS_PATH, gulp.series('styles'))
  gulp.watch(SASS_PATH, gulp.series('sass'))  
  done()
})



// Default
gulp.task('default',gulp.parallel('sass','images','scripts','html','watch'),function(done){
  console.log('start deFault')
  done()
})

