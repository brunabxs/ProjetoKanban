var Section = require('./../../classes/class-section');
var Task = require('./../../classes/class-task');
var GoogleDrive = require('./../../classes/class-googledrive');

test('[UnitTest] test googleDrive.updateSections with no sections rows to add', function (assert) {
  Section.nextOrder = 1;
  var expectedResult = [];
  
  GoogleDrive.updateSections({});

  deepEqual(GoogleDrive.sections, expectedResult, 'We expect googleDrive.sections to be ' + expectedResult);
});

test('[UnitTest] test googleDrive.updateSections with one section row to add', function (assert) {
  Section.nextOrder = 1;
  var expectedResult = [new Section({1:1, 2:'section1', 3:'0', 4:'1'})];
  
  GoogleDrive.updateSections({1: {1:1, 2:'section1', 3:'0', 4:'1', 5:'1'}});

  deepEqual(GoogleDrive.sections, expectedResult, 'We expect googleDrive.sections to be ' + expectedResult);
});

test('[UnitTest] test googleDrive.updateSections with two sections row to add', function (assert) {
  Section.nextOrder = 1;
  var expectedResult = [new Section({1:'1', 2:'section1', 3:'0', 4:'1'}), new Section({1:'2', 2:'section2', 3:'4', 4:'0'})];
  
  GoogleDrive.updateSections({1: {1:'1', 2:'section1', 3:'0', 4:'1', 5:'1'}, 2: {1:'2', 2:'section2', 3:'4', 4:'0', 5:'2'}});

  deepEqual(GoogleDrive.sections, expectedResult, 'We expect googleDrive.sections to be ' + expectedResult);
});

test('[UnitTest] test googleDrive.updateTask with no task row to add', function (assert) {
  Task.nextId = 1;
  Task.nextOrder = 1;
  var expectedResult = [];
  
  GoogleDrive.updateTasks({});

  deepEqual(GoogleDrive.tasks, expectedResult, 'We expect googleDrive.tasks to be ' + expectedResult);
  deepEqual(Task.nextId, 1, 'We expect Task.nextId to be 1');
  deepEqual(Task.nextOrder, 1, 'We expect Task.nextOrder to be 1');
});

test('[UnitTest] test googleDrive.updateTask with one task row to add', function (assert) {
  Task.nextId = 1;
  Task.nextOrder = 1;
  var expectedResult = [new Task({ 1:'1', 2:'section1', 3:'1', 4:'extra', 5:'project', 6:'title', 7:'description', 8:'0' })];
  
  GoogleDrive.updateTasks({1: { 1:'1', 2:'section1', 3:'1', 4:'extra', 5:'project', 6:'title', 7:'description', 8:'0' }});

  deepEqual(GoogleDrive.tasks, expectedResult, 'We expect googleDrive.tasks to be ' + expectedResult);
  deepEqual(Task.nextId, 2, 'We expect Task.nextId to be 1');
  deepEqual(Task.nextOrder, 2, 'We expect Task.nextOrder to be 1');
});

test('[UnitTest] test googleDrive.updateTask with two tasks rows to add with sequential order', function (assert) {
  Task.nextId = 1;
  Task.nextOrder = 1;
  var expectedResult = [new Task({ 1:'1', 2:'section1', 3:'1', 4:'extra', 5:'project', 6:'title', 7:'description', 8:'0' }), 
                        new Task({ 1:'2', 2:'section1', 3:'2', 4:'normal', 5:'', 6:'', 7:'', 8:'1', 9:'2' })];
  
  GoogleDrive.updateTasks({1: { 1:'1', 2:'section1', 3:'1', 4:'extra', 5:'project', 6:'title', 7:'description', 8:'0' },
                           2: { 1:'2', 2:'section1', 3:'2', 4:'normal', 5:'', 6:'', 7:'', 8:'1' }});

  deepEqual(GoogleDrive.tasks, expectedResult, 'We expect googleDrive.tasks to be ' + expectedResult);
  deepEqual(Task.nextId, 3, 'We expect Task.nextId to be 3');
  deepEqual(Task.nextOrder, 3, 'We expect Task.nextOrder to be 3');
});

