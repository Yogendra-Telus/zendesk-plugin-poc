(function () {
  var client = ZAFClient.init();
  client.invoke("resize", { width: "100%", height: "180px" });
  client.get(["ticket.conversation"]).then(function (data) {
    console.log("tikcet", data); // { 'ticket.subject': 'Help, my printer is on fire', 'ticket.requester.name': 'Mikkel Svane' }
    var len = data["ticket.conversation"].length;
    var data_last = data["ticket.conversation"][len - 1];
    if (len && data_last) {
      console.log("last conversation", data_last);
      var error_data = {
        code: "Source text 'Chinese'",// this should come from detect api
        source_text: data_last.message.content,
        translated_text:'Hello How are you?'// translated text
      };
      showError(error_data);
    }
  });
  //showSearchForm();

  document
    .getElementById("get-btn")
    .addEventListener("click", function (event) {
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

function showError(error_data) {
  var source = document.getElementById("error-template").innerHTML;
  var template = Handlebars.compile(source);
  var html = template(error_data);
  document.getElementById("content").innerHTML = html;
}
