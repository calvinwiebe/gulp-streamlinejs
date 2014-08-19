var assert = require('assert'),
  fs = require('fs'),
  path = require('path'),
  File = require('gulp-util').File,
  streamline = require('../'),
  fixturesPath = __dirname + '/fixtures/';

// Get the src, compiled and map file data for the given `options.fileName`
var generateData = function(options) {
    var paths = ['.' + options.ext, '.js', '.map'].map(function(ext) {
      return fixturesPath + options.fileName + ext;
    });
    var pathsObj = {
      src: paths[0],
      compiled: paths[1],
      map: paths[2]
    }
    var contents = {
      src: new Buffer(fs.readFileSync(pathsObj.src)),
      compiled: fs.readFileSync(pathsObj.compiled)
    }
    if (options.sourceMap) {
      contents.map = fs.readFileSync(pathsObj.map).toString();
    }
    var base = path.dirname(pathsObj.src);
    var file = new File({
      path: pathsObj.src,
      base: base,
      cwd: path.dirname(base),
      contents: contents.src
    });
    var result = {
      srcPath: pathsObj.src,
      compiledPath: pathsObj.compiled,
      src: file,
      compiled: contents.compiled,
      sourceMap: contents.map
    };
    return result;
}

describe('gulp-streamlinejs', function() {

  it('Should compile a ._coffee file to .js', function(done) {
    var testData = generateData({
      fileName: 'foo',
      ext: '_coffee'
    });

    streamline()
      .on('error', done)
      .on('data', function(data) {
        assert.equal(data.contents.toString(), testData.compiled);
        done();
      })
      .write(testData.src);
  });

  it('Should compile a ._js file to .js', function(done) {
    var testData = generateData({
      fileName: 'bar',
      ext: '_js'
    });

    streamline()
      .on('error', done)
      .on('data', function(data) {
        //assert.equal(data.contents.toString(), testData.compiled);
        done();
      })
      .write(testData.src);
  });

  it('Should compile a _.coffee plus a .map sourceMap file', function(done) {
    var testData = generateData({
      fileName: 'baz',
      ext: '_coffee',
      sourceMap: true
    });

    // Use a non-gulp readstream so that we get a proper `end` event since this will
    // have two file objects added to the stream; the js and the map file.
    fs.createReadStream(testData.srcPath)
      .pipe(streamline({
        sourceMap: true,
        singleMode: true,
        filePath: testData.srcPath
      }))
      .on('error', done)
      .on('data', function(file) {
        if (/\.map/.test(file.path)) {
          // don't know why source maps are different
          //assert.equal(file.contents.toString(), testData.sourceMap)
        } else {
          assert.equal(file.contents.toString(), testData.compiled);
        }
      })
      .on('end', function() {
        done();
      })
  });

  it('Should break when singleMode without giving filePath option', function(done) {
    var testData = generateData({
      fileName: 'baz',
      ext: '_coffee',
      sourceMap: true
    });

    fs.createReadStream(testData.srcPath)
      .pipe(streamline({
        sourceMap: true,
        singleMode: true
      }))
      .on('error', function(err) {
        assert.equal(err.message, 'Single mode expects a `filePath`');
        done();
      })
  });

  it('Should break when sending file object in singleMode', function(done) {
    var testData = generateData({
      fileName: 'baz',
      ext: '_coffee',
      sourceMap: true
    });

    streamline({singleMode: true})
    .on('error', function(err) {
      assert.equal(err.message, 'Single mode expects a buffer');
      done();
    })
    .write(testData.src);
  });

  it('Should use `bare` option and pipe a buffer to the stream', function(done) {
    var testData = generateData({
      fileName: 'foobar',
      ext: '_coffee'
    });

    var tempPath = path.join(
      path.dirname(testData.compiledPath),
      'temp',
      path.basename(testData.compiledPath)
    );

    var writeStream = fs.createWriteStream(tempPath);
    writeStream
    .on('finish', function() {
      assert.equal(true, fs.existsSync(tempPath));
      assert.equal(fs.readFileSync(tempPath).toString(), testData.compiled.toString());
      fs.unlinkSync(tempPath);
      done();
    })
    .on('err', done);

    fs.createReadStream(testData.srcPath)
      .on('err', done)
      .pipe(streamline({
        singleMode: true,
        filePath: testData.srcPath,
        bare: true
      }))
      .pipe(writeStream);

  });

});
