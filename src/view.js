var geoObjectTemplate = require('./templates/geo-object.hbs');
var reviewsTemplate = require('./templates/reviews.hbs');
var reviewTemplate = require('./templates/review.hbs');
var balloonContentTemplate = require('./templates/balloon-content.js');
var mapNode;
var closeBtnNode;
var submitBtnNode;

module.exports = {
    placemarks: [],
    map: null,
    renderReview(data) {
        return reviewTemplate(data);
    },
    renderReviews(data) {
        return reviewsTemplate(data);
    },
    renderGeoObject(data) {
        return geoObjectTemplate(data);
    },
    renderBalloonContent(data) {
      return balloonContentTemplate(data);
    },
    renderCarousel(data) {

    },
    renderPlacemark(review, coords) {
        return new ymaps.Placemark(coords, {
            balloonContentHeader: review.place,
            balloonContentBody: review.text,
            balloonContentFooter:  review.date
        });
    },
    createPlacemarks(reviews, coords) {
        var placemark;

        reviews.forEach(review => {
            placemark = this.renderPlacemark(review, coords);

            this.placemarks.push(placemark);
        });
    },
    renderPlacemarks() {
        console.dir(clusterer.add)
        clusterer.add(this.placemarks);
        this.map.geoObjects.add(clusterer);
        clusterer.balloon.open(clusterer.getClusters()[0]);
    },
    renderMap(data) {

    },

    mapClickHandler(e) {

    },
    closeBtnClickHandler(e) {
        e.preventDefault();
    },
    submitBtnClickHandler(e) {
        e.preventDefault();

        var a = document.querySelector()
    }
};
