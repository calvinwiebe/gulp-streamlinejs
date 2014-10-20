f = (_) ->
    setTimeout _, 2000

f (err) ->
    console.log 'This took 2 seconds in _coffee'