test('[UnitTest] test googleDrive.updateTask with two tasks rows to add without sequential order', function (assert) {
  Task.nextId = 1;
  Task.nextOrder = 1;
  var expectedResult = [new Task({ 1:'1', 2:'section1', 3:'1', 4:'extra', 5:'project', 6:'title', 7:'description', 8:'0' }), 
                        new Task({ 1:'2', 2:'section1', 3:'2', 4:'normal', 5:'', 6:'', 7:'', 8:'1', 9:'5' })];
  
  GoogleDrive.updateTasks({1: { 1:'1', 2:'section1', 3:'1', 4:'extra', 5:'project', 6:'title', 7:'description', 8:'0' },
                           5: { 1:'2', 2:'section1', 3:'2', 4:'normal', 5:'', 6:'', 7:'', 8:'1' }});

  deepEqual(GoogleDrive.tasks, expectedResult, 'We expect googleDrive.tasks to be ' + expectedResult);
  deepEqual(Task.nextId, 3, 'We expect Task.nextId to be 3');
  deepEqual(Task.nextOrder, 6, 'We expect Task.nextOrder to be 6');
});

test('[UnitTest] test googleDrive.updateConflictingTasks with no conflicting tasks to add', function (assert) {
  Task.nextId = 1;
  Task.nextOrder = 1;
  var expectedResult = [new Task({ 1:'1', 2:'section1', 3:'1', 4:'extra', 5:'project', 6:'title', 7:'description', 8:'0' }), 
                        new Task({ 1:'2', 2:'section1', 3:'2', 4:'normal', 5:'', 6:'', 7:'', 8:'1', 9:'5' })];
  
  GoogleDrive.updateConflictingTasks({1: { 1:'1', 2:'section1', 3:'1', 4:'extra', 5:'project', 6:'title', 7:'description', 8:'0' },
                                      5: { 1:'2', 2:'section1', 3:'2', 4:'normal', 5:'', 6:'', 7:'', 8:'1' }});

  deepEqual(GoogleDrive.tasks, expectedResult, 'We expect googleDrive.tasks to be ' + expectedResult);
  deepEqual(Task.nextId, 3, 'We expect Task.nextId to be 3');
  deepEqual(Task.nextOrder, 6, 'We expect Task.nextOrder to be 6');
});

test('[UnitTest] test googleDrive.updateConflictingTasks with one conflicting tasks to add', function (assert) {
  Task.nextId = 1;
  Task.nextOrder = 1;
  var expectedResult = [new Task({ 1:'1', 2:'section1', 3:'1', 4:'extra', 5:'project', 6:'title', 7:'description', 8:'0' }), 
                        new Task({ 1:'2', 2:'section2', 3:'2', 4:'normal', 5:'', 6:'', 7:'', 8:'1', 9:'5' })];
  
  GoogleDrive.tasks.length = 0;
  GoogleDrive.tasks.push(new Task({ 1:1, 2:'section1', 3:'1', 4:'extra', 5:'project', 6:'title', 7:'description', 8:'0' }, 1));
  GoogleDrive.tasks.push(new Task({ 1:2, 2:'section1', 3:'2', 4:'normal', 5:'', 6:'', 7:'', 8:'1' }, 5));
  
  GoogleDrive.updateConflictingTasks({5: { 1:'2', 2:'section2', 3:'2', 4:'normal', 5:'', 6:'', 7:'', 8:'1' }});

  deepEqual(GoogleDrive.tasks, expectedResult, 'We expect googleDrive.tasks to be ' + expectedResult);
  deepEqual(Task.nextId, 3, 'We expect Task.nextId to be 3');
  deepEqual(Task.nextOrder, 6, 'We expect Task.nextOrder to be 6');
});
