/*** Generated by streamline 0.10.13 (callbacks) - DO NOT EDIT ***/
var __rt=require('streamline/lib/callbacks/runtime').runtime(__filename, false),__func=__rt.__func,__cb=__rt.__cb;
(function() {
  var baz, fs;
  fs = require("fs");
  baz = function baz__1(options, _) {
    var __frame = {
      name: "baz__1",
      line: 3
    };
    return __func(_, this, arguments, baz__1, 1, __frame, function __$baz__1() {
      if ((options == null)) {
        return _(null);
      }
      ;
      return fs.stat("./", __cb(_, __frame, 2, 7, _, true));
    });
  };
  baz({
  }, function(err, results) {
    return console.log(results);
  });
}).call(this);
//# sourceMappingURL=baz.map