var map;
var clusterer;
// избавиться от замыканий coords и address
var coords;
var address;
var balloonTemplate = require('./templates/balloon.js');
var clusterItemTemplate = require('./templates/cluster-item.js');
const storage = localStorage;

// save in ls when close, not when add review
// draw reviews in open window
// fix open window bounds, maybe problem with coords

class GeoObjects {
    constructor() {
        this.list = []
    }

    addGeoObject(geoObject) {
        this.list.push(geoObject)
    }

    saveToStorage() {
        storage.geoObjects = JSON.stringify(this.list);
    }

    loadFromStorage() {
        // let objs = storage.geoObjects.split(divider)
        return JSON.parse(storage);
    }
}

var geoObjects = new GeoObjects();

class GeoObject {
    constructor(coords, address) {
        this.coords = coords;
        this.address = address;
        this.reviews = [];
    }

    addReview(review) {
        this.reviews.push(review);
    }
}

class Review {
    constructor(config) {
        this.author = config.author;
        this.place = config.place;
        this.text = config.text;
        this.date = config.date;
    }
}

function getCurrentGeoObject(address) {
    return geoObjects[address];
}

function createReview(layout) {
    let reviewConfig = getValues();

    if (!reviewConfig.text) {
        return;
    }
    // можно поменять на dataset
    let coords = layout._data.properties.coords;
    let address = layout._data.properties.address;
    let review = new Review(reviewConfig);
    let thisGeoObject = getCurrentGeoObject(address);

    if (!thisGeoObject) {
        thisGeoObject = new GeoObject(coords, address);
        thisGeoObject.addReview(review);

        geoObjects.addGeoObject(thisGeoObject);
        geoObjects.saveToStorage()
    } else {
        thisGeoObject.reviews.push(review);
    }

    createPlacemark(review, coords, address);
}

function getContentLayout() {
    var contentLayout = ymaps.templateLayoutFactory.createClass(balloonTemplate, {
        build: function () {
            contentLayout.superclass.build.call(this);
            const submit = document.querySelector('#submit');
            submit.addEventListener('click', this.submitClickHandler.bind(this));
        },
        clear: function () {
            const submit = document.querySelector('#submit');
            submit.removeEventListener('click', this.submitClickHandler.bind(this));
            contentLayout.superclass.clear.call(this);
        },

        submitClickHandler: function (e) {
            e.preventDefault();
            createReview(this);
        }
    });

    return contentLayout;
}

function createPlacemark(review, coords, address) {
    var placemark = new ymaps.Placemark(coords, {
        address: address,
        author: review.author,
        place: review.place,
        text: review.text,
        date: review.date
    });

    clusterer.add(placemark);
}

function getValues() {
    const formNode = document.querySelector('#form');
    const nameInputNode = formNode.querySelector('#name');
    const placeInputNode = formNode.querySelector('#place');
    const textInputNode = formNode.querySelector('#text');

    return {
        author: nameInputNode.value || 'Неопознанный енот',
        place: placeInputNode.value || 'Здесь',
        text: textInputNode.value || 'Временно',
        date: new Date()
    };
}

// address — замыкание?
function openBalloon() {
    return map.balloon.open(coords, {
        properties: {
            coords: coords,
            address: address
        }
    }, {
        contentLayout: getContentLayout()
    })
}

function addBalloon(coords) {
    ymaps.geocode(coords)
        .then((res) => {
            var firstGeoObject = res.geoObjects.get(0);
            address = firstGeoObject.getAddressLine();

            return address;
        })
        .then(address => {
            return map.balloon.open(coords, {
                properties: {
                    coords: coords,
                    address: address
                }
            }, {
                contentLayout: getContentLayout()
            });
        })
}

function mapClickHandler(e) {
    coords = e.get('coords');
    addBalloon(coords);
}

function addClusterer() {
    var renderClusterItem = ymaps.templateLayoutFactory.createClass(clusterItemTemplate, {
        // детали здесь https://tech.yandex.ru/maps/jsbox/2.1/placemark_balloon_layout
        build: function () {
            renderClusterItem.superclass.build.call(this);

            const link = document.querySelector('.address');
            link.addEventListener('click', this.linkClickHandler);
        },
        clear: function () {
            const link = document.querySelector('.address');
            link.removeEventListener('click', this.linkClickHandler);
            renderClusterItem.superclass.clear.call(this);
        },

        linkClickHandler: function (e) {
            e.preventDefault();

            openBalloon();
        }

    });

    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: renderClusterItem,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 5,
        geoObjectBalloonContentLayout: getContentLayout(),
        // geoObjectBalloonPanelMaxMapArea: 0

    });

    map.geoObjects.add(clusterer);
}

function initMap() {
    ymaps.ready(function () {
        var mapCenter = [55.755381, 37.619044];
        let savedGeoObjects = storage.geoObjects;

        map = new ymaps.Map('map', {
            center: mapCenter,
            zoom: 9,
            controls: []
        });

        map.events.add('click', function (e) {
            mapClickHandler(e);
        });

        addClusterer();

        if (savedGeoObjects) {
            var saved = JSON.parse(savedGeoObjects);
            debugger

            saved.forEach(geoObject => {
                geoObject.reviews.forEach(review => {
                    createPlacemark(review, geoObject.coords, geoObject.address)
                })
            })
        }
    });
}

new Promise(function (resolve) {
    window.onload = resolve;
})
    .then(function () {
        return initMap();
    })
    .catch(function (e) {
        console.error(e);
        alert('Ошибка: ' + e.message);
    });
