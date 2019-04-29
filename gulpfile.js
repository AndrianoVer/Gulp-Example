
/* -------- My Tasks ------- */
var gulp 		 = require('gulp'),
	sass 		 = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat 		 = require('gulp-concat'),
	uglify 		 = require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin 	 = require('gulp-imagemin'),
	rename 		 = require("gulp-rename"),
	del 		 = require("del"),
	plumber 	 = require('gulp-plumber'),
	babel		 = require('gulp-babel');	
	
ghpages.publish('dist', function (err) {});
reload = browserSync.reload;

/* ------ Styles-Compile ----- */
gulp.task('sass', function() {
  return gulp.src('src/scss/**/*.scss')
	.pipe(plumber())
	.pipe(sass({outputStyle: 'compressed'}))
	.pipe(autoprefixer({
		browsers: ['last 10 versions']
	}))
	.pipe(rename({suffix:'.min'}))
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({
		stream: true
	}));
});

/* ------ Compress images ----- */
gulp.task('image', function() {
  return gulp.src('src/img/*.*')
	.pipe(plumber())
	.pipe(imagemin())
	.pipe(gulp.dest('src/compressimage'))
	.pipe(browserSync.reload({
		stream: true
	}));
});

/* ----- JS-Concat-Uglify  ---- */
gulp.task('scripts', function() {
  return gulp.src('src/js/assets/*.js')
	.pipe(plumber())
	.pipe(babel({
		presets: ["@babel/preset-env"]
	}))
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'))
	.pipe(browserSync.reload({
		stream: true
	}));
})

/* ------------ Server  ------------ */
gulp.task('browserSync', function() {
	browserSync({
		server: {		
			baseDir: 'src'
		},
		notify: false
	})
});


/* ------- Clean our folder => dist  ------- */
gulp.task('build:cleanfolder', function() {
	del([
		'dist/**'
	], )
})

/* ------- Copy all content to folder => dist  ------- */
gulp.task('build:copy', ['build:cleanfolder'], function() {
	return gulp.src('src/**/*')
	.pipe(gulp.dest('dist/'))
});

/* --- Remove contant, that we don't want to see in folder => dist  --- */
gulp.task('build:remove', ['build:copy'], function() {
	del([
		'dist/scss',
		'dist/img',
		'dist/js/!(*.min.js)',
		'!(dist/compressimage)'
	], );

});

/* ------- Final task BUILD ------- */
gulp.task('build', ['build:copy', 'build:remove']);

/* -------------------------- Watchers -------------------------- */
gulp.task('watch', ['browserSync', 'sass', 'scripts', 'image', 'build'], function () {
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/img/*', ['image']);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/js/**/*.js', ['scripts']);

});

gulp.task('default', ['watch']);