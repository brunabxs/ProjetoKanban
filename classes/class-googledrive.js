var Properties = require('./../node-server-properties');
var Util = require('./class-util');
var Section = require('./class-section');
var Task = require('./class-task');
var TaskLog = require('./class-tasklog');

// GoogleDrive Class
var GoogleDrive = {};

// constants
GoogleDrive.SPREADSHEET_NAME = Properties.SPREADSHEET_NAME;
GoogleDrive.SECTIONS_WORKSHEET_NAME = Properties.SECTIONS_WORKSHEET_NAME;
GoogleDrive.TASKS_WORKSHEET_NAME = Properties.TASKS_WORKSHEET_NAME;
GoogleDrive.TASKLOGS_WORKSHEET_NAME = Properties.TAKSLOGS_WORKSHEET_NAME;
GoogleDrive.USERNAME = Properties.USERNAME;
GoogleDrive.PASSWORD = Properties.PASSWORD;
GoogleDrive.LOCAL_DATA_REFRESH = Properties.LOCAL_DATA_REFRESH;
GoogleDrive.LOG = Properties.SERVER_APP_LOG;
GoogleDrive.DEBUG = Properties.GOOGLE_DRIVE_LOG;

// static
GoogleDrive.lastSync = undefined;
GoogleDrive.spreadsheet = require('edit-google-spreadsheet');
GoogleDrive.sections = [];
GoogleDrive.tasks = [];
GoogleDrive.sectionSemaphore = require('semaphore')(1);
GoogleDrive.taskSemaphore = require('semaphore')(1);
GoogleDrive.taskLogSemaphore = require('semaphore')(1);

// methods
GoogleDrive.__log = function() {
  if (GoogleDrive.LOG) console.log.apply(console, arguments);
};

GoogleDrive.__loadWorksheet = function(worksheet, callback) {
  GoogleDrive.spreadsheet.load({
    debug: GoogleDrive.DEBUG,
    spreadsheetName: GoogleDrive.SPREADSHEET_NAME,
    worksheetName: worksheet,
    username: GoogleDrive.USERNAME,
    password: GoogleDrive.PASSWORD,
  },
  function sheetReady(err, spreadsheet) {
    if (err) throw err;
    callback(spreadsheet);
  });
};

GoogleDrive.__prepareOrder = function(objects, objectsToUpload, nextOrder) {
  var rowsToUpload = {};
  
  for (var i = 0; i < objectsToUpload.length; i++) {
    var match = objects.filter(function(object){ return object.id === objectsToUpload[i].id; });
    if (match.length > 0) {
      objectsToUpload[i].order = match[0].order;
    }
  }

  for (var i = 0; i < objectsToUpload.length; i++) {
    for (var j = 0; j < i; j++) {
      if (objectsToUpload[i].id && objectsToUpload[i].id === objectsToUpload[j].id) {
        objectsToUpload[i].order = objectsToUpload[j].order;
      }
    }
    
    // se é novo, atualiza a ordem
    if (!objectsToUpload[i].order) {
      objectsToUpload[i].order = ++nextOrder;
      
      // se é novo e não tem ID atualiza ID
      if (!objectsToUpload[i].id) {
        objectsToUpload[i].id = objectsToUpload[i].order;
      }
    }
  }
  
  for (var i = 0; i < objectsToUpload.length; i++) {
    rowsToUpload[objectsToUpload[i].order] = objectsToUpload[i].toObject();
  }
  
  return {rowsToUpload: rowsToUpload, nextOrder: nextOrder};
}

GoogleDrive.__uploadSections = function(spreadsheet, rows, sectionsToUpload) {
  GoogleDrive.__log('Section Worksheet (%s) upload started...', GoogleDrive.SECTIONS_WORKSHEET_NAME);

  GoogleDrive.__updateSections(rows);
  
  var prep = GoogleDrive.__prepareOrder(GoogleDrive.sections, sectionsToUpload, Section.NEXT_ORDER);
  Section.NEXT_ORDER = prep.nextOrder;
  var rowsToUpload = prep.rowsToUpload;

  spreadsheet.add(rowsToUpload);
  spreadsheet.send(function(err) {
    GoogleDrive.__log('Section Worksheet (%s) upload ended...', GoogleDrive.SECTIONS_WORKSHEET_NAME);
    GoogleDrive.__updateSections(Util.join(rows, rowsToUpload));
    GoogleDrive.__endUpdateSections();
    if (err) throw err;
  });
}

