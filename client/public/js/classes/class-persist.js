var Persist = Persist || {};

Persist.controller = undefined;

Persist.start = function(callback) {
  jQuery.getJSON('/data')
  .success(function(data, textStatus, jqXHR) {
    Persist.controller = OnlinePersist;
    Persist.controller.__sendPendingRequests();
  })
  .fail(function(jqXHR, textStatus, error) {
    Persist.controller = OfflinePersist;
  })
  .always(function() {
    callback();
  });
}

Persist.add = function(object, data) {
  Persist.controller.add(object, data);
}

Persist.update = function(object, data) {
  Persist.controller.update(object, data);
}

Persist.startUpdateLocalStorage = function(appViewModel) {
  Persist.controller.startUpdateLocalStorage(appViewModel);
}