var assert = require('assert'),
  fs = require('fs'),
  path = require('path'),
  should = require('should'),
  exec = require('child_process').exec,
  File = require('gulp-util').File,
  streamline = require('../'),
  fixturesPath = __dirname + '/fixtures/';

// Goal of testing is to verify that:
// 1. The plugin runs, ;)
// 2. The options are parsed and respected as they should be
// 3. The transformed code returned by the plugin gives the same code that is compiled
// by streamlines command line tools (`_node` and `_coffee`)

// Get the src, compiled and map file data for the given `options.fileName`
var generateData = function(options) {
  var ext = path.extname(options.fullPath);
  var filename = path.basename(options.fullPath);
  var dirname = path.dirname(options.fullPath);
  var file = new File({
    path: options.fullPath,
    base: './',
    cwd: dirname,
    contents: options.contents
  });
  return {
    file: file,
    compiled: fs.readFileSync(path.join(dirname, 'temp', filename.replace(ext, '.js')))
  };
}

// compare the contents of two compiled sources. Make sure they have no whitespace that could
// interfere
var compare = function(x, y) {
  var strip = function(f) {
    return f.replace(/ /g, '').replace(/\n/g, '')
  }
  assert.equal(strip(x), strip(y));
}

// strip out the `Generated by streamline` header
var streamlineStrip = function(code) {
  return code.replace(/\/\*\*\* Generated .* DO NOT EDIT \*\*\*\//, '');
}

describe('gulp-streamlinejs', function() {

  // compile all files in `fixtures` with normal streamline commandline tool
  before(function(_) {
    try {
      exec('rm test/fixtures/temp/*', _);
      exec('./node_modules/.bin/_coffee --runtime callbacks -d test/fixtures/temp -c test/fixtures/bar._js test/fixtures/foo._coffee', _);
    } catch (err) {
      console.error(err);
    }
    finally {
      return;
    }
  });

  it('Should compile a ._js file to .js', function(done) {
    var barJs = path.join(fixturesPath, 'bar._js');
    var testData = generateData({
      fullPath: barJs,
      contents: fs.readFileSync(barJs)
    });

    streamline({runtime: 'callbacks'})
      .on('error', done)
      .on('data', function(data) {
        compare(data.contents.toString(), testData.compiled.toString());
        done();
      })
      .write(testData.file);
  });

  it('Should compile a ._coffee file to .js', function(done) {
    var fooCoffee = path.join(fixturesPath, 'foo._coffee');
    var testData = generateData({
      fullPath: fooCoffee,
      contents: fs.readFileSync(fooCoffee)
    });

    streamline({runtime: 'callbacks'})
      .on('error', done)
      .on('data', function(data) {
        compare(data.contents.toString(), testData.compiled.toString());
        done();
      })
      .write(testData.file);
  });

  it('Should create a sourcemap from the ._coffee contents', function(done) {
    var fooCoffee = path.join(fixturesPath, 'foo._coffee');
    var testData = generateData({
      fullPath: fooCoffee,
      contents: fs.readFileSync(fooCoffee)
    });

    streamline({
      runtime: 'callbacks',
      sourceMap: true
    })
      .on('error', done)
      .on('data', function(data) {
        should.exist(data.sourceMap);
        done();
      })
      .write(testData.file);
  });

  it('Should compile using fibers mode', function(done) {
    var fooCoffee = path.join(fixturesPath, 'foo._coffee');
    var testData = generateData({
      fullPath: fooCoffee,
      contents: new Buffer('some fake data')
    });

    streamline({
      runtime: 'fibers'
    })
      .on('error', done)
      .on('data', function(data) {
        assert.equal(/(fibers)/.test(data.contents.toString()), true);
        done();
      })
      .write(testData.file);
  });

  it('Should compile using generators mode', function(done) {
    var fooCoffee = path.join(fixturesPath, 'foo._coffee');
    var testData = generateData({
      fullPath: fooCoffee,
      contents: new Buffer('some fake data')
    });

    streamline({
      runtime: 'generators'
    })
      .on('error', done)
      .on('data', function(data) {
        assert.equal(/(generators)/.test(data.contents.toString()), true);
        done();
      })
      .write(testData.file);
  });
});
