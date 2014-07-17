// TaskLog Class
function TaskLog(data, rowIndex) {
  var self = this;

  for (var i = 0; i < TaskLog.ATTRIBUTES.length; i++) {
    self[TaskLog.ATTRIBUTES[i]] = data[TaskLog.ATTRIBUTES[i]] || data[i+1] || '';
  }
}

// constants

// static
TaskLog.reset = function(nextOrder, attributes) {
  TaskLog.NEXT_ORDER = nextOrder;

  TaskLog.ATTRIBUTES = [];
  for (var key in attributes) {
    TaskLog.ATTRIBUTES.push(attributes[key]);
  }  
};

// methods
TaskLog.prototype.toObject = function() {
  var taskLog = {};
  for (var i = 0; i < TaskLog.ATTRIBUTES.length; i++) {
    taskLog[i+1] = this[TaskLog.ATTRIBUTES[i]];
  }
  return taskLog;
}

// export
module.exports = TaskLog;