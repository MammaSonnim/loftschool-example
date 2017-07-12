var model = require('./model');
var view = require('./view');
var geoObjectsMock = model.geoObjects.list;

module.exports = {
    placemarks: [],
    map: null,
    clusterer: null,
    currentCoords: null,

    addClusterer: function () {
        this.clusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterOpenBalloonOnClick: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: view.renderClusterItem(),
            // clusterBalloonItemContentLayout: 'map#renderClusterItem',
            clusterBalloonPanelMaxMapArea: 0,
            clusterBalloonContentLayoutWidth: 200,
            clusterBalloonContentLayoutHeight: 130,
            clusterBalloonPagerSize: 5,
            geoObjectBalloonContentLayout: view.renderGeoObject
        });

        // ymaps.layout.storage.add('map#renderClusterItem', renderClusterItem);

        this.map.geoObjects.add(this.clusterer);
    },
    addGeoObject(address) {
        var geoObjectData = new model.GeoObject(address);
        model.geoObjects.add(geoObjectData);

    },

    addReview(review) {
        view.renderReview(review);
    },

    createPlacemark(review, coords) {
        // var BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
        //     'ballon content!' +
        //     '<form action="" class="geo-object__form form" id="form">' +
        //     '<input type="text" class="form__field field field_name" id="name">' +
        //     '<input type="text" class="form__field field field_location" id="place">' +
        //     '<textarea name="" cols="30" rows="10" class="form__field field field_text" id="text"></textarea>' +
        //     '<button type="submit" class="form__btn btn"></button>' +
        //     '</form>'
        //     );

        return new ymaps.Placemark(coords, {
            author: review.author,
            place: review.place,
            text: review.text,
            date:  review.date
        }, {
            // balloonContentLayout: BalloonContentLayout,
            balloonPanelMaxMapArea: 0
        });
    },
    // addPlacemark(placemark) {
    //   this.clusterer.add(placemark)
    // },
    createPlacemarks(reviews, coords) {
        var placemark;

        reviews.forEach(review => {
            placemark = this.createPlacemark(review, coords);
            this.placemarks.push(placemark);
        });
    },
    addPlacemarks(clusterer) {
        clusterer.add(this.placemarks);
        clusterer.balloon.open(clusterer.getClusters()[0]);
    },
    initMap() {
        var that = this;

        return new Promise(function(resolve, reject) {
            ymaps.ready(function () {
                var mapCenter = [55.755381, 37.619044];
                var renderClusterItem = ymaps.templateLayoutFactory.createClass(
                    '<h2 class="piu">{{ properties.address|raw }} gfffbe!</h2>'
                );

                that.map = new ymaps.Map('map', {
                    center: mapCenter,
                    zoom: 9,
                    controls: []
                });

                var createAllPlacemarksFromGeoObjects = geoObjectsMock.map(item => {
                    return ymaps.geocode(item.address).then(res => {
                        var firstGeoObject = res.geoObjects.get(0);

                        return firstGeoObject.geometry.getCoordinates()
                    }).then(coords => that.createPlacemarks(item.reviews, coords))
                });

                that.addClusterer();

                Promise.all(createAllPlacemarksFromGeoObjects)
                .then(() => {
                    that.addPlacemarks(that.clusterer);
                    resolve();
                });

                that.map.events.add('click', function(e) {
                    that.mapClickHandler(e);
                })

            });
        });
    },
    mapClickHandler(e) {
            var coords = e.get('coords');
            this.currentCoords = coords;

            ymaps.geocode(coords)
                .then((res) => {
                    var firstGeoObject = res.geoObjects.get(0);
                    return firstGeoObject.getAddressLine();
                })
                .then(address => {
                    var contentLayout = ymaps.templateLayoutFactory.createClass(
                        '<form action="" class="geo-object__form form" id="form">' +
                        '<input type="text" class="form__field field field_name" id="name">' +
                        '<input type="text" class="form__field field field_location" id="place">' +
                        '<textarea name="" cols="30" rows="10" class="form__field field field_text" id="text"></textarea>' +
                        '<button type="submit" class="form__btn btn"></button>' +
                        '</form>'
                    );

                    return this.map.balloon.open(coords, {

                    }, {
                        contentLayout: contentLayout
                    });
                })
                .then((res) => {
                    console.log(res);
                })
                .then(() => {
                    var form = document.querySelector('#form');
                    var submit = form.querySelector('#submit');
                    submit.addEventListener('click', this.submitBtnClickHandler.bind(this));
                })

    },
    closeBtnClickHandler(e) {
        e.preventDefault();
    },
    submitBtnClickHandler(e) {
        e.preventDefault();
        // получение конфиг из инпутов
        var reviewConfig = view.getValues();
        // создание нового объекта для отзыва
        var review = new model.GeoObject().getReview(reviewConfig);
        var placemark = this.createPlacemark(review, this.currentCoords);
        this.clusterer.add(placemark);
    }
};


// model.review.save(form.getValue())