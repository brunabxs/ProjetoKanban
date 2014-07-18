jQuery(document).ready(function() {

  ko.extenders.editable = function(target, object) {
    target.editing = ko.observable(false).extend({ submitOnChange: object });
    target.startEdit = function() {
      target.editing(true);
    };
    return target;
  };
  
  ko.extenders.submitOnChange = function(target, object) {
    function submit(value) {
      if (value === false && !object.isNew()) {
        object.update();
      }
    }
    target.subscribe(submit);
    return target;
  };
  
  jQuery('#dialogSection, #dialogTask').dialog({
    dialogClass: "no-close",
    autoOpen: false,
    closeOnEscape: true,
    closeText: '',
    draggable: false,
    modal: true,
    resizable: false,
    width: 500,
    height: 400,
  });
  
  jQuery('#btnConfirmTask').click(function (event) {
    jQuery('#formTask').submit();
    Util.closeTaskDialog();
    ko.contextFor(this).$root.addingTask(false);
    return false;
  });
  
  jQuery('#btnCancelTask').click(function (event) {
    Util.closeTaskDialog();
    ko.contextFor(this).$root.addingTask(false);
    return false;
  });
  
  jQuery('#btnNewTask').click(function (event) {
    ko.contextFor(this).$root.addingTask(true);
    Util.openTaskDialog();
    ko.contextFor(this).$root.prepareNewTask();
    return false;
  });
  
  jQuery('#btnConfirmSection').click(function (event) {
    jQuery('#formSection').submit();
    Util.closeSectionDialog();
    ko.contextFor(this).$root.addingSection(false);
    return false;
  });
  
  jQuery('#btnCancelSection').click(function (event) {
    Util.closeSectionDialog();
    ko.contextFor(this).$root.addingSection(false);
    return false;
  });
  
  jQuery('#btnNewSection').click(function (event) {
    ko.contextFor(this).$root.addingSection(true);
    Util.openSectionDialog();
    ko.contextFor(this).$root.prepareNewSection();
    return false;
  });
  
  Persist.start(function() {
    ko.applyBindings(new AppViewModel());
  });
  
});
