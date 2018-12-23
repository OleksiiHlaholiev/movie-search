'use strict';

// **** polyfills for IE
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
// ****************************************

const movieSearch = window.movieSearch || {
    __namespace: true
};


((__ms) => {
    const searchInput = document.getElementById('search-input'),
        searchBtn = document.getElementById('search-btn'),
        itemTemplate = document.querySelector('.search-results .item.template'),
        resultsCont = document.querySelector('.search-results .results-cont'),
        resultsTitle = document.querySelector('.search-results .results-title'),

        DESCRIPTION_SYMBOLS_QUANTITY = 200;

    let videoAjaxRequest = (endPoint, queryString) => {
        let xhr = new XMLHttpRequest(),
            data = '{}',
            urlConst = 'https://api.themoviedb.org/3',
            apiKey = '?api_key=62b719d81284900a2580408f52cc3d78',
            requestUrl = '';

        // An example request looks like:
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
                const resultObj = JSON.parse(xhr.responseText);
                console.log(resultObj);
                if (resultObj && resultObj.results) {
                    updateContent(resultObj.results);
                }
            }
        }
    };

    let updateContent = (itemsArray) => {
        if (itemsArray && itemsArray.length) {
            let tempItem,
                tempDescrStr,
                imgPathBase = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/';

            resultsCont.innerHTML = ''; // delete all nodes
            resultsTitle.innerText = 'Найденные фильмы';

            itemsArray.forEach((itemObj, i) => {
                tempItem = itemTemplate.cloneNode(true);
                tempItem.classList.remove('template');

                tempItem.setAttribute('data-video-id', itemObj.id);
                tempItem.querySelector('.name').innerText = itemObj.title;
                tempItem.querySelector('.date').innerText = itemObj.release_date;
                tempItem.querySelector('.rating').innerText = itemObj.vote_average;

                itemObj.overview.length > DESCRIPTION_SYMBOLS_QUANTITY ?
                    tempDescrStr = itemObj.overview.slice(0, DESCRIPTION_SYMBOLS_QUANTITY - 3) + '...' :
                    tempDescrStr = itemObj.overview;

                tempItem.querySelector('.description').innerText = tempDescrStr;
                tempItem.querySelector('.img-cont img.poster').setAttribute('src', imgPathBase + itemObj.poster_path);
                tempItem.querySelectorAll('.link').forEach((itemLink, i) => {
                    itemLink.setAttribute('href', '/details.html');
                });

                resultsCont.appendChild(tempItem);
            });
        } else {
            resultsTitle.innerText = 'По вашему запросу ничего не найдено';
        }
    };

    let searchInputHandler = (event) => {
        let queryString = '&query=' + searchInput.value + '&language=ru-RU';
        // videoAjaxRequest('/search/movie', '&query=Harry Potter&language=ru-RU');
        videoAjaxRequest('/search/movie', queryString);
    };

    let searchBtnHandler = (event) => {
        event.preventDefault();
        let queryString = '&query=' + searchInput.value + '&language=ru-RU';
        videoAjaxRequest('/search/movie', queryString);
    };

    let registerHandlers = () => {
        searchInput.addEventListener('change', searchInputHandler);
        searchBtn.addEventListener('click', searchBtnHandler);
    };

    document.querySelector('.search-results .item.template').remove();

    __ms.init = () => {
        registerHandlers();
    };
})(movieSearch);


