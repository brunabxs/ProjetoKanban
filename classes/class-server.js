var GoogleDrive = require('./class-googledrive');
var Queue = require('./class-queue');
var Section = require('./class-section');
var Task = require('./class-task');
var TaskLog = require('./class-tasklog');

var restify = require('restify');

// Server Class
function Server() {
  var self = this;
  
  if (arguments.callee._singletonInstance)
    return arguments.callee._singletonInstance;
  arguments.callee._singletonInstance = self;
  
  self.restServer    = restify.createServer();
  self.queue         = new Queue(['add-task', 'update-task', 'add-section', 'update-section', 'add-tasklog']);
  
  self.restServer.use(restify.fullResponse());
  self.restServer.use(restify.bodyParser());
  
  self.restServer.post('/add/section', function (request, response, next) {
    self.queue.push('add-section', new Section(JSON.parse(request.params.data)));
    response.send(200, new Date());
    response.end();
    return next();
  });
  
  self.restServer.post('/update/section', function (request, response, next) {
    self.queue.push('update-section', new Section(JSON.parse(request.params.data)));
    response.send(200, new Date());
    response.end();
    return next();
  });

  self.restServer.post('/add/task', function (request, response, next) {
    self.queue.push('add-task', new Task(JSON.parse(request.params.data)));
    response.send(200, new Date());
    response.end();
    return next();
  });
  
  self.restServer.post('/update/task', function (request, response, next) {
    self.queue.push('update-task', new Task(JSON.parse(request.params.data)));
    response.send(200, new Date());
    response.end();
    return next();
  });
  
  self.restServer.post('/update/tasks', function (request, response, next) {
    var tasks = JSON.parse(request.params.data);
    for (var i = 0; i < tasks.length; i++) {
      self.queue.push('update-task', new Task(tasks[i]));
    }
    response.send(200, new Date());
    response.end();
    return next();
  });
  
  self.restServer.post('/add/tasklog', function (request, response, next) {
    self.queue.push('add-tasklog', new TaskLog(JSON.parse(request.params.data)));
    response.send(200, new Date());
    response.end();
    return next();
  });
  
  self.restServer.get('/data', function (request, response, next){
    response.send(200, {sections: GoogleDrive.sections, tasks: GoogleDrive.tasks, lastSync: GoogleDrive.lastSync});
  });

  self.restServer.get(/.*/, restify.serveStatic({
    directory: './public'
  }));
  
  self.start = function(port) {
    self.restServer.listen(port, function (){
      GoogleDrive.updateSections();
      GoogleDrive.updateTasks();
      GoogleDrive.updateTaskLogs();
      console.log('%s listening at %s', self.restServer.name, self.restServer.url);
    });
  }

}

// export
module.exports = Server;
