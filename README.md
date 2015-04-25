# reload
Automatic reload changed css or refresh web browser after change js, html.

1) install all dependencies
```bash
$ npm install
```

2) run watcher, insert params paths to direcories or files
```bash
$ ./run.js --port 3003 --css ../path/to/css/directory --js ../path/to/js/directory --html ../path/to/template/directory
```

3) insert js script to template reload_client.js

The script uses for communication with server websockets.
