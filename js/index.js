'use strict';

const background = browser.extension.getBackgroundPage();

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var status = JSON.stringify(request);
  document.getElementById("statusPhrase").textContent = JSON.parse(status).safety;
  document.getElementById("statusPhrase").style.color = JSON.parse(status).color;
  document.getElementById("statusIndicator").style.color = JSON.parse(status).color;
});

browser.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  background.checkSafety(tabs[0].id);
});