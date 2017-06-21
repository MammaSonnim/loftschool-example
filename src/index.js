var Model = require('./model');
var View = require('./view');
var Router = require('./router');
var geoObjectsMock = Model.geoObjects.list;

var reviewsMap = Model.map;

function getReview() {
    return {
        author: 'Влад',
        place: 'Чайхона',
        date: '23324244424',
        text: 'Сойдет!'
    }
}

function initMap() {
    return new Promise(function(resolve, reject) {
        ymaps.ready(function () {
            var mapCenter = [55.755381, 37.619044];
            reviewsMap = new ymaps.Map('map', {
                center: mapCenter,
                zoom: 9,
                controls: []
            });

            var clusterer = new ymaps.Clusterer({
                clusterDisableClickZoom: true,
                clusterOpenBalloonOnClick: true,
                clusterBalloonContentLayout: 'cluster#balloonCarousel',
                clusterBalloonItemContentLayout: View.renderBalloonContent(),
                clusterBalloonPanelMaxMapArea: 0,
                clusterBalloonContentLayoutWidth: 200,
                clusterBalloonContentLayoutHeight: 130,
                clusterBalloonPagerSize: 5
            });

            var a = geoObjectsMock.map(item => {
                return ymaps.geocode(item.address).then(res => {
                    var firstGeoObject = res.geoObjects.get(0);
                    return firstGeoObject.geometry.getCoordinates()
                }).then(coords => View.createPlacemarks(item.reviews, coords))
            });

            // function renderPlacemarks() {
            //     clusterer.add(View.placemarks);
            //     reviewsMap.geoObjects.add(clusterer);
            //     clusterer.balloon.open(clusterer.getClusters()[0]);
            // }

            Promise.all(a)
                .then(() => {
                        View.renderPlacemarks();
                        resolve();
                    },
                error => {

                })
        });
    });
}

new Promise(function(resolve) {
    window.onload = resolve;
})
    .then(function() {
        return initMap();
    })
    .then(function() {
        reviewsMap.events.add('click', function(e) {
            if (!reviewsMap.balloon.isOpen()) {
                var coords = e.get('coords');

                var review = getReview();

                View.renderPlacemark(review, coords);

                reviewsMap.balloon.open(coords, {
                    contentHeader: review.author,
                    contentBody:'<p>Кто-то щелкнул по карте.</p>' +
                    '<p>Координаты щелчка: ' + [
                        coords[0].toPrecision(6),
                        coords[1].toPrecision(6)
                    ].join(', ') + '</p>',
                    contentFooter:'<sup>Щелкните еще раз</sup>'
                });
            }
            else {
                reviewsMap.balloon.close();
            }
        })
    })
    // .then(function() {
    //     return Model.getUser().then(function(users) {
    //         header.innerHTML = View.renderHeader(users[0]);
    //     });
    // })
    // .then(function() {
    //     var friendsButton = document.querySelector('#friendsPage');
    //     var newsButton = document.querySelector('#newsPage');
    //
    //     friendsButton.addEventListener('click', () => Router.handle('friends'));
    //     newsButton.addEventListener('click', () => Router.handle('news'))
    // })
    .catch(function(e) {
        console.error(e);
        alert('Ошибка: ' + e.message);
    });
