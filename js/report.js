'use strict';

const background = browser.extension.getBackgroundPage();

let reportCurrent = document.getElementById("reportCurrent");
let maliciousSite = document.getElementById("maliciousSite");
let list = document.getElementById("targets");

reportCurrent.onclick = function (element) {
  browser.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    maliciousSite.value = tabs[0].url;
  });
};

background.whitelist.forEach(function (item) {
  var option = document.createElement('option');
  option.value = item;
  list.appendChild(option);
});

function recaptchaCallback(captchaData) {

  const url = document.getElementById("maliciousSite").value;
  const domain = getDNSNameFromURL(url);
  const target = getDNSNameFromURL(document.getElementById("target").value);
  const comment = document.getElementById("comment").value;

  document.getElementById("reportButton").classList.add("disabled");

  const requestData = {
    url: url,
    malicious: domain,
    target: target,
    comment: comment,
    captcha: captchaData,
  }
  fetch("https://us-central1-plugin-recaptcha.cloudfunctions.net/validate-captcha", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  }).then(response => {
    window.location.replace("success.html");
  }).catch(err => {
    recaptchaError();
  });
}

function recaptchaError() {
  window.location.replace("error.html");
};

function getDNSNameFromURL(url) {
  if (url.startsWith("http://")) {
    url = url.replace("http://", "");
  } else if (url.startsWith("https://")) {
    url = url.replace("https://", "");
  }

  if(url.indexOf("/") > -1) {
    url = url.split("/")[0];
  }

  let domain = url;

  return domain;
}