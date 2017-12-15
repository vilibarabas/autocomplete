# autocomplete
var input = $("#form_what"); //select your input for which you want to attach the autocomplete
var url = 'http://127.0.0.1:8001/search/autocomplete'; 
//you have to send and AJAX POST requrest to this url with the want autocomplete list and the return body will contain a list of elements in JSON string format
for example : [{"text" : "val1"}, {"text" : "val2"}]
var auto = new Autocomplete(input, url);
auto.init();
