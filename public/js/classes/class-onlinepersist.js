var OnlinePersist = OnlinePersist || {};

OnlinePersist.__isSendingPendingRequests = undefined;
OnlinePersist.__isUpdatingLocalStorage = undefined;
OnlinePersist.__lastTaskRequest = undefined;

OnlinePersist.add = function(object, data) {
  OnlinePersist.__pushLSRequest({action: 'add', type: object, data: data});
}

OnlinePersist.update = function(object, data) {
  OnlinePersist.__pushLSRequest({action: 'update', type: object, data: data});
}

OnlinePersist.__getLSRequests = function() {
  if (!localStorage.getItem('Kanban.requests')) {
    localStorage.setItem('Kanban.requests', JSON.stringify([]));
  }

  return JSON.parse(localStorage.getItem('Kanban.requests'));
}

OnlinePersist.__getFirstLSRequest = function() {
  var requests = OnlinePersist.__getLSRequests();
  var request = requests.shift();
  localStorage.setItem('Kanban.requests', JSON.stringify(requests));
  
  return request;
}

OnlinePersist.__setFirstLSRequest = function(request) {
  var requests = OnlinePersist.__getLSRequests();
  requests.unshift(request);
  localStorage.setItem('Kanban.requests', JSON.stringify(requests));
}

OnlinePersist.__pushLSRequest = function(request) {
  var requests = OnlinePersist.__getLSRequests();
  requests.push(request);
  localStorage.setItem('Kanban.requests', JSON.stringify(requests));
}

OnlinePersist.__sendPendingRequests = function() {
  if (OnlinePersist.__isSendingPendingRequests) {
    setTimeout(function(){OnlinePersist.__sendPendingRequests()});
    return;
  }
  
  OnlinePersist.__isSendingPendingRequests = true;
  
  var request = OnlinePersist.__getFirstLSRequest();
  
  if (request === undefined) {
    OnlinePersist.__isSendingPendingRequests = false;
    setTimeout(function(){OnlinePersist.__sendPendingRequests()});
    return;
  }
  
  jQuery.post('/' + request.action + '/' + request.type, {data: request.data})
  .done(function(date) {
    OnlinePersist.__lastTaskRequest = new Date(date);
    console.log( 'Local Storage Request Sent! ' );
    
    OnlinePersist.__isSendingPendingRequests = false;
    OnlinePersist.__sendPendingRequests();
  })
  .fail(function(jqXHR, textStatus, error) {
    var err = textStatus + ', ' + error;
    console.log( 'Local Storage Request Failed! ' );
    
    OnlinePersist.__setFirstLSRequest(request);
    
    OnlinePersist.__isSendingPendingRequests = false;
    setTimeout(function(){OnlinePersist.__sendPendingRequests()}, 1000);
  });
}

OnlinePersist.startUpdateLocalStorage = function(appViewModel) {
  OnlinePersist.updateLocalStorage(appViewModel);
}

OnlinePersist.updateLocalStorage = function(appViewModel) {
  if (OnlinePersist.__isUpdatingLocalStorage) {
    setTimeout(function(){OnlinePersist.updateLocalStorage(appViewModel)}, 1000);
    return;
  }
    
  OnlinePersist.__isUpdatingLocalStorage = true;
  
  jQuery.getJSON('/data')
  .success(function(data, textStatus, jqXHR) {
    var lastSync = data.lastSync ? new Date(data.lastSync) : new Date(0);
    
    localStorage.setItem('Kanban.sections', JSON.stringify(data.sections));
    localStorage.setItem('Kanban.lastSync', lastSync); 
    
    var sections;
    if (OnlinePersist.__lastTaskRequest <= lastSync || OnlinePersist.__lastTaskRequest === undefined) {
      sections = JSON.parse(localStorage.getItem('Kanban.sections'));
      
      if (sections !== undefined) {
        appViewModel.updateSections(sections);
      }
    }
    appViewModel.lastSync(lastSync);
    appViewModel.isOfflineModeOn(false);
  })
  .fail(function(jqXHR, textStatus, error) {
    var err = textStatus + ', ' + error;
    console.log( 'Local Storage Update Failed! ' );
    appViewModel.isOfflineModeOn(true);
  })
  .always(function() {
    OnlinePersist.__isUpdatingLocalStorage = false;
    setTimeout(function(){OnlinePersist.updateLocalStorage(appViewModel)}, 1000);
  });
}
