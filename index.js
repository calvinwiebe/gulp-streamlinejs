var through = require('through2'),
  streamline = require('streamline/lib/callbacks/compile'),
  gutil = require('gulp-util'),
  PluginError = gutil.PluginError,
  Buffer = require('buffer').Buffer;

// Error handle the inputted data. We support both gulp and non gulp mode. In non
// gulp mode, we turn the inputted Buffer into a Vinyl File for ease, and then process.
// If we find an error, bail out.
var processInput = function(obj, options) {
  var file;
  if (obj instanceof Buffer && options.singleMode) {
    if (!options.filePath) throw new PluginError('gulp-streamlinejs', 'Single mode expects a `filePath`');
    file = new gutil.File({
      path: options.filePath,
      contents: obj
    });
  } else if (options.singleMode) {
    throw new PluginError('gulp-streamlinejs', 'Single mode expects a buffer');
  }
  else {
    file = obj;
  }
  if (file.isNull()) return null;
  if (file.isStream()) throw new PluginError('gulp-streamlinejs', 'Streaming not supported');
  return file;
}

// If `options.sourceMap` and streamline gave us the sourcemap content, add it
// to the stream
var writeSourceMap = function(file) {
  var sourceMapFile = new gutil.File({
      cw: file.cwd,
      base: file.base,
      path: gutil.replaceExtension(file.path, '.map'),
      contents: new Buffer(JSON.stringify(file.sourceMap))
  });
  this.push(sourceMapFile);
}

// Transform a file of a `._coffee`, `.coffee` or `._js` file via
// `streamlinejs` to a `.js` file.
//
// * opt - options that match those that can be passed to streamline's
// (`streamline/lib/compiler/compile`).compileFile()
module.exports = function (options) {
  if (options == null) {
    options = {};
  }
  // Turn this on to always run through the compiler, and not use streamline's built in on disk check.
  options.force = true;

  // The through2 object transform function
  function transform(obj, enc, cb) {
    var file;
    try {
      file = processInput(obj, options);
      // pass through the stream
      if (file === null) return cb(null, obj);
    } catch (err) {
      return cb(err);
    }

    // Callback to pass to the streamline compiler
    var finish = function(err, data) {
      if (err) {
        return cb(new PluginError('gulp-streamlinejs', err));
      }
      // the file cannot be streamlined, just pass it through to the next pipe.
      else if (!data) {
        return cb(null, file);
      }
      file.contents = new Buffer(data.transformed);
      file.path = gutil.replaceExtension(file.path, '.js');
      if (options.sourceMap && data.sourceMap && !options.bare) {
        file.sourceMap = data.sourceMap;
        writeSourceMap.call(this, file);
      }
      this.push(options.bare ? file.contents : file);
      cb();
    }

    try {
      streamline.transform(finish.bind(this), file.path, options);
    } catch (err) {
      return cb(new PluginError('gulp-streamlinejs', err));
    }

  }

  return through.obj(transform);
};
