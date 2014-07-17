// Util Class
var Util = {};

// constants

// static

// methods
Util.join = function(object1, object2) {
  var object = {};
  for (var key in object1) {
    object[key] = object1[key];
  }
  for (var key in object2) {
    object[key] = object2[key];
  }
  return object;
}

// export
module.exports = Util;