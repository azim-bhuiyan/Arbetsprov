// some global variable
var title = new Array();
var suggestion, searchString;

window.onload = function() {
    // load public API on document load
    getAPI();
};

function getAPI() {
    // get request for REST API
    var request = new XMLHttpRequest();

    request.open('GET', 'https://api.publicapis.org/entries?category=games&https=true', true);
    request.onload = function () {
      var data = JSON.parse(this.response);
      if (request.status >= 200 && request.status < 400) {
        title = parseResponse(data, title);
      } else {
        console.log('error');
      }
    };
    request.send();
}

function parseResponse(data, title) {
    // populate data for search from API response
    var i;
    for(i = 0; i < data.count; i++) {
        title.push(data.entries[i].API);
    }
    return title;
}

function prepareForType(searchbar) {
    // cosmetic modification for searchbar while prepared for typing
    searchbar.style.backgroundColor = "rgb(181,190,201)";
}

function showResult(typedString) {
    // display partial search result
    var searchSuggestionDiv = document.getElementById("search-suggestion");
    var i;

    // capitalize typed string to match the data
    searchString = typedString.charAt(0).toUpperCase() + typedString.slice(1);

    // set default values
    suggestion = null;
    searchSuggestionDiv.innerHTML = "";
    searchSuggestionDiv.style.border = "0px";

    for(i = 0; i < title.length; i++) {
        if(searchString === "") {
            // set to default while typed string is removed, i.e. backspace
            suggestion = null;
        } else if(title[i].startsWith(searchString)) {
            if(suggestion === null) {
                // first suggestion in the list
                suggestion = "<p onclick='changeValue(this.innerHTML)'>" + title[i] + "</p>";
            } else {
                suggestion = suggestion + "<p onclick='changeValue(this.innerHTML)'>" + title[i] + "</p>";
            }
        }
    }

    appendSuggestion(searchSuggestionDiv);
}

function appendSuggestion (searchSuggestionDiv) {
    // displaying search suggestion
    if(suggestion === null) {
        searchSuggestionDiv.style.padding = "0px";
    } else {
        searchSuggestionDiv.innerHTML = suggestion;
        searchSuggestionDiv.style.padding = "5px";
    }
}

function changeValue(clickedResult) {
    // cahnge search bar value and typedString to the clicked suggestion
    var searchbar = document.getElementById('search-bar');
    var searchSuggestionDiv = document.getElementById("search-suggestion");

    searchString = clickedResult;
    searchbar.value = clickedResult;
    searchbar.focus();

    // set default value for the partial suggestion
    searchSuggestionDiv.innerHTML = "";
    searchSuggestionDiv.style.border = "0px";
    searchSuggestionDiv.style.padding = "0px";
}

function pressedEnter(event) {
    // detect [ENTER] press
    if(event.keyCode === 13) {
        // catch the time of the [ENTER] press
        var timestamp = new Date();
        timestamp = processTime(timestamp);
        saveSearch(timestamp);
        searchBarSetDefault();
    }
}

function processTime(timestamp) {
    // process catched time to preferable format
    var year, month, date, hours, minutes;

    // date format
    year = timestamp.getFullYear();
    month = timestamp.getMonth();
    date = timestamp.getDate();

    // time format
    hours = timestamp.getHours();
    minutes = timestamp.getMinutes();

    timestamp = year + "-" + (month + 1) + "-" + date + " " + hours + ":" + minutes;
    return timestamp;
}

function saveSearch(timestamp) {
    // check for accidental [ENTER] press
    if(searchString != null && searchString != "") {
        var pNode, emNodeRightAlign, textNode, textNodeRight, savedSearchDiv;

        // prepare HTML nodes to save
        pNode = document.createElement("P");
        emNodeRightAlign = document.createElement("EM");
        textNode = document.createTextNode(searchString);
        textNodeRight = document.createTextNode(timestamp);

        savedSearchDiv = document.getElementById("saved-search");

        pNode.appendChild(textNode);
        emNodeRightAlign.appendChild(textNodeRight);
        pNode.appendChild(emNodeRightAlign);

        // append HTML nodes to the placeholder
        savedSearchDiv.appendChild(pNode);

        styleSavedSearchDiv(savedSearchDiv, emNodeRightAlign);
    }
}

function styleSavedSearchDiv(savedSearchDiv, emNodeRightAlign) {
    // style the saved search DIV accordingly
    savedSearchDiv.style.padding = "30px";
    savedSearchDiv.style.paddingLeft = "10%";
    savedSearchDiv.style.paddingRight = "10%";

    // style for align timestamp to the right
    emNodeRightAlign.style.fontStyle = "normal";
    emNodeRightAlign.style.float = "right";
}

function searchBarSetDefault() {
    // set default vaule for searchbar upon [ENTER] press to prepare for the next search
    var searchbar = document.getElementById("search-bar");
    searchbar.value = "";
}