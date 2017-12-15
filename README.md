# autocomplete
var input = $("#form_what"); //select your input for which you want to attach the autocomplete
var url = 'http://127.0.0.1:8001/search/autocomplete'; //your autocomplate item list provider ajax POST url
return body will contain a list of elements in json string format, list element {'text' : 'value'}
for example : [{"text" : "val1"}, {"text" : "val2"}]
var auto = new Autocomplete(input, url);
auto.init();
