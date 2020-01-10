async function updateResouce(resourceUrl, resourceName) {
    var response = await fetch(resourceUrl);
    var responseData = await response.text();
    localStorage.setItem(resourceName, responseData);
}

async function cacheLoad(resourceUrl, resourceName) {
    var resourceData = localStorage.getItem(resourceName);
    if (resourceData === null) {
        await updateResouce(resourceUrl, resourceName);
        var resourceData = JSON.parse(localStorage.getItem(resourceName));
    } else {
        updateResouce(resourceUrl, resourceName);
        var resourceData = JSON.parse(resourceData);
    }
    return resourceData;
}

function getResource(resourceName) {
    return JSON.parse(localStorage.getItem(resourceName));
}

function domainChange() {
    var domainSelector = document.getElementById("domain-selector");
    var selectedDomain = window.domainData[domainSelector.value];
    var nameSelection = document.getElementById("name-selection");
    if (selectedDomain.customizable_name) {
        nameSelection.style.display = "block";
    } else {
        nameSelection.style.display = "none";
    }

    var themeSelection = document.getElementById("theme-selection");
    if (selectedDomain.customizable_theme) {
        themeSelection.style.display = "block";
    } else {
        themeSelection.style.display = "none";
    }
}

async function submit() {
    var domainSelector = document.getElementById("domain-selector");
    var nameSelector = document.getElementById("name-selector");
    var themeSelector = document.getElementById("theme-selector");
    var emailSelector = document.getElementById("email");

    if (!emailSelector.validity.valid) {
        document.getElementById("message").innerHTML = "Invalid email";
    }

    var postHeaders = {};
    postHeaders["domain"] = domainSelector.value;
    postHeaders["email"] = emailSelector.value;
    var selectedDomain = window.domainData[domainSelector.value];
    if (selectedDomain.customizable_name) {
        postHeaders["name"] = nameSelector.value;
    }
    if (selectedDomain.customizable_theme && themeSelector.value != "random") {
        postHeaders["theme"] = themeSelector.value;
    }

    var response = await fetch("https://napoleon.jits.cc/api/v1/create", {
        headers: postHeaders
    });

    var responseData = await response.json();
    var messageElement = document.getElementById("message");
    messageElement.innerHTML = responseData["message"];
    // Once that message content has been set, show it as a Toast.
    initToast();
}

document.addEventListener("DOMContentLoaded", function () {
    (async () => {
        window.themeData = await cacheLoad("https://napoleon.jits.cc/api/v1/themes", "themeCache");
        window.domainData = await cacheLoad("https://napoleon.jits.cc/api/v1/domains", "domainCache");

        var domainSelector = document.getElementById("domain-selector");
        for (var domainName in window.domainData) {
            var opt = document.createElement("option");
            opt.value = domainName;
            opt.innerHTML = domainName;
            domainSelector.appendChild(opt);
        }
        domainChange();
        var themeSelector = document.getElementById("theme-selector");
        for (var i in window.themeData) {
            var opt = document.createElement("option");
            var val = window.themeData[i]["id"];
            opt.value = val;
            opt.innerHTML = val;
            themeSelector.appendChild(opt);
        }
        // Once that every options has been set, initialize select through materialize
        initSelect();

        document.getElementById("loading-page").style.display = "none";
        document.getElementById("actual-page").style.display = "block";
    })();
})