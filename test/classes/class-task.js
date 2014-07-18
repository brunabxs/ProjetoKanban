var Task = require('./../../classes/class-task');

test('[UnitTest] test task.constructor with empty data task', function (assert) {
  Task.nextId = 1;
  Task.nextOrder = 1;
  
  var data = {};
  
  var task = new Task(data);
  equal(task.id, 1, 'We expect task attribute id to be 1');
  equal(task.section, '-', 'We expect task attribute section to be "-"');
  equal(task.priority, -1, 'We expect task attribute priority to be -1');
  equal(task.type, 'normal', 'We expect task attribute type to be "normal"');
  equal(task.project, '', 'We expect task attribute project to be ""');
  equal(task.title, '', 'We expect task attribute title to be ""');
  equal(task.description, '', 'We expect task attribute description to be ""');
  equal(task.show, true, 'We expect task attribute show to be "true"');
  deepEqual(task.history, [], 'We expect task attribute history to be []');
  equal(task.order, 1, 'We expect task attribute order to be 1');
  equal(Task.nextId, 2, 'We expect Task.nextId to be 2');
  equal(Task.nextOrder, 2, 'We expect Task.nextOrder to be 2');
});

test('[UnitTest] test task.constructor with all attributes set', function (assert) {
  Task.nextId = 1;
  Task.nextOrder = 1;
  
  var data = { 1: '1', 2:'', 3:5, 4:'extra', 5:'project', 6:'title', 7:'description', 8:'0' };

  var task = new Task(data);
  equal(task.id, 1, 'We expect task attribute id to be 1');
  equal(task.section, '-', 'We expect task attribute section to be "-"');
  equal(task.priority, 5, 'We expect task attribute priority to be 5');
  equal(task.type, 'extra', 'We expect task attribute type to be "extra"');
  equal(task.project, 'project', 'We expect task attribute project to be "project"');
  equal(task.title, 'title', 'We expect task attribute title to be "title"');
  equal(task.description, 'description', 'We expect task attribute description to be "description"');
  equal(task.show, false, 'We expect task attribute show to be "false"');
  deepEqual(task.history, [], 'We expect task attribute history to be []');
  equal(task.order, 1, 'We expect task attribute order to be 1');
  equal(Task.nextId, 2, 'We expect Task.nextId to be 2');
  equal(Task.nextOrder, 2, 'We expect Task.nextOrder to be 2');
});

test('[UnitTest] test task.toObject with empty data task', function (assert) {
  Task.nextId = 1;
  Task.nextOrder = 1;
  
  var data = {};
  var expectedResult = {1: { 1: 1, 2:'-', 3:-1, 4:'normal', 5:'', 6:'', 7:'', 8:1 }};

  var task = new Task(data).toObject();
  deepEqual(task, expectedResult, 'We expect result to be ' + expectedResult);
});

test('[UnitTest] test task.toObject with all attributes set', function (assert) {
  Task.nextId = 1;
  Task.nextOrder = 1;
  
  var data = { 1: '1', 2:'', 3:5, 4:'extra', 5:'project', 6:'title', 7:'description', 8:'0' };
  var expectedResult = {1: { 1: 1, 2:'-', 3:5, 4:'extra', 5:'project', 6:'title', 7:'description', 8:0 }};

  var task = new Task(data).toObject();
  deepEqual(task, expectedResult, 'We expect result to be ' + expectedResult);
});
