class Autocomplete{
  constructor(element, ajax_url, settings) {
    this.resultItems = null;
    var self = this;
    this.element = element;
    this.settings = settings || {
      'container': 'ul class="autocomplete-results-container"',
      'item': 'li',
      'location_number' : '#search_location_tid',
      'ajax_param_key' : 'what'
    };
    this.settings.ajax_url = ajax_url;
    this.searchElementTid = $(this.settings.location_number);
    this.container = this.createContainer().insertAfter(this.element);
    this.setValue = false;
  };
};

Autocomplete.prototype.init = function() {
  this.setContainerStyle();
  this.attacheEvents();
};

Autocomplete.prototype.setContainerStyle = function () {

  this.element.parent().css('position', 'relative');
};

Autocomplete.prototype.attacheEvents = function() {
  var self = this;
  var currentVal = this.element.val();


  this.element.blur(function () {
    self.hideContainer();
  });

  this.element.keyup(function (event) {
    if(self.setValue) {
      self.setValue = false;
      return;
    }

    var text = self.element.val();

    if (text === currentVal) {
      return;
    }

    currentVal = text;
    self.hideContainer();

    if (text.length === 0) {
      return;
    }

    self.dataProvider(text);
  }).keydown(function (event) {
    switch (event.keyCode) {
      case 38: // up
        event.stopImmediatePropagation();
        var active = self.container.children('.active').first();
        if (active.length !== 0) {
          active.removeClass('active');
          active = active.prev();

          if (active.length === 0)
          {
            active = self.container.children().last();
          }
        }
        else {
          active = self.container.children().last();
        }
        active.addClass('active');
        break;
      case 40: // down
        event.stopImmediatePropagation();
        var active = self.container.children('.active').first();
        if (active.length !== 0) {
          //console.log(active.prev());
          active.removeClass('active');
          active = active.next();

          if (active.length === 0)
          {
            active = self.container.children().first();
          }
        }
        else {
          active = self.container.children().first();
        }
        active.addClass('active');
        break;
      case 13: // enter
        self.container.children('.active').trigger('click');
        self.element.blur();
        break;
      case 27: // escape
        self.hideContainer();
        break;
    }
    if(active) {
      self.setInputValues(active);
      self.setValue = true;
    }
  });
};

Autocomplete.prototype.dataProvider = function(string) {
  var self = this;
  var params_key = self.settings.ajax_param_key;
  $.ajax({
    url: self.settings.ajax_url + '?' + params_key + '=' + string,
    type: 'POST',
    success: function(result){
      var data = JSON.parse(result);
      self.initItems(data.result_terms);
    }
  });
};

Autocomplete.prototype.initItems = function(itemList) {
  var self = this;
  for (var i in itemList) {
    if(itemList[i]['text'])
      this.container.append(this.createResult(itemList[i]));
  }
  //add click event set input values
  $(".autocomplete-results-container").children("li").each(function() {
    $(this).on('mousedown', function() {
      self.setInputValues($(this), $(this).attr('data-tid'));
    });
  });

  if(i)
    this.showContainer();
};

Autocomplete.prototype.hideContainer = function () {
  this.container.hide();
  this.container.children("li").remove();
};

Autocomplete.prototype.showContainer = function () {
  var offset = {
    top: 0,
    left: 0,
  };
  offset.top += this.element.outerHeight();
  offset.minWidth = this.element.innerWidth();
  this.container.css(offset);
  this.container.show();
};

Autocomplete.prototype.createContainer = function () {
  var container = $('<' + this.settings.container + '/>');
  container.hide();
  container.css('position', 'absolute');
  var self = this;

  container.click(function (event) {
    var item = $(event.target);
    if (item.is(self.settings.item)) {
      self.setInputValues(item, 1);
      self.hideContainer();
    }
  }).on('mouseenter', self.settings.item, function(event){
    var item = $(event.target);
    self.container.children('.active').removeClass('active');
    item.addClass('active');
   });

  return container;
};

Autocomplete.prototype.setInputValues = function ($item, $submit = false) {
  this.element.val($item.text());
  if($submit)
    this.element.parents('form:first').submit();
};

Autocomplete.prototype.createResult = function (data) {
  var item = $('<' + this.settings.item + '/>');
  item.text(data['text']);
  return item;
};
