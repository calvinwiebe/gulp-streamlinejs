### Streamline Plugin for `gulp`

Supports all modes of `streamlinejs` (callbacks, fibers, generators, and fast mode of each, respectively)

### Usage
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
and compile functions take. See [here](https://github.com/calvinwiebe/streamlinejs/blob/full-transform-api/lib/transform/index.js#L22)

##### Example:
Produce source maps
```javascript
var sourcemaps = require('gulp-sourcemaps');

gulp.task('streamline', function() {
  gulp.src(paths.streamlineSrc)
  .pipe(sourcemaps.init())
  .pipe(streamline({
    sourceMap: 1
  }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./compiled'));
});
```
__Note__: `sourcemaps`: This follows the `gulp-sourcemaps` convention. It will apply a `vinyl-sourcemaps-apply` to the stream
with the sourcemap, if it is present.

### Contributions

Any contributions welcome!
