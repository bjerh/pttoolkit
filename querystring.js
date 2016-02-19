define([], function() {
  var getQueryString = function(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);

    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  var getAllQueryStrings = function() {
    var vars = [];
    var hashes = location.search.substring(1).split('&');

    if(hashes[0] == '' && hashes.length == 1) {

      return null;

    }else {

      for(var i = 0; i < hashes.length; i++)
      {
          var hash = hashes[i].split('=');
          vars[hash[0]] = decodeURIComponent(hash[1]);
      }
    
      return vars;

    }

  };

  return {
    get: getQueryString,
    getAll: getAllQueryStrings
  }
});


// 