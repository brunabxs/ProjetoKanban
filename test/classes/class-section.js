var Section = require('./../../classes/class-section');

test('[UnitTest] test section.constructor with no attribute set', function (assert) {
  var data = {};
  
  var section = new Section(data);
  equal(section.id, '-', 'We expect section attribute id to be "-"');
  equal(section.name, '-', 'We expect section attribute name to be "-"');
  equal(section.maxWip, 0, 'We expect section attribute maxWip to be 0');
  equal(section.show, true, 'We expect section attribute show to be "true"');
});

test('[UnitTest] test section.constructor with all attributes set', function (assert) {
  var data = { 1: '1', 2:'a section', 3:2, 4:'1' };
  
  var section = new Section(data);
  equal(section.id, 1, 'We expect section attribute id to be 1');
  equal(section.name, 'a section', 'We expect section attribute name to be "a section"');
  equal(section.maxWip, 2, 'We expect section attribute maxWip to be 2');
  equal(section.show, true, 'We expect section attribute show to be "true"');
});

test('[UnitTest] test section.constructor with show attribute not set', function (assert) {
  var data = { 1: '1', 2:'a section', 3:2, 4:'' };
  
  var section = new Section(data);
  equal(section.id, 1, 'We expect section attribute id to be 1');
  equal(section.name, 'a section', 'We expect section attribute name to be "a section"');
  equal(section.maxWip, 2, 'We expect section attribute maxWip to be 2');
  equal(section.show, true, 'We expect section attribute show to be "true"');
});

test('[UnitTest] test section.setTasks with one task', function (assert) {
  var data = { 1: '1', 2:'a section', 3:2, 4:'1' };
  
  var section = new Section(data);  
  section.setTasks([1]);
  equal(section.tasks.length, 1);
  deepEqual(section.tasks, [1], 'We expect section attribute tasks to be [1]');
});

test('[UnitTest] test section.setTasks with two tasks', function (assert) {
  var data = { 1: '1', 2:'a section', 3:2, 4:'1' };
  
  var section = new Section(data);  
  section.setTasks([1, 2]);
  equal(section.tasks.length, 2);
  deepEqual(section.tasks, [1, 2], 'We expect section attribute tasks to be [1, 2]');
});

test('[UnitTest] test section.setTasks with no task', function (assert) {
  var data = { 1: '1', 2:'a section', 3:2, 4:'1' };
  
  var section = new Section(data);  
  section.setTasks([]);
  equal(section.tasks.length, 0);
  deepEqual(section.tasks, [], 'We expect section attribute tasks to be []');
});
