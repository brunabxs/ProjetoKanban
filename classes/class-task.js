// Task Class
function Task(data, rowIndex) {
  var self = this;

  for (var i = 0; i < Task.ATTRIBUTES.length; i++) {
    self[Task.ATTRIBUTES[i]] = data[Task.ATTRIBUTES[i]] || data[i+1] || '';
  }
}

// constants

// static
Task.reset = function(nextOrder, attributes) {
  Task.NEXT_ORDER = nextOrder;

  Task.ATTRIBUTES = [];
  for (var key in attributes) {
    Task.ATTRIBUTES.push(attributes[key]);
  }  
};

// methods
Task.prototype.toObject = function() {
  var task = {};
  for (var i = 0; i < Task.ATTRIBUTES.length; i++) {
    task[i+1] = this[Task.ATTRIBUTES[i]];
  }
  return task;
}

// export
module.exports = Task;