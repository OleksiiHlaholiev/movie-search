'use strict';

window.addEventListener('load', function (ev) {
  var searchInput = document.getElementById("search-input");
  searchInput.addEventListener('change', searchInputHandler);
});

var videoAjaxRequest = function videoAjaxRequest(endPoint, queryString) {
  var xhr = new XMLHttpRequest(),
      data = '{}',
      urlConst = 'https://api.themoviedb.org/3',
      apiKey = '?api_key=62b719d81284900a2580408f52cc3d78',
      requestUrl = ''; // An example request looks like:
  // https://api.themoviedb.org/3/configuration?api_key=62b719d81284900a2580408f52cc3d78
  // https://api.themoviedb.org/3/search/movie?api_key=62b719d81284900a2580408f52cc3d78&query=Harry%20Potter

  requestUrl = urlConst + endPoint + apiKey + queryString;
  xhr.open('GET', requestUrl, true);
  xhr.send(data);

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) return;

    if (xhr.status != 200) {
      console.log(xhr.status + ': ' + xhr.statusText);
    } else {
      // debugger;
      console.log(JSON.parse(xhr.responseText));
    }
  };
};

var searchInputHandler = function searchInputHandler(event) {
  debugger;
  var queryString = '&query=' + event.target.value + '&language=ru-RU'; // videoAjaxRequest('/search/movie', '&query=Harry Potter&language=ru-RU');

  videoAjaxRequest('/search/movie', queryString);
};