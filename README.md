### Streamline Plugin for `gulp`

__Note__ Only tested so far with `callbacks` mode. In theory all modes should work, as we just let streamline handle
this compile, and we pipe it to gulp.

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
and compile functions take. See [here](https://github.com/Sage/streamlinejs/blob/master/lib/compiler/compile._js#L339)

##### Example:
Produce source maps, make the scripts `standalone`, and
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
__Note__: `sourcemaps`: Currently you can only generate sourcemaps as a separate file. This means that when
providing the `sourceMap: 1` option, the write stream will get another file obj. Using the above example,
you would write both files to the same `./compiled` directory. You could intercept the stream in another `pipe`
and redirect the sourcemap file somewhere else.

#### `gulp-streamlinejs` Specific options

`singleMode` in conjunction with `filePath`. These are both needed when used. The turns the plugin into something that can accept regular
node read streams (i.e. Buffers). It is useful for unit testing, and also makes the plugin a bit more flexible. For instance,
you can dual purpose the plugin to do a quick programmatic compile.

##### Example:
```javsacript
fs.createReadStream('./foo._coffee')
.pipe(streamline({
  singleMode: true,
  filePath: './foo._coffee',
  bare: true
}))
.pipe(fs.createWriteStream('foo.js'))
```

`bare` - this is used above. In normal gulp, we always pass a `Vinyl` file object back to the stream. If you set `bare: 1`, then
you will get a normal node Buffer written back to the stream. This makes the above example work.

__Note__: this option was added to provide a way to distinguish between compiled files and map files in the stream. Therefore, if you set
`bare: 1`, the `sourceMap: 1` will be ignored, as you probably don't want two objects in the stream if you are doing something like the above
example.

### Contributions

Any contributions welcome!
