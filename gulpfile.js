var gulp = require('gulp');
var replace = require('gulp-replace');

gulp.task('build-gen', function() {
    gulp.src(['css', 'js', 'views', 'index.html'])
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-css', ['build-gen'], function() {
    gulp.src('css/*')
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('build-js', ['build-gen'], function() {
    gulp.src('js/*')
        .pipe(gulp.dest('./dist/js'));
    gulp.src('js/vendor/*')
        .pipe(gulp.dest('./dist/js/vendor'));
});

gulp.task('build-views', ['build-gen'], function() {
    gulp.src('views/*')
        .pipe(gulp.dest('./dist/views'));
    gulp.src('views/partials/*')
        .pipe(gulp.dest('./dist/views/partials'));
});

gulp.task('api-replace', ['build-gen', 'build-js'], function(){
    gulp.src(['js/app.js'])
        .pipe(replace('c261b092751f882fc73f28f6e672adf50626d0a7', 'APIKEY'))
        .pipe(replace('twilight-bird-3277', 'INSTANCE'))
        .pipe(replace('testdata', 'CLASS'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('build', ['build-gen', 'build-css', 'build-js', 'build-views', 'api-replace']);