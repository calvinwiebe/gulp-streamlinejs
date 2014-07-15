var through = require('through2');
var streamline = require('streamline/lib/callbacks/compile');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var Buffer = require('buffer').Buffer;

// Transform a file of a `._coffee`, `.coffee` or `._js` file via
// `streamlinejs` to a `.js` file.
//
// * opt - options that match those that can be passed to streamline's
// (`streamline/lib/compiler/compile`).compileFile()
module.exports = function (options) {
  function transform(file, enc, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) return cb(new PluginError('gulp-streamlinejs', 'Streaming not supported'));

    // If `options.sourceMap` and streamline gave us the sourcemap content, add it
    // to the file stream
    var writeSourceMap = function(file) {
      var sourceMapFile = new gutil.File({
        cw: file.cwd,
        base: file.base,
        path: gutil.replaceExtension(file.path, '.map'),
        contents: new Buffer(JSON.stringify(file.sourceMap))
      });
      this.push(sourceMapFile);
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
      file.sourceMap = data.sourceMap;
      if (options.sourceMap) {
        writeSourceMap.call(this, file);
      }
      cb(null, file);
    }

    try {
      streamline.transform(finish.bind(this), file.path, options);
    } catch (err) {
      return cb(new PluginError('gulp-streamlinejs', err));
    }

  }

  return through.obj(transform);
};
