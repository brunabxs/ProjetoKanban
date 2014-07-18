// Section Class
function Section(data) {
  var self = this;

  for (var i = 0; i < Section.ATTRIBUTES.length; i++) {
    self[Section.ATTRIBUTES[i]] = data[Section.ATTRIBUTES[i]] || data[i+1] || '';
  }

  self.tasks = [];
}

// constants

// static
Section.reset = function(nextOrder, attributes) {
  Section.NEXT_ORDER = nextOrder;

  Section.ATTRIBUTES = [];
  for (var key in attributes) {
    Section.ATTRIBUTES.push(attributes[key]);
  }  
};

// methods
Section.prototype.toObject = function() {
  var section = {};
  for (var i = 0; i < Section.ATTRIBUTES.length; i++) {
    section[i+1] = this[Section.ATTRIBUTES[i]];
  }
  return section;
}

Section.prototype.setTasks = function(tasks) { this.tasks = tasks; };

// export
module.exports = Section;