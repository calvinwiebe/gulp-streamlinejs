### Streamline Plugin for `gulp`

Usage:
```javascript
var gulp = require('gulp');
var streamline = require('gulp-streamlinejs');
var insert = require('gulp-insert');

var paths = {
    streamlineSrc: [
        'streamline/**/*._coffee',
        'streamline/**/*.coffee',
        'streamline/**/*._js',
        'streamline/**/*.js'
    ],
};

/*
Compile streamline files with gulp-streamlinejs
*/
gulp.task('streamline', function() {
    gulp.src(paths.streamlineSrc)
        .pipe(streamline())
        .pipe(insert.prepend('/* I am at the top!*/\n'))
        .pipe(gulp.dest('./compiled'));
});
```

### Options

It will take all the standard options that the internal streamline transform
and compile functions take. See [here](https://github.com/Sage/streamlinejs/blob/master/lib/compiler/compile._js#L339)

Example:
Produce source maps (currently only in the same directory as the compiled `js`), make the scripts `standalone`, and
use the verbose options
```javascript
gulp.task('streamline', function() {
    gulp.src(paths.streamlineSrc)
        .pipe(streamline({
            sourceMap: 1,
            standalone: 1,
            verbose: 1
        }))
        .pipe(gulp.dest('./compiled'));
});
```
