"use strict";

// Store options
chrome.runtime.onInstalled.addListener(function () {
	// Notification after install
	chrome.notifications.create({
		type: "basic",
		title: chrome.i18n.getMessage("appName"),
		message: "Extension Installed!",
		iconUrl: "../images/128.png",
		silent: true
	});
});
