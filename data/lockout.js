function lock(time) {
	document.getElementsByTagName("body")[0].style.visibility = "hidden";
	if (time >= 0) {
		window.alert("Locking for " + time + " seconds.");
		window.setTimeout(unlock, time * 1000);
	}
	else {
		window.alert("Locking indefinitely.");
	}
}

function unlock() {
	window.alert("Done");
	document.getElementsByTagName("body")[0].style.visibility = "visible";
	self.port.emit("unlock");
}

self.port.on("lock", lock);
