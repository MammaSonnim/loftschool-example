let map;
let clusterer;
let GeoObjects = require('./createClasses.js').GeoObjects;
let geoObjects = new GeoObjects();
let GeoObject = require('./createClasses.js').GeoObject;
let Review = require('./createClasses.js').Review;
let getClusterLayout = require('./getLayouts.js').getClusterLayout;
let getContentLayout = require('./getLayouts.js').getContentLayout;

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

    createPlacemark(review, coords, address);

    if (data.coords) {
        let updatedData = {};
        updatedData.properties = thisGeoObject;
        map.balloon.setData(updatedData);
    }
}

function closeBalloon() {
    map.balloon.close();
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

    // т.к. если использовать родной balloon, при добавлении в clusterer, он будет уничтожаться вместе с placemark
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

function initMap() {
    ymaps.ready(function () {
        const mapCenter = [55.755381, 37.619044];

        map = new ymaps.Map('map', {
            center: mapCenter,
            zoom: 9,
            controls: []
        });

        map.events.add('click', function (e) {
            let coords = e.get('coords');

            if (map.balloon.isOpen()) {
                map.balloon.close()
            } else {
                addBalloonWithoutGeoObject(coords);
            }
        });

        addClusterer();
        createPlacemarks();

        // вместо события можно переопределить метод close
        map.balloon.events.add('close', () => {
            const dataInBalloon = map.balloon.getData();

            // при очистки темлпейта сохраняем данные если отзывы есть (пока и старые и новые)
            if (dataInBalloon.properties.reviews.length) {
                geoObjects.saveToStorage();
            }
        });
    });
}

new Promise(resolve => window.onload = resolve)
    .then(() => initMap())
    .catch(e => {
        console.error(e);
        alert('Ошибка: ' + e.message);
    });


module.exports = {
    createReview: createReview,
    closeBalloon: closeBalloon,
    openBalloon: openBalloon,
    geoObjects: geoObjects
};