chrome.tabs.onUpdated.addListener(function(tabId, info) {
    if (info.status === 'complete') {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            var tab = tabs[0];
            var url = tab.url;
            if (url.indexOf("managebac") > -1) {

                var settings;
                chrome.storage.sync.get(['settings'], function(result) {
                    settings = result.settings;
                    if (settings == undefined) {
                        settings = {
                            ac: true,
                            cc: true,
                            ca: "pw"
                        };
                    }

                    if (url.indexOf("assignments") > -1 || url.indexOf("core") > -1 || url.indexOf("tasks") > -1) {
                        chrome.tabs.executeScript(null, {
                            file: "./resources/jquery-3.4.1.js"
                        });
                        if (settings.ca == "pw") {
                            chrome.tabs.executeScript(null, {
                                file: "content.js"
                            });
                        } else if (settings.ca == "pba") {
                            chrome.tabs.executeScript(null, {
                                file: "contentPoints.js"
                            });
                        }
                        if (settings.cc) {
                            chrome.tabs.executeScript(null, {
                                file: "pickColor.js"
                            });
                        }
                    } else if (url.indexOf("student") > -1) {
                        chrome.tabs.executeScript(null, {
                            file: "./resources/jquery-3.4.1.js"
                        });
                        chrome.tabs.executeScript(null, {
                            file: "student.js"
                        });
                    }
                });

            }
        });
    }
});
