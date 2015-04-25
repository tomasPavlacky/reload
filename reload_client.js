/**
 * example connection url with port ws://localhost:22245
 *
 * @param {String} url
 */
var Reload = function(url) {
    try{
        this.webSocket = new WebSocket(url);

        this.webSocket.onmessage = this.message.bind(this);
    }catch(e){
        console.log("Nelze se spojit s websocket serverem");
    }
}

Reload.prototype.changeCss = function() {
    var head = document.querySelector("head");
    var stylesheets = document.querySelectorAll("link[rel='stylesheet']");
    var stringStylesheets = [];

    for (var i = 0; i < stylesheets.length; i++) {
        var stringStylesheets = stylesheets[i].outerHTML;
        head.removeChild(stylesheets[i]);
        head.insertAdjacentHTML("beforeend", stringStylesheets);
    }
};

Reload.prototype.message = function(evt) {
    var data = JSON.parse(evt.data);

    if (data.type == "css") { this.changeCss(); }
    if (data.type == "js") { location.reload(); }
    if (data.type == "templ") { location.reload(); }
};
