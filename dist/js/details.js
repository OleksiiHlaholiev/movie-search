'use strict';

var detailInfo = window.detailInfo || {
  __namespace: true
};

(function (__di) {
  var itemTemplate = document.querySelector('.search-results .item.template'),
      resultsCont = document.querySelector('.search-results .results-cont'),
      resultsTitle = document.querySelector('.search-results .results-title'),
      videoId = window.location.search.split("id=")[1],
      IMG_W185_H278_PATH_BASE = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/',
      IMG_W350_H196_PATH_BASE = 'https://image.tmdb.org/t/p/w350_and_h196_bestv2/',
      IMG_W300_H450_PATH_BASE = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/'; // -------------------------------- START --------------------------------------

  var updateContent = function updateContent(itemObj) {
    debugger;
    resultsCont.innerHTML = ''; // delete all nodes

    if (itemObj) {
      var tempItem, tempDate, tempDateStr, currentImgBase;
      resultsTitle.innerText = 'Найденные фильмы';
      tempItem = itemTemplate.cloneNode(true);
      tempItem.classList.remove('template');
      tempItem.setAttribute('data-video-id', itemObj.id);
      tempItem.querySelector('.name').innerText = itemObj.title;
      tempDate = new Date(itemObj.release_date);
      tempDate != 'Invalid Date' ? tempDateStr = tempDate.getDate() + ' ' + monthDecoder(tempDate.getMonth()) + ' ' + tempDate.getFullYear() : tempDateStr = itemObj.release_date;
      tempItem.querySelector('.date').innerText = tempDateStr;
      tempItem.querySelector('.rating').innerText = 'Рейтинг: ' + itemObj.vote_average;
      tempItem.querySelector('.description').innerText = itemObj.overview;
      window.innerWidth > MOBILE_WIDTH ? currentImgBase = IMG_W185_H278_PATH_BASE : currentImgBase = IMG_W350_H196_PATH_BASE;
      tempItem.querySelector('.img-cont img.poster').setAttribute('src', currentImgBase + itemObj.poster_path);
      tempItem.querySelectorAll('.link').forEach(function (itemLink, i) {
        itemLink.setAttribute('href', '/details.html');
      });
      resultsCont.appendChild(tempItem);
    } else {
      resultsTitle.innerText = 'По вашему запросу ничего не найдено';
    }
  }; // document.querySelector('.search-results .item.template').remove();


  __di.init = function () {// registerHandlers();
  };

  movieSearch.getMovieById(videoId, updateContent); // -------------------------------- END --------------------------------------
})(detailInfo);

window.addEventListener('load', function () {// debugger;
});