test('[UnitTest] test util.splitTitleInformation with all parameters set', function (assert) {
  var info = '[normal][project] Title';
  var expectedResult = {type: 'normal', project: 'project', title: 'Title'};
  
  deepEqual(Util.splitTitleInformation(info), expectedResult, 'We expect result to be ' + expectedResult);
});

test('[UnitTest] test util.splitTitleInformation with all parameters set (reverse order)', function (assert) {
  var info = '[project][normal] Title';
  var expectedResult = {type: 'normal', project: 'project', title: 'Title'};
  
  deepEqual(Util.splitTitleInformation(info), expectedResult, 'We expect result to be ' + expectedResult);
});

test('[UnitTest] test util.splitTitleInformation with type and title set', function (assert) {
  var info = '[normal]Title';
  var expectedResult = {type: 'normal', project: '', title: 'Title'};
  
  deepEqual(Util.splitTitleInformation(info), expectedResult, 'We expect result to be ' + expectedResult);
});

test('[UnitTest] test util.splitTitleInformation with project and title set', function (assert) {
  var info = '[project]Title';
  var expectedResult = {type: '', project: 'project', title: 'Title'};
  
  deepEqual(Util.splitTitleInformation(info), expectedResult, 'We expect result to be ' + expectedResult);
});

test('[UnitTest] test util.splitTitleInformation with title set', function (assert) {
  var info = 'Title';
  var expectedResult = {type: '', project: '', title: 'Title'};
  
  deepEqual(Util.splitTitleInformation(info), expectedResult, 'We expect result to be ' + expectedResult);
});

test('[UnitTest] test util.clearArrayElements empty array', function (assert) {
  var array = [];
  var expectedResult = [];
  
  deepEqual(Util.clearArrayElements(array), expectedResult, 'We expect result to be ' + expectedResult);
});

test('[UnitTest] test util.clearArrayElements', function (assert) {
  var array = ['[a]', '[a b]', '[   ]', '[b]', '[a]', ']', ']   ', '[a    b  ]', ']   Text'];
  var expectedResult = ['a', 'a b', 'b', 'a', 'a b', 'Text'];
  
  deepEqual(Util.clearArrayElements(array), expectedResult, 'We expect result to be ' + expectedResult);
});

test('[UnitTest] test util.extend with empty object', function (assert) {
  var dataDestination = {};
  var dataOrigin = {};
  var expectedResult = {};
  
  deepEqual(Util.extend(dataDestination, undefined), expectedResult, 'We expect result to be ' + expectedResult);
  deepEqual(Util.extend(dataDestination, dataOrigin), expectedResult, 'We expect result to be ' + expectedResult);
});

test('[UnitTest] test util.extend with one object to add', function (assert) {
  var dataDestination = {a: 'testea'};
  var dataOrigin = {a: 'testeA', b: 'testeb'};
  var expectedResult = {a: 'testea', b: 'testeb'};
  
  deepEqual(Util.extend(dataDestination, dataOrigin), expectedResult, 'We expect result to be ' + expectedResult);
});
