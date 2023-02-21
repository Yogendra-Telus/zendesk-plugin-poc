(function () {
  var client = ZAFClient.init();
  client.invoke('resize', { width: '100%', height: '180px' });
  showSearchForm();

  document.getElementById("get-btn").addEventListener("click", function(event) {
    event.preventDefault();
    var search_str = document.getElementById("subject-field").value;
    getArticles(search_str, client);
  });
})();

function showSearchForm() {
  var source = document.getElementById("search-template").innerHTML;
  var template = Handlebars.compile(source);
  document.getElementById("content").innerHTML = template();
}

function showError() {
  var error_data = {
    code: "codestring",
    info: "info text",
  };
  var source = document.getElementById("error-template").innerHTML;
  var template = Handlebars.compile(source);
  var html = template(error_data);
  document.getElementById("content").innerHTML = html;
}
