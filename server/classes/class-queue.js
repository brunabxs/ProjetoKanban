var GoogleDrive = require('./class-googledrive');

// Queue Class
function Queue(types) {
  var self = this;

  self.types = types;
  self.cargo = require('async').cargo(function (queueTasks, callback) {
    var start = 0;
    var i;

    for (i = 0; i < queueTasks.length; i++) {
      if (queueTasks[i].type === queueTasks[start].type)
        continue;
        
      if (queueTasks[start].type === 'add-section' || queueTasks[start].type === 'update-section') {
        GoogleDrive.updateSections(Queue.prepareQueueTasks(self.types, queueTasks, start, i));
      }
      else if (queueTasks[start].type === 'add-task' || queueTasks[start].type === 'update-task') {
        GoogleDrive.updateTasks(Queue.prepareQueueTasks(self.types, queueTasks, start, i));
      }
      else if (queueTasks[start].type === 'add-tasklog') {
        GoogleDrive.updateTaskLogs(Queue.prepareQueueTasks(self.types, queueTasks, start, i));
      }
      start = i;
    }
    
    if (queueTasks[start].type === 'add-section' || queueTasks[start].type === 'update-section') {
      GoogleDrive.updateSections(Queue.prepareQueueTasks(self.types, queueTasks, start, i));
    }
    else if (queueTasks[start].type === 'add-task' || queueTasks[start].type === 'update-task') {
      GoogleDrive.updateTasks(Queue.prepareQueueTasks(self.types, queueTasks, start, i));
    }
    else if (queueTasks[start].type === 'add-tasklog') {
      GoogleDrive.updateTaskLogs(Queue.prepareQueueTasks(self.types, queueTasks, start, i));
    }
    
    callback();
  }, 3);
}
  
// constants
Queue.MAX_ELEMENTS = 3;
  
// static
Queue.prepareQueueTasks = function(queueTypes, queueTasks, start, end) {
  var tasks = queueTasks.slice(start, end).map(function(queueTask) {
    if (queueTypes.indexOf(queueTask.type) === -1)
      return undefined;
      
    return queueTask.data;
  });

  return tasks;
}

// methods
Queue.prototype.push = function(type, data) {
  this.cargo.push({type: type, data: data}, function(err){});
}

// export
module.exports = Queue;