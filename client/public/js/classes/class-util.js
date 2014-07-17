var Util = Util || {};

Util.extend = function(destination, source) {
  if (destination === undefined)
    return source;
    
  for (var property in source)
    if (destination[property] === undefined)
      destination[property] = source[property];
  return destination;
};

Util.TYPES = ['normal', 'extra', 'bug'];
Util.splitTitleInformation = function(text) {
  var elements = text.match(/[ ]*[^\[\]]+/gi);
  elements = Util.clearArrayElements(elements);
  
  var title = elements.length === 0 ? '' : elements[elements.length-1];
  var type = ''
  var project = '';
  
  for (var i = 0; i < elements.length-1; i++) {
    if (Util.TYPES.indexOf(elements[i]) !== -1) {
      type = elements[i];
    }
    else {
      project = elements[i];
    }
  }
  
  return {title: title, type: type, project: project};
}

Util.clearArrayElements = function(array) {
  if (array === null) return [];
  
  return array.map(function(element) {
    return element.replace('[', '').replace(']', '').replace(/[ ]+/gi, ' ').trim();
  }).filter(function(element) {
    return element !== '';
  });
}

Util.processMarkdown = function(text) {
  text = text.replace(/([^\n]+)/gi, '<li>$1</li>');
  
  text = text.replace(/<li>-[ ]*(.*?)[ ]*<\/li>/gi, '<li class="task-subtask icon listed line">$1</li>');
  text = text.replace(/<li>\*[ ]*(.*?)[ ]*<\/li>/gi, '<li class="task-subtask icon doing ribbon">$1</li>');
  text = text.replace(/<li>#[ ]*(.*?)[ ]*<\/li>/gi, '<li class="task-subtask icon done check">$1</li>');
  text = text.replace(/<li>x[ ]*(.*?)[ ]*<\/li>/gi, '<li class="task-subtask icon discarded cross">$1</li>');
  
  // clean
  text = text.replace(/[ ]+/gi, ' ');
  text = text.replace(/<li>[ ]*[\n]*[ ]*<\/li>/gi, '');
  text = text.replace(/<li([.*?])> /gi, '<li$1>');
  text = text.replace(/ <\/li>/gi, '</li>');
  text = text.replace(/\n/gi, '');

  // styles
  text = text.replace(/___(.*?)___/g, '<span class="underline">$1</span>');
  text = text.replace(/__(.*?)__/g, '<span class="strong">$1</span>');
  text = text.replace(/_(.*?)_/g, '<span class="italic">$1</span>');
  text = text.replace(/~(.*?)~/g, '<span class="strike">$1</span>');
  text = text.replace(/\((.*?)\)[ ]*\[(.*?)\]/g, '<a class="link" href="$2" target="_blank">$1</a>');

  return text;
};

Util.openSectionDialog = function() {
  jQuery('#dialogSection').dialog('open');
};

Util.closeSectionDialog = function() {
  jQuery('#dialogSection').dialog('close');
};

Util.openTaskDialog = function() {
  jQuery('#dialogTask').dialog('open');
};

Util.closeTaskDialog = function() {
  jQuery('#dialogTask').dialog('close');
};