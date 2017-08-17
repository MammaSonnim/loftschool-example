// save in ls when close, not when add review - done
// save right structure - done
// draw geoObjects on init - done
// save diff geoObjects - done
// get rid of closures - done
// use let / const instead of vars - done
// draw reviews in open window - done
// close when click on close - done
// draw review when submit - done
// render reviews when open single placemark - done
// problem with getData on balloon - done
// fix open window bounds, maybe problem with coords (clear ls) - done
// make pp-layout - done

// save in ls when close in any way, save if only there is content

// add ids instead address counter
// keep date in one format
// create modules
// export trouble
// make templates not js
// Object.entries() instead of for-in
// save data to dataset - realy?
let map;
let clusterer;
const balloonTemplate = require('./templates/balloon.js');
const clusterItemTemplate = require('./templates/cluster-item.js');
const storage = localStorage;

let id = 0;

class GeoObjects {
    constructor() {
        this.list = {};
        this.loadFromStorage();
    }

    addGeoObject(geoObject, address) {
        this.list[address] = geoObject;
        // id++;
    }

    saveToStorage() {
        storage.geoObjects = JSON.stringify(this.list);
    }

    loadFromStorage() {
        let saved = storage.geoObjects;

        if (saved) {
            this.list = JSON.parse(saved);
        }
    }
}

let geoObjects = new GeoObjects();

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
    return geoObjects.list[address];
}

function createReview() {
    let reviewConfig = getValues();

    if (!reviewConfig.text) {
        return;
    }

    let balloonData = map.balloon.getData();
    let data = balloonData.properties;
    let coords = data.coords;
    let address = data.address;
    let review = new Review(reviewConfig);
    let thisGeoObject = getCurrentGeoObject(address);

    if (!thisGeoObject) {
        thisGeoObject = new GeoObject(coords, address);
        thisGeoObject.addReview(review);

        geoObjects.addGeoObject(thisGeoObject, address);

    } else {
        thisGeoObject.reviews.push(review);
    }
    let updatedData = {};
    updatedData.properties = thisGeoObject;
    createPlacemark(review, coords, address);

    if (data.coords) {
        map.balloon.setData(updatedData);
    }
}

function getContentLayout() {
    const contentLayout = ymaps.templateLayoutFactory.createClass(balloonTemplate, {
        build: function () {
            contentLayout.superclass.build.call(this);
            
            const submit = document.querySelector('#submit');
            const close = document.querySelector('#close');
            
            submit.addEventListener('click', this.submitClickHandler.bind(this));
            close.addEventListener('click', this.closeClickHandler.bind(this));

            // вместо события можно переопределить метод close, перенести в init
            map.balloon.events.add('close', () => {
                const dataInBalloon = this.getData();

                // при очистки темлпейта сохраняем данные если отзывы есть (пока и старые и новые)
                if (dataInBalloon.properties.reviews.length) {
                    geoObjects.saveToStorage();
                }
            });
        },
        clear: function () {
            const submit = document.querySelector('#submit');
            const close = document.querySelector('#close');

            submit.removeEventListener('click', this.submitClickHandler.bind(this));
            close.removeEventListener('click', this.closeClickHandler.bind(this));
        },

        submitClickHandler: function (e) {
            e.preventDefault();
            createReview();
        },
        closeClickHandler: function (e) {
            e.preventDefault();
            map.balloon.close();
        }
    });

    return contentLayout;
}

function createPlacemark(review, coords, address) {
    const placemark = new ymaps.Placemark(coords, {
        coords: coords,
        address: address,
        review: {
            author: review.author,
            place: review.place,
            text: review.text,
            date: review.date,
        },
    }, {
        // отключаем родной balloon, чтобы показывать map.balloon
        hasBalloon: false
    });

    placemark.events.add('click', function () {
        openBalloon(coords, address, geoObjects.list[address].reviews);
    });

    // т.е. если использовать родной balloon, при добавлении в clusterer, он будет уничтожаться вместе с placemark
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

function openBalloon(coords, address, reviews='') {
    return map.balloon.open(coords, {
        properties: {
            coords: coords,
            address: address,
            reviews: reviews
        }
    }, {
        layout: getContentLayout()
    })
}

function addBalloonWithoutGeoObject(coords) {
    ymaps.geocode(coords)
        .then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            return firstGeoObject.getAddressLine();
        })
        .then(address => {
            openBalloon(coords, address)
        })
}

function getClusterLayout() {
    const renderClusterItem = ymaps.templateLayoutFactory.createClass(clusterItemTemplate, {
        // детали здесь https://tech.yandex.ru/maps/jsbox/2.1/placemark_balloon_layout
        build: function () {
            renderClusterItem.superclass.build.call(this);

            const link = document.querySelector('#address');
            link.addEventListener('click', this.linkClickHandler.bind(this));
        },
        clear: function () {
            const link = document.querySelector('#address');
            link.removeEventListener('click', this.linkClickHandler.bind(this));

            renderClusterItem.superclass.clear.call(this);
        },

        linkClickHandler: function (e) {
            e.preventDefault();
            // заменить дата на getClustererData
            const data = this._data.properties._data;
            openBalloon(data.coords, data.address, geoObjects.list[data.address].reviews);
        }

    });

    return renderClusterItem;
}

function addClusterer() {
    clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: getClusterLayout(),
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 5,
        geoObjectBalloonContentLayout: getContentLayout()
    });

    map.geoObjects.add(clusterer);
}

function createPlacemarks() {
    const list = geoObjects.list;

    if (Object.keys(list).length !== 0 && list.constructor === Object) {
        for (let prop in list) {
            if (list.hasOwnProperty(prop)) {
                const geoObject = list[prop];

                geoObject.reviews.forEach(review => {
                    createPlacemark(review, geoObject.coords, geoObject.address)
                })
            }
        }
    }

}

function mapClickHandler(e) {
    let coords = e.get('coords');

    if (map.balloon.isOpen()) {
        map.balloon.close()
    } else {
        addBalloonWithoutGeoObject(coords);
    }
}

function initMap() {
    debugger
    ymaps.ready(function () {
        const mapCenter = [55.755381, 37.619044];

        map = new ymaps.Map('map', {
            center: mapCenter,
            zoom: 9,
            controls: []
        });

        map.events.add('click', function (e) {
            mapClickHandler(e);
        });

        addClusterer();
        createPlacemarks();
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