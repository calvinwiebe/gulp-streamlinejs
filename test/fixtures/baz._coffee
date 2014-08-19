fs = require 'fs'

baz = (options, _) ->
    return unless options?
    fs.stat './', _

baz {}, (err, results) ->
    console.log results
