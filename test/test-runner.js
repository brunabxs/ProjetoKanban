var testRunner = require('qunit');

testRunner.run({
  code: './test/test-code.js',
  tests: ['./test/classes/class-util.js', './test/classes/class-section.js', './test/classes/class-task.js', './test/classes/class-queue.js', './test/classes/class-googledrive.js'],
}, function(err, report) {
  console.dir(err);
  console.dir(report);
});
