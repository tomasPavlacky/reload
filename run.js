#!/usr/bin/env node

var Loader = function() {
    if (process.argv.length == 2) {
        this.showUsage();
        return;
    };

    this.timeout = "";
    this.params = this.parseParams();
    this.server = this.startServer();

    console.log(this.params);

    this.startWatch();
};

/**
 * @return {{}}
 */
Loader.prototype.parseParams = function() {
    var params = { watch: {} };

    if (process.argv.indexOf("--port") != -1) { params.port = process.argv[process.argv.indexOf("--port") + 1]; }
    if (process.argv.indexOf("-p") != -1) { params.port = process.argv[process.argv.indexOf("-p") + 1]; }
    if (process.argv.indexOf("--css") != -1) { params.watch.css = process.argv[process.argv.indexOf("--css") + 1]; }
    if (process.argv.indexOf("-c") != -1) { params.watch.css = process.argv[process.argv.indexOf("-c") + 1]; }
    if (process.argv.indexOf("--html") != -1) { params.watch.html = process.argv[process.argv.indexOf("--html") + 1]; }
    if (process.argv.indexOf("-t") != -1) { params.watch.html = process.argv[process.argv.indexOf("-t") + 1]; }
    if (process.argv.indexOf("--js") != -1) { params.watch.js = process.argv[process.argv.indexOf("--js") + 1]; }
    if (process.argv.indexOf("-j") != -1) { params.watch.js = process.argv[process.argv.indexOf("-j") + 1]; }

    return params;
};


Loader.prototype.startServer = function() {
    var WebSocketServer = require("websocketserver");

    return new WebSocketServer("all", this.params.port);
};

Loader.prototype.startWatch = function() {
    var watch = require("watch");

    console.log("\n===== starting watch =====\n");

    for (var type in this.params.watch) {
        try{
            var watchTmp = Object.create(watch);
            watchTmp.watchTree(this.params.watch[type], this.sendSignal.bind(this, type));
        }catch(e){
            throw new Error(this.params.watch[type] + " no such file or directory")
        }
    }
};

/**
 * @param  {String} type .. [js, css, html]
 * @param  {String} name .. fileName
 */
Loader.prototype.sendSignal = function(type, name) {
    clearTimeout(this.timeout);
    // timeout because stupid fs.watch or watch emit signal twice
    this.timeout = setTimeout(function(){
        if (typeof name == "object") { return true; };

        console.log(type + " changed / " + name + " | " + new Date());
        this.server.sendMessage("all", JSON.stringify({file: name, type: type}));
    }.bind(this), 100);
};

Loader.prototype.showUsage = function() {
    console.log("usage: ./run.js --port 3003 [--css path to compiled css directory --js path to compiled js directory --html path to html directory]");
};

var loader = new Loader();
