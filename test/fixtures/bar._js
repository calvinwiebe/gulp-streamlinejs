var fs = require('fs');

var bar = function(_) {
    try {
        return fs.stat('./', _);
    } catch (err) {
        throw err;
    }
}

bar(function(err, stats) {
    console.log('These are the stats ' + stats.mtime);
});
