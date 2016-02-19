define([], function () {
  // Add multiple eventListeners
  // -----------------------------------------
  // Seperate events by space
  // event.addListenerMulti(window, 'mousemove touchmove', function(){…});
  //
  
  var addListenerMulti = function(el, s, fn) {
    var evts = s.split(' ');
    for (var i=0, iLen=evts.length; i<iLen; i++) {
      el.addEventListener(evts[i], fn, false);
    }
  }
  
  return {
    addListenerMulti: addListenerMulti
  };
});