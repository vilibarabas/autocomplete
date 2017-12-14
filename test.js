$(document).ready(function() {
  var input = $("#form_what"); //select your input for which you want to attach the autocomplete
  var url = 'http://127.0.0.1:8001/search/autocomplete'; //your autocomplate item list provider ajax POST url
  var auto = new Autocomplete(input, url);
  auto.getUrlParameter = function () {
    var params={};
    window.location.search
      .replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
        if(key == 'c') {
          key = 'what';
        }
        params[key] = value;
      }
    );

    return params;
  };

  auto.setImputValues = function () {
    var getUrlParameter = this.getUrlParameter();

    for(key in getUrlParameter) {
      var element = $("#form_" + key);
      if(element && !$(element).val()) {
        $(element).val(decodeURIComponent(getUrlParameter[key]));
      }
    }
  };

  auto.setImputValues();

  auto.createResult = function (data) {
    var item = $('<' + this.settings.item + '/>');
    item.text(data['text']);
    item.attr({"data-type" : data['type']});
    return item;
  };
  auto.setInputValues = function (item, $submit = false) {
    this.element.val(item.text());
    if( $submit )
      this.element.parents('form:first').submit();
    $("#form_what_type").val(item.attr("data-type"));
  };


  auto.init();
});