GoogleDrive.__uploadTasks = function(spreadsheet, rows, tasksToUpload) {
  GoogleDrive.__log('Task Worksheet (%s) upload started...', GoogleDrive.TASKS_WORKSHEET_NAME);

  GoogleDrive.__updateTasks(rows);

  var prep = GoogleDrive.__prepareOrder(GoogleDrive.tasks, tasksToUpload, Task.NEXT_ORDER);
  Task.NEXT_ORDER = prep.nextOrder;
  var rowsToUpload = prep.rowsToUpload;
  
  spreadsheet.add(rowsToUpload);
  spreadsheet.send(function(err) {
    GoogleDrive.__log('Task Worksheet (%s) upload ended...', GoogleDrive.TASKS_WORKSHEET_NAME);
    GoogleDrive.__updateTasks(Util.join(rows, rowsToUpload));
    GoogleDrive.__endUpdateTasks();
    if (err) throw err;
  });
}

GoogleDrive.__uploadTaskLogs = function(spreadsheet, rows, taskLogsToUpload) {
  GoogleDrive.__log('TaskLog Worksheet (%s) upload started...', GoogleDrive.TASKLOGS_WORKSHEET_NAME);
  
  GoogleDrive.__updateTaskLogs(rows);
  
  var prep = GoogleDrive.__prepareOrder([], taskLogsToUpload, TaskLog.NEXT_ORDER);
  TaskLog.NEXT_ORDER = prep.nextOrder;
  var rowsToUpload = prep.rowsToUpload;
  
  spreadsheet.add(rowsToUpload);
  spreadsheet.send(function(err) {
    GoogleDrive.__log('TaskLog Worksheet (%s) upload ended...', GoogleDrive.TASKLOGS_WORKSHEET_NAME);
    GoogleDrive.__updateTaskLogs(Util.join(rows, rowsToUpload));
    GoogleDrive.__endUpdateTaskLogs();
    if (err) throw err;
  });
}

GoogleDrive.__updateSections = function(rows) {
  GoogleDrive.__log('\tSection load started...');
  
  GoogleDrive.sections.length = 0;
  for (var rowIndex in rows) {
    var rowData = rows[rowIndex];
    GoogleDrive.sections.push(new Section(rowData));
  }
  
  GoogleDrive.sections.sort(function(left, right) {
    return left.order - right.order;
  });
  
  GoogleDrive.__log('\tSection load ended...');
}

GoogleDrive.__endUpdateSections = function() {
  GoogleDrive.sectionWorksheetTimeout = setTimeout(GoogleDrive.updateSections, GoogleDrive.LOCAL_DATA_REFRESH);
  GoogleDrive.sectionSemaphore.leave();  
  GoogleDrive.__setSectionsAndTasksReferences();
}

GoogleDrive.__updateTasks = function(rows) {
  GoogleDrive.__log('\tTask load started...');
  
  GoogleDrive.tasks.length = 0;
  for (var rowIndex in rows) {
    var rowData = rows[rowIndex];
    GoogleDrive.tasks.push(new Task(rowData));
  }
  
  GoogleDrive.tasks.sort(function(left, right) {
    return left.priority - right.priority;
  });
  
  GoogleDrive.__log('\tTask load ended...');
}

GoogleDrive.__endUpdateTasks = function() {
  GoogleDrive.taskWorksheetTimeout = setTimeout(GoogleDrive.updateTasks, GoogleDrive.LOCAL_DATA_REFRESH);
  GoogleDrive.taskSemaphore.leave();  
  GoogleDrive.__setSectionsAndTasksReferences();
}

GoogleDrive.__updateTaskLogs = function(rows) {
}

GoogleDrive.__endUpdateTaskLogs = function() {
  GoogleDrive.taskLogSemaphore.leave();  
}

