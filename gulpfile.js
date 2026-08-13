var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
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

// app/js/tco-widget-template.js is kept nicely indented for readability, but
// that indentation/newlines otherwise ship verbatim inside the "minified"
// bundle (uglify never touches string/template-literal contents). This task
// collapses the whitespace inside its returned HTML template literal only,
// writing the result to a generated file that the 'js' task bundles instead
// of the source file. Rendered output is unaffected: browsers already
// collapse runs of whitespace to a single space outside <pre>/<textarea>.
gulp.task('minify-template', function (done) {
    var srcPath = 'app/js/tco-widget-template.js';
    var outPath = 'app/js/generated/tco-widget-template.min.js';

    var content = fs.readFileSync(srcPath, 'utf8');
    var match = content.match(/return `([\s\S]*)`;\n\};\n?$/);
    if (!match) {
        throw new Error("minify-template: couldn't find the template literal in " + srcPath);
    }

    var minifiedHtml = match[1].replace(/\s+/g, ' ').trim();
    var minified = content.slice(0, match.index) + 'return `' + minifiedHtml + '`;\n};\n';

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, minified);
    done();
});

gulp.task('js', gulp.series('minify-template', function(){
    return gulp.src([
        'app/js/generated/tco-widget-template.min.js',
        'app/js/plugins/tooltip.js',
        'app/js/plugins/popover.js',
        'app/js/vz-tco-calculator.js'
    ])
        .pipe(concat('vz-tco-calculator.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('vz-tco-calculator/js'));
}));
gulp.task('copy-resources', function() {
    return merge([
        gulp.src(['./app/img/*.*', './app/img/**/*.*']).pipe(gulp.dest('./vz-tco-calculator/img')),
    ]);
});

gulp.task('watch', function(){
    gulp.watch('app/scss/*.scss', gulp.series('sass'));
    gulp.watch('app/js/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series('sass', 'js', 'copy-resources', 'watch'));