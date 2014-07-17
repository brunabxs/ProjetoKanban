var OfflinePersist = OfflinePersist || {};

OfflinePersist.add = function(object, data) {
}

OfflinePersist.update = function(object, data) {
}

OfflinePersist.startUpdateLocalStorage = function(appViewModel) {
  if (localStorage.getItem('Kanban.sections'))
    appViewModel.updateSections(JSON.parse(localStorage.getItem('Kanban.sections')))
    
  OfflinePersist.updateLocalStorage(appViewModel);
}

OfflinePersist.updateLocalStorage = function(appViewModel) {
  appViewModel.isOfflineModeOn(true);
  
  localStorage.setItem('Kanban.requests', JSON.stringify([]));
  localStorage.setItem('Kanban.sections', ko.mapping.toJSON(appViewModel.sections()));
  localStorage.setItem('Kanban.lastSync', new Date());
  setTimeout(function(){OfflinePersist.updateLocalStorage(appViewModel)}, 5000);
}