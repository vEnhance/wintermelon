var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var prefs = require("sdk/simple-prefs").prefs

// TODO make these not suck
var regex_strings = new Array();
regex_strings[0] = prefs.regex1;
regex_strings[1] = prefs.regex2;
regex_strings[2] = prefs.regex3;
regex_strings[3] = prefs.regex4;
regex_strings[4] = prefs.regex5;
regex_strings[5] = prefs.regex6;

var lock_times = new Array();
lock_times[0] = prefs.time1;
lock_times[1] = prefs.time2;
lock_times[2] = prefs.time3;
lock_times[3] = prefs.time4;
lock_times[4] = prefs.time5;
lock_times[5] = prefs.time6;

// Create regular expressions
var N = regex_strings.length;
var regexes = new Array();
for (var i=0; i<regex_strings.length; i++) {
  regexes[i] = new RegExp(regex_strings[i]);
}
  
var lockdown = false; // Are we currently in a lockdown?

function lock(time) {
  worker = tabs.activeTab.attach({
    contentScriptFile: self.data.url("lockout.js")
    });
  worker.port.emit("lock_page", time); // tell the worker to lock
  worker.port.on("start_lockdown", start_lockdown);
  worker.port.on("stop_lockdown", stop_lockdown);
}

function start_lockdown() {
  lockdown = true; // prevent side loading
}
function stop_lockdown() {
  lockdown = false;
  okay_to_load = curr_locking;
}

var curr_locking = -1; 
var okay_to_load = -1;

function gateway(tab) {
  url = tab.url;
  if (lockdown) {
    // Currently under a lockdown
    // Do not allow any other tabs to load
    lock(lock_times[curr_locking]);
    return;
  }
  for (var i=0; i<N; i++) {
    var regex = regexes[i];
	console.log("==============\n");
	console.log(okay_to_load + "\n");
	console.log("==============\n");
    if (regex.test(url) && regex_strings[i] != "") {
      if (okay_to_load != i) {
        // Test positive, we are going to block
        lock(lock_times[i]);
		curr_locking = i;
        return;
      }
	  else {
		return; // okay
	  }
    }
  }
  okay_to_load = -1; // Release
}

tabs.on("ready", gateway);
