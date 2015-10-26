'use strict';

var regeneratorRuntime = typeof require === 'function' ? require('regenerator/runtime') : Streamline.require('regenerator/runtime');

var _streamline = typeof require === 'function' ? require('streamline-runtime/lib/callbacks/runtime') : Streamline.require('streamline-runtime/lib/callbacks/runtime');

var _filename = '/Users/calvinwiebe/dev/gulp-streamlinejs/test/fixtures/foo._coffee';
(function () {
  var f;

  f = _streamline.async(regeneratorRuntime.mark(function _$$$$(_) {
    return regeneratorRuntime.wrap(function _$$$$$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return _streamline.await(_filename, 5, null, setTimeout, 0, null, false)(true, 2000);

        case 2:
          return context$2$0.abrupt('return', context$2$0.sent);

        case 3:
        case 'end':
          return context$2$0.stop();
      }
    }, _$$$$, this);
  }), 0, 1);

  f(function (err) {
    return console.log('This took 2 seconds in _coffee');
  });
}).call(undefined);