function lock_page(time) {
	document.getElementsByTagName("body")[0].style.visibility = "hidden";
	if (time >= 0) {
		window.alert("Locking for " + time + " seconds.");
		window.setTimeout(unlock_page, time * 1000);
		self.port.emit("start_lockdown");
	}
	else {
		window.alert("Locking indefinitely.");
	}
}

function unlock_page() {
	window.alert("Done");
	document.getElementsByTagName("body")[0].style.visibility = "visible";
	self.port.emit("stop_lockdown");
}

self.port.on("lock_page", lock_page);
