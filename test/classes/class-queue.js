var Queue = require('./../../classes/class-queue');
var Task = require('./../../classes/class-task');

test('[UnitTest] test queue.prepareQueueTasks slice all task', function (assert) {
  Task.nextId = 1;
  Task.nextOrder = 1;
  
  var queueTypes = ['add-task'];
  var queueTasks = [{type:'add-task', data:new Task()}, {type:'add-task', data:new Task()}];
  var expectedResult = {1: { 1:1, 2:'-', 3:-1, 4:'normal', 5:'', 6:'', 7:'', 8:1 }, 2: { 1:2, 2:'-', 3:-1, 4:'normal', 5:'', 6:'', 7:'', 8:1 }};

  deepEqual(Queue.prepareQueueTasks(queueTypes, queueTasks, 0, 2), expectedResult, 'We expect return to be ' + expectedResult);
});

test('[UnitTest] test queue.prepareQueueTasks slice one task', function (assert) {
  Task.nextId = 1;
  Task.nextOrder = 1;
  
  var queueTypes = ['add-task'];
  var queueTasks = [{type:'add-task', data:new Task()}, {type:'add-task', data:new Task()}];
  var expectedResult = {2: { 1:2, 2:'-', 3:-1, 4:'normal', 5:'', 6:'', 7:'', 8:1 }};

  deepEqual(Queue.prepareQueueTasks(queueTypes, queueTasks, 1, 2), expectedResult, 'We expect return to be ' + expectedResult);
});

test('[UnitTest] test queue.prepareQueueTasks no type', function (assert) {
  Task.nextId = 1;
  Task.nextOrder = 1;
  
  var queueTypes = ['update-task'];
  var queueTasks = [{type:'add-task', data:new Task()}, {type:'add-task', data:new Task()}];
  var expectedResult = undefined;

  deepEqual(Queue.prepareQueueTasks(queueTypes, queueTasks, 1, 2), expectedResult, 'We expect return to be ' + expectedResult);
});
