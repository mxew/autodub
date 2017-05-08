# AutoDub for dubtrack.fm
AutoDub is an add-on for dubtrack.fm that allows you to automatically upvote.

### Google Chrome Extension
AutoDub is avaliable as a Google Chrome extension in the [Chrome Webstore](https://chrome.google.com/webstore/detail/mhonnfcjdgchonjipljdfimipifeelid/).

## #Bookmarklet
If you don't want to use the Chrome extension, you can use AutoDub by injecting the script into dubtrack.fm with a bookmarklet.
````javascript
javascript: (function() {if ($('#autodub').length) {} else {var script = document.createElement('script');script.id = 'autodub';script.type = 'text/javascript';script.src = 'https://mxew.github.io/autodub/autodub.js';document.body.appendChild(script);}})();
````
