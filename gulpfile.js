var gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const merge = require("merge-stream");

gulp.task('sass', function(){
    return gulp.src('app/scss/vz-tco-calculator.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(concat('vz-tco-calculator.min.css'))
        .pipe(gulp.dest('vz-tco-calculator/css'))
});

gulp.task('js', function(){
    return gulp.src(['app/js/plugins/ejs.js', 'app/js/plugins/tooltip.js', 'app/js/plugins/popover.js', 'app/js/vz-tco-calculator.js'])
        .pipe(concat('vhc-signup-widget.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('vz-tco-calculator/js'));
});
gulp.task('copy-resources', function() {
    return merge([
        gulp.src(['./app/img/*.*', './app/img/**/*.*']).pipe(gulp.dest('./vz-tco-calculator/img')),
        gulp.src('./app/partial/*.ejs').pipe(gulp.dest('./vz-tco-calculator/partial')),
        // gulp.src('./app/js/plugins/*.js').pipe(gulp.dest('./vz-tco-calculator/js/plugins'))
    ]);
});

gulp.task('watch', function(){
    gulp.watch('app/scss/*.scss', gulp.series('sass'));
    gulp.watch('app/partial/*.ejs', gulp.series('copy-resources'));
    gulp.watch('app/js/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series('sass', 'js', 'copy-resources', 'watch'));