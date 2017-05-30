var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var copy = require("gulp-contrib-copy");
var clean = require('gulp-contrib-clean');
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var uglify = require("gulp-uglify");
var server = require("browser-sync");
var rename = require("gulp-rename");
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var svgSprite = require("gulp-svg-sprites");
var filter = require('gulp-filter');
var svg2png = require('gulp-svg2png');
var path = require('path');
var pug = require('gulp-pug');


gulp.task('html', function buildHTML() {
    return gulp.src('pug/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'));
});

gulp.task("style", function() {
    gulp.src("less/style.less")
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([
            autoprefixer({
                browsers: [
                    "last 3 version",
                    "last 3 Chrome versions",
                    "last 3 Firefox versions",
                    "last 3 Opera versions",
                    "last 2 Edge versions",
                    "ie >= 9"
                ]
            })

        ]))

        .pipe(gulp.dest("build/css"))
        .pipe(csso())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.reload({
            stream: true
        }));
});


gulp.task('sprite-svg', function() {
    return gulp.src('img/icons-svg/*.svg')
        .pipe(svgSprite({
            cssFile: "less/sprites/sprite-svg.less",
            svg: {
                sprite: "img/sprites/sprite-svg.svg"
            },
            preview: false
        }))
        .pipe(gulp.dest("."))
        .pipe(filter("**/*.svg")) // Filter out everything except the SVG file
        //.pipe(svg2png()) // Create a PNG
        .pipe(gulp.dest("."));
});

gulp.task('sprite-inline-rules', function() {
    return gulp
        .src('img/icons-svg-inline/icons-rules/*.svg')
        .pipe(svgmin(function(file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(rename('sprite-inline-rules.svg'))
        .pipe(gulp.dest('img/sprites'));
});

gulp.task('sprite-inline-route', function() {
    return gulp
        .src('img/icons-svg-inline/icons-route/*.svg')
        .pipe(svgmin(function(file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(rename('sprite-inline-route.svg'))
        .pipe(gulp.dest('img/sprites'));
});

gulp.task('sprite-inline-general', function() {
    return gulp
        .src('img/icons-svg-inline/icons-general/*.svg')
        .pipe(svgmin(function(file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(rename('sprite-inline-general.svg'))
        .pipe(gulp.dest('img/sprites'));
});

gulp.task("image-copy", function() {
  gulp.src("img/**/*")
      .pipe(copy())
      .pipe(gulp.dest("build/img"));
});

gulp.task('svg-min', function() {
    return gulp
        .src('img/img-svg/*.svg')
        .pipe(svgmin(function(file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(gulp.dest('build/img/img-svg'));
});


gulp.task("copy-sprite", ["sprite-svg", "sprite-inline-rules", "sprite-inline-route", "sprite-inline-general"], function() {
    gulp.src("img/sprites/**/*")
        .pipe(copy())
        .pipe(gulp.dest("build/img/sprites"));
});

gulp.task("image", ["image-copy", "svg-min", "copy-sprite"]);

gulp.task("copy-vendor", function() {
    gulp.src("vendor/**/*")
        .pipe(copy())
        .pipe(gulp.dest("build/vendor"));
});

gulp.task("copy-fonts", function() {
    gulp.src("fonts/**/*")
        .pipe(copy())
        .pipe(gulp.dest("build/fonts"));
});

gulp.task("min-js", function() {
    gulp.src("scripts/**/*.js")
        .pipe(plumber())
        .pipe(gulp.dest("build/scripts/"))
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.basename += ".min";
            path.extname = ".js"
        }))
        .pipe(gulp.dest("build/scripts/"));
});

gulp.task("clean", function() {
    return gulp.src("build", {
            read: false
        })
        .pipe(clean());
});



gulp.task("show", function() {
    server.init({
        server: "build",
        notify: false,
        open: true,
        ui: false
    });

    gulp.watch("less/**/*.less", ["style"]).on("change", server.reload);
    gulp.watch("pug/**/*.pug", ["html"]).on("change", server.reload);
    gulp.watch("img/**/*.{png,jpg,gif}", ["image"]).on("change", server.reload);
    //gulp.watch("img/sprites/*.{png,svg}", ["copy-sprite"]).on("change", server.reload);
    gulp.watch("scripts/**/*.js", ["min-js"]).on("change", server.reload);
    gulp.watch("vendor/**/*.js", ["copy-vendor"]).on("change", server.reload);
    gulp.watch("fonts/**/*", ["copy-fonts"]).on("change", server.reload);
});

gulp.task("build", ["clean", "html", "style", "copy-fonts", "copy-vendor", "image", "min-js"]);
