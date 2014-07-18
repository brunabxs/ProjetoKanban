var AppViewModel = function() {
  var self = this;
  
  self.sections = ko.observableArray();
  self.isOfflineModeOn = ko.observable(false);
  self.lastSync = ko.observable(undefined);
  
  self.visibleSections = ko.computed(function() {
    return self.sections().filter(function(section) {
      return section.show();
    });
  });
  
  self.defaultSection = ko.computed(function() {
    if (self.visibleSections().length > 0)
      return self.visibleSections()[0];
  }, self);
  
  self.newSection = ko.observable();
  self.prepareNewSection = function() {
    self.newSection( new SectionViewModel({}, true) );
  };
  
  self.createSection = function() {
    self.newSection().isNew(false);
    self.sections.push(self.newSection());
    self.newSection().add();
  };
  
  self.removeSection = function(model) {
    model.remove();
    self.sections.remove(model);
  };

  self.addingSection = ko.observable(false);
  self.editingSection = ko.computed(function() {
    if (self.sections().length === 0) return false;
    
    return self.sections().some(function(section) {
      return section.name.editing() || section.maxWip.editing();
    });
  });
  
  self.newTask = ko.observable();
  self.prepareNewTask = function() {
    self.newTask( new TaskViewModel({id:Number(new Date()), section: self.defaultSection().id()}, true) );
    self.newTask().description.editing(true);
  };
  
  self.createTask = function() {
    self.newTask().isNew(false);
    self.defaultSection().createTask(self.newTask());
  };

  self.addingTask = ko.observable(false);
  self.movingTask = ko.observable(false);
  self.editingTask = ko.computed(function() {
    if (self.sections().length === 0) return false;
    
    return self.sections().some(function(section) {
      if (section.tasks().length === 0) return false;
      
      return section.tasks().some(function(task) {
        return task.title.editing() || task.description.editing() || task.moving();
      });
    });
  });
  
  self.idle = ko.computed(function() {
    return !self.editingSection() && !self.movingTask() && !self.editingTask();
  });
  
  self.updateSections = function(tempSections) {
    if (!self.idle() || tempSections === undefined) return;
    
    for (var i = 0; i < tempSections.length; i++) {
      tempSections[i] = new SectionViewModel(tempSections[i]);
    }

    self.sections.removeAll();
    for (var i = 0; i < tempSections.length; i++) {
      self.sections.push(tempSections[i]);
    }
    
    console.log('Updated!');
  };

  Persist.startUpdateLocalStorage(self);
};

var SectionViewModel = function(data, isNew) {
  var self = this;
  
  data = Util.extend(data, { id: '', name: '', maxWip: '', show: 1, tasks: [] });
  
  ko.mapping.fromJS(data, {
    tasks: {
      create: function(options) {
        return new TaskViewModel(options.data);
      }
    }
  }, self);
  
  self.isNew = ko.observable(isNew === undefined ? false : isNew);
  self.name = ko.observable(data.name).extend({ editable: self });
  self.maxWip = ko.observable(data.maxWip).extend({ editable: self });
  
  self.tasks.sort(function(left, right) {
    return left.priority() - right.priority();
  });
  
  self.tasks.id = ko.computed(function() {
    return self.id();
  });
  
  self.visibleTasks = ko.computed(function() {
    return self.tasks().filter(function(task){
      return task.show() === 1;
    });
  });
  
  self.isEmpty = ko.computed(function() {
    return self.visibleTasks().length === 0;
  });
  
  self.wipLevel = ko.computed(function() {
    if (self.maxWip() === '')
      return 'wip gray'
    if (self.visibleTasks().length < 0.25 * self.maxWip())
      return 'wip green';
    if (self.visibleTasks().length >= 0.25 * self.maxWip() && self.visibleTasks().length < 0.5 * self.maxWip())
      return 'wip blue';
    if (self.visibleTasks().length >= 0.5 * self.maxWip() && self.visibleTasks().length < 0.75 * self.maxWip())
      return 'wip orange';
    if (self.visibleTasks().length >= 0.75 * self.maxWip())
      return 'wip red';
  });
  
  self.add = function() {
    Persist.add('section', ko.mapping.toJSON(self));
  };
  
  self.update = function() {
    Persist.update('section', ko.mapping.toJSON(self));
  };
  
  self.remove = function() {
    self.show(0);
    self.update();
  };
  
  self.createTask = function(model) {
    model.add();
    self.tasks.unshift(model);
  };
  
  self.moveTask = function(arg) {
    var model = arg.item;
    model.move(arg);
  };
  
  self.removeTask = function(model) {
    model.remove();
    self.tasks.remove(model);
  };
};

var TaskViewModel = function(data, isNew) {
  var self = this;
  
  data = Util.extend(data, { id: '', section: '', priority: '', order: '', type:'normal', project:'', title: 'Task Title', description: '', show: 1, history: [] });
  
  ko.mapping.fromJS(data, {
    history: {
      create : function (options) {
        return new TaskHistoryEntryViewModel(options.data);
      }
    }
  }, self);
  
  self.isNew = ko.observable(isNew === undefined ? false : isNew);
  self.moving = ko.observable(false);
  self.title = ko.observable(data.title).extend({ editable: self });
  self.description = ko.observable(data.description).extend({ editable: self });
  
  self.completeTitle = ko.computed({
    read: function () {
      var text = '';
      text += '[' + self.type() + '] ';
      text += '[' + self.project() + '] ';
      return text + self.title();
    },
    write: function (value) {
      var taskTitle = Util.splitTitleInformation(value);
      self.type(taskTitle.type);
      self.project(taskTitle.project);
      self.title(taskTitle.title);
    },
    owner: self
  });
  
  self.completeDescription = ko.computed(function() {    
    return '<ul class="task-subtasks">' + Util.processMarkdown(self.description()) + '</ul>';
  });
  
  self.add = function() {
    Persist.add('task', ko.mapping.toJSON(self));
  };
  
  self.update = function() {
    Persist.update('task', ko.mapping.toJSON(self));
  };
  
  self.remove = function() {
    self.show(0);
    self.update();
  };
  
  self.move = function(arg) {
    self.moving(true);
    self.section(arg.targetParent.id());
    
    var tasks = [];
    
    if (arg.sourceParent.id() === arg.targetParent.id()) {
      var start = Math.min(arg.sourceIndex, arg.targetIndex);
      var end = Math.max(arg.sourceIndex, arg.targetIndex);
      
      for (var i = start; i <= end; i++) {
        arg.sourceParent()[i].priority(i);
        tasks.push(arg.sourceParent()[i]);
      }
    }
    else {
      for (var i = arg.sourceIndex; i < arg.sourceParent().length; i++) {
        arg.sourceParent()[i].priority(i);
        tasks.push(arg.sourceParent()[i]);
      }
      
      arg.item.priority(arg.targetIndex);
      tasks.push(arg.item);
      
      for (var i = arg.targetIndex+1; i < arg.targetParent().length; i++) {
        arg.targetParent()[i].priority(i);
        tasks.push(arg.targetParent()[i]);
      }
    }
    
    Persist.update('tasks', ko.mapping.toJSON(tasks));
    Persist.add('tasklog', ko.mapping.toJSON(new TaskLogViewModel({task:arg.targetParent()[arg.targetIndex].id(), fromSection:arg.sourceParent.id(), toSection:arg.targetParent.id()})));

    self.moving(false);
  };
};

var TaskLogViewModel = function(data) {
  var self = this;
  
  data = Util.extend(data, { task:'', fromSection:'', toSection:'', date: new Date() });
  
  ko.mapping.fromJS(data, {}, self);
};
