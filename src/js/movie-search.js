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
        pagination = document.querySelector('.pagination'),
        pageItemTemplate = document.querySelector('.pagination .page-item.template'),

        PAGINATION_ITEMS_PER_PAGE = 20,
        DESCRIPTION_SYMBOLS_QUANTITY = 200,
        MOBILE_WIDTH = 500,
        MIN_SEARCH_QUERY_LENGTH = 1,
        TIME_PROTECTION_MS = 1000,
        URL_API_BASE = 'https://api.themoviedb.org/3',
        API_KEY = '?api_key=62b719d81284900a2580408f52cc3d78',
        IMG_W185_H278_PATH_BASE = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/',
        IMG_W350_H196_PATH_BASE = 'https://image.tmdb.org/t/p/w350_and_h196_bestv2/',
        IMG_W300_H450_PATH_BASE = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/';

    let timerProtectionId,
        isBusyFlag = false;

    // -------------------------------- START --------------------------------------

    const timerStop = () => {
        isBusyFlag = false;
        clearTimeout(timerProtectionId);
    };

    const timerStart = (successCallback) => {
        isBusyFlag = true;
        timerProtectionId = setTimeout(() => {
            timerStop();
            successCallback();
        }, TIME_PROTECTION_MS);
    };

    const videoAjaxRequest = (endPoint, queryString, successCallback) => {
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

    const getMovieByIdRequest = (videoId, successCallback) => {
        // https://api.themoviedb.org/3/movie/8467?api_key=62b719d81284900a2580408f52cc3d78&language=ru-RU
        if (videoId) {
            let queryString = '&language=ru-RU';
            videoAjaxRequest('/movie/' + videoId, queryString, successCallback);
        }
    };

    const monthDecoder = (monthNumber) => {
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

    const updateContent = (itemsArray) => {
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
                tempItem.querySelector('.rating').innerText = 'Рейтинг: ' + itemObj.vote_average;

                itemObj.overview.length > DESCRIPTION_SYMBOLS_QUANTITY ?
                    tempDescrStr = itemObj.overview.slice(0, DESCRIPTION_SYMBOLS_QUANTITY - 3) + '...' :
                    tempDescrStr = itemObj.overview;

                tempItem.querySelector('.description').innerText = tempDescrStr;

                window.innerWidth > MOBILE_WIDTH ?
                    currentImgBase = IMG_W185_H278_PATH_BASE :
                    currentImgBase = IMG_W350_H196_PATH_BASE;

                tempItem.querySelector('.img-cont img.poster').setAttribute('src', currentImgBase + itemObj.poster_path);
                tempItem.querySelectorAll('.link').forEach((itemLink, i) => {
                    itemLink.setAttribute('href', window.location.href + 'details.html?id=' + itemObj.id);
                });

                resultsCont.appendChild(tempItem);
            });
        } else {
            resultsTitle.innerText = 'По вашему запросу ничего не найдено';
        }
    };

    const updateContentCallback = (resultObj) => {
        if (resultObj && resultObj.results) {
            updateContent(resultObj.results);
            updatePagination(resultObj.total_pages, resultObj.page, PAGINATION_ITEMS_PER_PAGE);
        }
    };

    const paginationBtnHandler = (event) => {
        if (!event.currentTarget.classList.contains("disabled") &&
            !event.currentTarget.classList.contains("active"))
        {
            let prevActiveItem = document.querySelector(".page-item.active"),
                page;

            prevActiveItem.classList.remove("active");
            event.currentTarget.classList.add("active");
            page = event.currentTarget.getAttribute('data-page');

            searchVideoRequest(page);
            document.querySelector('.movie-search-section').scrollIntoView(true);
        }
    };

    const addPaginationBtn = (value, activeCurrentIndex) => {
        var tempPaginationBtn = pageItemTemplate.cloneNode(true);

        if (tempPaginationBtn.classList.contains("active") &&
            value != activeCurrentIndex
        ) {
            tempPaginationBtn.classList.remove("active");
        }

        tempPaginationBtn.setAttribute('data-page', value);
        tempPaginationBtn.querySelector('.page-link').innerText = value;
        tempPaginationBtn.classList.remove('template');
        tempPaginationBtn.addEventListener('click', paginationBtnHandler);

        pagination.insertBefore(tempPaginationBtn, pagination.lastElementChild)
    };

    // additional fucntion: used to add several items
    const updatePagination = (totalPages, pageNumber, itemsPerPage) => {
        let i;
        removePagination();
        pagination.classList.add('active');

        if (totalPages) {
            for (i = 1; i <= totalPages; i++) {
                addPaginationBtn(i, pageNumber);
            }
        }

        // for (i = pageNumber * itemsPerPage; i < pageNumber * itemsPerPage + itemsPerPage; i++) {
        //     addItem(videoArr[i]);
        // }
    };

    const removePagination = () => {
        let currentPaginationItems = document.querySelectorAll('.pagination .page-item:not(.spec)');
        pagination.classList.remove('active');
        if (currentPaginationItems.length) {
            currentPaginationItems.forEach((item, i) => {
                item.remove();
            })
        }
    };

    const searchVideoRequest = (page) => {
        if (searchInput.value.length >= MIN_SEARCH_QUERY_LENGTH && !isBusyFlag && page) {
            timerStart(() => {
                let queryString = '&query=' + searchInput.value + '&language=ru-RU&page=' + page;
                videoAjaxRequest('/search/movie', queryString, updateContentCallback);
            });
        }
    };

    const searchInputHandler = (event) => {
        searchVideoRequest(1);
    };

    const searchBtnHandler = (event) => {
        event.preventDefault();
        searchVideoRequest(1);
    };

    const registerHandlers = () => {
        searchInput.addEventListener('input', searchInputHandler);
        searchBtn.addEventListener('click', searchBtnHandler);
    };

    if (searchInput && searchBtn && itemTemplate && resultsCont && resultsTitle) {
        document.querySelector('.search-results .item.template').remove();
        document.querySelector('.pagination .page-item.template').remove();
    }


    // -------------------------------- INTERFACE --------------------------------------
    __ms.init = () => {
        registerHandlers();
    };

    __ms.getMovieById = getMovieByIdRequest;
    __ms.monthDecoder = monthDecoder;

    // -------------------------------- END --------------------------------------
})(movieSearch);


