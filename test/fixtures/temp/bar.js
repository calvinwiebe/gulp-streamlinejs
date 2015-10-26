'use strict';

var regeneratorRuntime = typeof require === 'function' ? require('regenerator/runtime') : Streamline.require('regenerator/runtime');

var _streamline = typeof require === 'function' ? require('streamline-runtime/lib/callbacks/runtime') : Streamline.require('streamline-runtime/lib/callbacks/runtime');

var _filename = '/Users/calvinwiebe/dev/gulp-streamlinejs/test/fixtures/bar._js';
var fs = require('fs');

var bar = _streamline.async(regeneratorRuntime.mark(function _$$bar$$(_) {
    return regeneratorRuntime.wrap(function _$$bar$$$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.prev = 0;
                context$1$0.next = 3;
                return _streamline.await(_filename, 5, fs, 'stat', 1, null, false)('./', true);

            case 3:
                stat = context$1$0.sent;
                context$1$0.next = 9;
                break;

            case 6:
                context$1$0.prev = 6;
                context$1$0.t0 = context$1$0['catch'](0);
                throw context$1$0.t0;

            case 9:
            case 'end':
                return context$1$0.stop();
        }
    }, _$$bar$$, this, [[0, 6]]);
}), 0, 1);

bar(function (err, stats) {
    console.log('These are the stats ' + stats);
});