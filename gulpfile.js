'use strict';

var gulp = require('gulp'),
  usemin = require('gulp-usemin'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  minifyHtml = require('gulp-minify-html'),
  minifyCss = require('gulp-minify-css'),
  compass = require('gulp-compass'),
  header = require('gulp-header'),
  imagemin = require('gulp-imagemin'),
  templateCache = require('gulp-angular-templatecache'),
  refresh = require('gulp-livereload'),
  revall = require('gulp-rev-all'),
  gzip = require('gulp-gzip'),
  rsync = require('gulp-rsync'),
  lrserver = require('tiny-lr')(),
  express = require('express'),
  livereload = require('connect-livereload'),
  minimist = require('minimist'),
  configServer = require('./config/server');

// Cli Options
var defaults = {
  port: 5000,
  liveReloadPort: 35727
};

var options = minimist(process.argv.slice(2), {
  alias: {
    p: 'port',
    b: 'liveReloadPort'
  },
  default: defaults
});

// Deploy Settings
var deployOptions = {
  root: 'build',
  username: 'webadmin',
  hostname: 'xtunes.cn',
  destination: '/opt/frontend-apps/demo'
};

// Header configuration
var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''
].join('\n');

// Compilation tasks
gulp.task('clean', function(cb) {
  del.sync('./build');
  cb(null);
});

gulp.task('compass', function () {
    return gulp.src('./app/css/*.scss')
        .pipe(compass({
            css: '.tmp/css',
            sass: 'app/css',
            image: 'app/img'
        }))
        .on('error', function(err) {
          console.log(err.message);
          this.emit('end');
        })
        .pipe(gulp.dest('./.tmp'))
        .pipe(refresh(lrserver));
});

gulp.task('views', function() {
  return gulp.src('./app/tpl/**/*.html')
    .pipe(templateCache({
      module: 'app',
      root: 'tpl'
    }))
    .pipe(gulp.dest('./.tmp/js'));
});

gulp.task('images', function() {
  return gulp.src('./app/img/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('./build/img'));
});

gulp.task('fonts', function(){
  return gulp.src(['./app/fonts/**'])
    .pipe(gulp.dest('build/fonts/'));
});

gulp.task('copy', function(){
  return gulp.src('./app/+(vendor|js|l10n)/**',{ base: './app' })
    .pipe(gulp.dest('build/'));
});

// gulp.task('compile', ['clean', 'views', 'images', 'compass', 'lint'], function() {
gulp.task('usemin', ['clean', 'images', 'compass'], function() {
  var projectHeader = header(banner, {
    pkg: pkg
  });

  return gulp.src('./app/*.html')
    .pipe(usemin({
      css: [minifyCss({noAdvanced: true}), projectHeader],
      html: [minifyHtml({empty:true, quotes:true, conditionals:true})],
      js: [uglify(), projectHeader],
      jslibs: [uglify()]
    }))
    .pipe(gulp.dest('build/'))
    ;
});

gulp.task('rev',['usemin'],function(){
  return gulp.src('build/**')
    .pipe(revall({
        ignore: [/^\/favicon.ico$/g,'.html']
      }))
    .pipe(gulp.dest('build/'))
    .pipe(revall.manifest())
    .pipe(gulp.dest('build/'))
    ;
});

gulp.task('gzip',['rev'],function(){
  return gulp.src(['./build/**/*.css','./build/**/*.js'])
    .pipe(gzip())
    .pipe(gulp.dest('build/'));
});

gulp.task('compile',['gzip']);


gulp.task('watch', function() {
  gulp.watch('app/css/**/*.scss', ['compass'])
    .on('changed',function(event){
      console.log('File ' + event.path + ' was ' + event.type);
    });
  gulp.watch(['app/js/**','app/css/**/*.css'], function(event){
    gulp.src(event.path)
      .pipe(refresh(lrserver));
    console.log('File ' + event.path + ' was ' + event.type);
  });
  gulp.watch('app/**/*.html',function(event){
    gulp.src('app/index.html')
      .pipe(refresh(lrserver));
    console.log('File ' + event.path + ' was ' + event.type);
  });
});


gulp.task('serve', ['watch','compass'], function() {
  var server = express();

  server.use(livereload({
    port: options.liveReloadPort
  }));
  server.use(express.static('./.tmp'));
  server.use(express.static('./app'));
  configServer(server);
  server.listen(options.port);
  lrserver.listen(options.liveReloadPort);
  console.log('Express server listening on port ' + options.port);
  console.log('Livereload server listening on port ' + options.liveReloadPort);
});

gulp.task('serve:build', function() {
  var server = express();
  server.set('root','./build');
  server.use(express.static('./build'));
  configServer(server);
  server.listen(options.port);
  console.log('Express server listening on port ' + options.port);
});

gulp.task('deploy', function() {
  return gulp.src('build/**')
    .pipe(rsync(deployOptions));
});

gulp.task('default', ['compile']);