GoogleDrive.__setSectionsAndTasksReferences = function() {
  GoogleDrive.__log('\t\tSections and Tasks references update started...');
  GoogleDrive.sectionSemaphore.take(function() {
    GoogleDrive.taskSemaphore.take(function() {
      if (GoogleDrive.sections.length !== 0 && GoogleDrive.tasks.length !== 0) {
        for (var i = 0; i < GoogleDrive.sections.length; i++) {
          var sectionId = GoogleDrive.sections[i].id;
          var tasks = GoogleDrive.tasks.filter(function(task){ return task.section === sectionId });
          GoogleDrive.sections[i].setTasks(tasks);
        }
      }
      // GoogleDrive.sections e GoogleDrive.tasks estão sincronizados
      GoogleDrive.lastSync = new Date();

      GoogleDrive.taskSemaphore.leave();
      GoogleDrive.sectionSemaphore.leave();
      GoogleDrive.__log('\t\tSections and Tasks references update ended...');
    });
  });
}

GoogleDrive.updateSections = function(sectionsToUpload) {
  GoogleDrive.__log('Sections Worksheet (%s) download started...', GoogleDrive.SECTIONS_WORKSHEET_NAME);
  
  GoogleDrive.sectionSemaphore.take(function() {
    clearTimeout(GoogleDrive.sectionWorksheetTimeout);
    GoogleDrive.__loadWorksheet(GoogleDrive.SECTIONS_WORKSHEET_NAME, function(spreadsheet) {
      spreadsheet.receive(function(err, rows, info) {
        // atributos de uma seção
        Section.reset(info.totalRows, rows[1]);
        delete rows[1];
        
        if (sectionsToUpload) {
          GoogleDrive.__uploadSections(spreadsheet, rows, sectionsToUpload);
        }
        else {
          GoogleDrive.__updateSections(rows);
          GoogleDrive.__endUpdateSections();
        }
        
        // encerra a atualização
        if (err) throw err;
        GoogleDrive.__log('Section Worksheet (%s) download ended...', GoogleDrive.SECTIONS_WORKSHEET_NAME);
      });
    });
  });
}

GoogleDrive.updateTasks = function(tasksToUpload) {
  GoogleDrive.__log('Task Worksheet (%s) download started...', GoogleDrive.TASKS_WORKSHEET_NAME);
  
  GoogleDrive.taskSemaphore.take(function() {
    clearTimeout(GoogleDrive.taskWorksheetTimeout);
    GoogleDrive.__loadWorksheet(GoogleDrive.TASKS_WORKSHEET_NAME, function(spreadsheet) {
      spreadsheet.receive(function(err, rows, info) {
        // atributos de uma tarefa
        Task.reset(info.totalRows, rows[1]);
        delete rows[1];
        
        if (tasksToUpload) {
          GoogleDrive.__uploadTasks(spreadsheet, rows, tasksToUpload);
        }
        else {
          GoogleDrive.__updateTasks(rows);
          GoogleDrive.__endUpdateTasks();
        }
        
        // encerra a atualização
        if (err) throw err;
        GoogleDrive.__log('Task Worksheet (%s) download ended...', GoogleDrive.TASKS_WORKSHEET_NAME);
      });
    });
  });
};

GoogleDrive.updateTaskLogs = function(taskLogsToUpload) {
  GoogleDrive.__log('TaskLog Worksheet (%s) download started...', GoogleDrive.TASKLOGS_WORKSHEET_NAME);
  
  GoogleDrive.taskLogSemaphore.take(function() {
    GoogleDrive.__loadWorksheet(GoogleDrive.TASKLOGS_WORKSHEET_NAME, function(spreadsheet) {
      spreadsheet.receive(function(err, rows, info) {
        // atributos de um log de tarefa
        TaskLog.reset(info.totalRows, rows[1]);
        delete rows[1];
        
        if (taskLogsToUpload) {
          GoogleDrive.__uploadTaskLogs(spreadsheet, rows, taskLogsToUpload);
        }
        else {
          GoogleDrive.__updateTaskLogs(rows);
          GoogleDrive.__endUpdateTaskLogs();
        }
        
        // encerra a atualização
        if (err) throw err;
        GoogleDrive.__log('TaskLog Worksheet (%s) download ended...', GoogleDrive.TASKLOGS_WORKSHEET_NAME);
      });
    });
  });
};

// export
module.exports = GoogleDrive;