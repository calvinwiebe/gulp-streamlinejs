var through = require('through2'),
  streamline = require('streamline/lib/transformSync').transform,
  applySourceMap = require('vinyl-sourcemaps-apply'),
  gutil = require('gulp-util'),
  PluginError = gutil.PluginError,
  Buffer = require('buffer').Buffer,
  path = require('path');

// utility method to extend an object with an arbitrary amount of
// other objects
function extend() {
  if (arguments.length === 0) return {};
  else if (arguments.length === 1) return arguments[0];
  var obj = arguments[0]
  var others = [].slice.call(arguments, 1);
  for (var i = 0; i < others.length; i++) {
    for (var prop in others[i]) {
      obj[prop] = others[i][prop];
    }
  }
  return obj;
}

function contextualMsg(options) {
  return options.action + ': (' + options.path + ') with error: ' + options.err.message;
}

// Transform a file of a `._coffee`, `.coffee` or `._js` file via
// `streamlinejs` to a `.js` file.
//
// * opt - options that match those that can be passed to streamline's
// [transform](`streamline/lib/transform)
module.exports = function(options) {
  if (options == null) {
    options = {};
  }

  // The through2 object transform function
  function transform(file, enc, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) return cb(new PluginError('gulp-streamlinejs', 'Streaming not supported'));

    var originalPath = file.path;
    var base = path.basename(file.path);
    var ext = path.extname(file.path);
    if (ext !== '._coffee' && ext !== '._js' && ext !== '.coffee') return cb(null, file);

    // make a new copy of options each time as it will be manipulated by `streamline`
    var opts = extend({}, options, {
      filename: originalPath,
      sourceFiles: [originalPath],
      quiet: true,
      runtime: 'callbacks'
    })

    try {
      var data = streamline(file.contents.toString('utf8'), opts);
    } catch (err) {
      return cb(new PluginError('gulp-streamlinejs', contextualMsg({
        action: 'streamlining file',
        path: originalPath,
        err: err
      })));
    }

    if (!data) {
      return cb(null, file);
    }

    file.path = gutil.replaceExtension(file.path, '.js');
    file.contents = new Buffer(data.code);

    if (opts.sourceMap && data.map) {
      try {
        applySourceMap(file, data.map);
      } catch (err) {
        return cb(new PluginError('gulp-streamlinejs', contextualMsg({
          action: 'applying sourcemap to file',
          path: originalPath,
          err: err
        })));
      }
    }

    cb(null, file);
  }

  return through.obj(transform);
};
