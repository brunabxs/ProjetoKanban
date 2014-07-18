var Util = require('./../../classes/class-util');

test('[UnitTest] test util.setDefaultValue', function (assert) {
  equal(Util.setDefaultValue(undefined, 1), 1, 'We expect return to be 1');
  equal(Util.setDefaultValue('', 1), 1, 'We expect return to be 1');
  equal(Util.setDefaultValue(2, 1), 2, 'We expect return to be 2');
});

test('[UnitTest] test util.convertData with all labeled attributes set', function (assert) {
  var data = { 'id1':'element1', 'id2':'element2' };
  var label = { 'id1':1, 'id2':2 };
  
  var expectedData = { 1:'element1', 2:'element2', 'id1':'element1', 'id2':'element2' };
  var newData = Util.convertData(data, label);
  
  deepEqual(newData, expectedData, 'We expect return to be ' + expectedData);
});

test('[UnitTest] test util.convertData with no labeled attribute set', function (assert) {
  var data = {};
  var label = { 'id1':1, 'id2':2 };
  
  var expectedData = {};
  var newData = Util.convertData(data, label);
  
  deepEqual(newData, expectedData, 'We expect return to be ' + expectedData);
});

test('[UnitTest] test util.convertData with one labeled attribute set', function (assert) {
  var data = { 'id1':'element1', 'id5':'element5' };
  var label = { 'id1':1, 'id2':2 };
  
  var expectedData = { 1:'element1', 'id1':'element1', 'id5':'element5' };
  var newData = Util.convertData(data, label);
  
  deepEqual(newData, expectedData, 'We expect return to be ' + expectedData);
});
