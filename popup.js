var settings;
chrome.storage.sync.get(['settings'], function(result) {
    settings = result.settings;
    if(settings == undefined) {
        settings = {ac: true, cc: true, im: true, pe: true, gc: true, ca: "pw"};
    }
    console.log(settings);

    document.getElementById('ac').checked = settings.ac;
    document.getElementById('cc').checked = settings.cc;
    document.getElementById("algorithmSelect").value = settings.ca;
    document.getElementById("im").checked = settings.im;
    document.getElementById("pe").checked = settings.pe;
    document.getElementById("gc").checked = settings.gc;

let info = document.getElementById("info");
info.addEventListener('click', event => {
  document.getElementById("itab").style.display = "block";
  document.getElementsByClassName("right")[0].style.cssText = "background: rgb(255, 255, 255);"; 
  document.getElementsByClassName("left")[0].style.cssText = "background: rgb(189, 189, 189);"; 
  document.getElementById("stab").style.display = "none";
});

let settingsEl = document.getElementById("settings");
settingsEl.addEventListener('click', event => {
  document.getElementById("itab").style.display = "none";
  document.getElementsByClassName("right")[0].style.cssText = "background: rgb(189, 189, 189);"; 
  document.getElementsByClassName("left")[0].style.cssText = "background: rgb(255, 255, 255);"; 
  document.getElementById("stab").style.display = "block";
});
});

let save = document.getElementById("save");
save.addEventListener('click', event => {

    var select = document.getElementById("algorithmSelect");
    let settingsSet = {
        ac: document.getElementById('ac').checked,
        cc: document.getElementById('cc').checked,
        ca: select.value,
        im: document.getElementById('im').checked,
        pe: document.getElementById('pe').checked,
        gc: document.getElementById('gc').checked
    }
    console.log(settingsSet.ca)
    chrome.storage.sync.set({settings: settingsSet}, function() {
        console.log("saved");
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});