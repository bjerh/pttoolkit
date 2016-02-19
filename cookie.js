define([], function() {

  var setCookie = function (name, value, days) {

    if (days === null) {
      document.cookie = name + '=' + value + '; path=/';
      return;
    }

    var exdate = new Date();
    exdate.setDate(exdate.getDate() + days);

    document.cookie = name + '=' + value + '; expires=' + exdate.toUTCString() + '; path=/';
  };

  var getCookie = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for(var i=0;i < ca.length;i++) {
      var c = ca[i];

      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }

    return null;
  };

  return {
    set: setCookie,
    get: getCookie
  }
  
});