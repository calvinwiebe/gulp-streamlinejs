(function() {
  setTimeout(function() {
    return console.log('This took 2 seconds in coffee');
  }, 2000);

}).call(this);
