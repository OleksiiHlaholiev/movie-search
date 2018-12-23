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

        DESCRIPTION_SYMBOLS_QUANTITY = 200,
        MOBILE_WIDTH = 500,
        MIN_SEARCH_QUERY_LENGTH = 3,
        TIME_PROTECTION_MS = 2000,
        URL_API_BASE = 'https://api.themoviedb.org/3',
        API_KEY = '?api_key=62b719d81284900a2580408f52cc3d78',
        IMG_W185_H278_PATH_BASE = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/',
        IMG_W350_H196_PATH_BASE = 'https://image.tmdb.org/t/p/w350_and_h196_bestv2/';

    let videoAjaxRequest = (endPoint, queryString, successCallback) => {
        let xhr = new XMLHttpRequest(),
            data = '{}',
            requestUrl;

        // An example request looks like:
        // https://api.themoviedb.org/3/configuration?api_key=62b719d81284900a2580408f52cc3d78
        // https://api.themoviedb.org/3/search/movie?api_key=62b719d81284900a2580408f52cc3d78&query=Harry%20Potter

        requestUrl = URL_API_BASE + endPoint + API_KEY + queryString;
        xhr.open('GET', requestUrl, true);
        xhr.send(data);

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                console.log(xhr.status + ': ' + xhr.statusText);
            } else {
                const resultObj = JSON.parse(xhr.responseText);
                console.log(resultObj);

                if (successCallback != undefined) {
                    successCallback(resultObj);
                }
            }
        }
    };

    let monthDecoder = (monthNumber) => {
        var monthNamesArr = [
                'января',
                'февраля',
                'марта',
                'апреля',
                'мая',
                'июня',
                'июля',
                'августа',
                'сентября',
                'октября',
                'ноября',
                'декабря'
            ];

        return monthNamesArr[monthNumber] ? monthNamesArr[monthNumber] : '';
    };

    let updateContent = (itemsArray) => {
        resultsCont.innerHTML = ''; // delete all nodes
        if (itemsArray && itemsArray.length) {
            let tempItem,
                tempDescrStr,
                tempDate,
                tempDateStr,
                currentImgBase;

            resultsTitle.innerText = 'Найденные фильмы';

            itemsArray.forEach((itemObj, i) => {
                tempItem = itemTemplate.cloneNode(true);
                tempItem.classList.remove('template');

                tempItem.setAttribute('data-video-id', itemObj.id);
                tempItem.querySelector('.name').innerText = itemObj.title;

                tempDate = new Date(itemObj.release_date);
                (tempDate != 'Invalid Date') ?
                    tempDateStr = tempDate.getDate() + ' ' + monthDecoder(tempDate.getMonth()) + ' ' + tempDate.getFullYear() :
                    tempDateStr = itemObj.release_date;

                tempItem.querySelector('.date').innerText = tempDateStr;
                tempItem.querySelector('.rating').innerText = itemObj.vote_average;

                itemObj.overview.length > DESCRIPTION_SYMBOLS_QUANTITY ?
                    tempDescrStr = itemObj.overview.slice(0, DESCRIPTION_SYMBOLS_QUANTITY - 3) + '...' :
                    tempDescrStr = itemObj.overview;

                tempItem.querySelector('.description').innerText = tempDescrStr;

                window.innerWidth > MOBILE_WIDTH ?
                    currentImgBase = IMG_W185_H278_PATH_BASE:
                    currentImgBase = IMG_W350_H196_PATH_BASE;

                tempItem.querySelector('.img-cont img.poster').setAttribute('src', currentImgBase + itemObj.poster_path);
                tempItem.querySelectorAll('.link').forEach((itemLink, i) => {
                    itemLink.setAttribute('href', '/details.html');
                });

                resultsCont.appendChild(tempItem);
            });
        } else {
            resultsTitle.innerText = 'По вашему запросу ничего не найдено';
        }
    };

    let updateContentCallback = (resultObj) => {
        if (resultObj && resultObj.results) {
            updateContent(resultObj.results);
        }
    };

    let searchVideoRequest = () => {
        if (searchInput.value.length >= MIN_SEARCH_QUERY_LENGTH) {
            let queryString = '&query=' + searchInput.value + '&language=ru-RU';
            videoAjaxRequest('/search/movie', queryString, updateContentCallback);
        }
    };

    let searchInputHandler = (event) => {
        searchVideoRequest();
    };

    let searchBtnHandler = (event) => {
        event.preventDefault();
        searchVideoRequest();
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


