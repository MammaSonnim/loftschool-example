var geoObjectTemplate = require('./templates/geo-object.js');
var reviewsTemplate = require('./templates/reviews.hbs');
var reviewTemplate = require('./templates/review.hbs');
var clusterItemTemplate = require('./templates/cluster-item.js');
// var balloonContentTemplate = require('./templates/balloon-content.js');
var mapNode;
var closeBtnNode;
var submitBtnNode;
var now = Date.now();

module.exports = {
    placemarks: [],
    renderReview(data) {
        return reviewTemplate(data);
    },
    renderReviews(data) {
        return reviewsTemplate(data);
    },
    renderGeoObject(data) {
        return geoObjectTemplate(data);
    },
    renderClusterItem(data) {
        return ymaps.templateLayoutFactory.createClass(
            '<h2 class="piu">{{ properties.address|raw }} ура!</h2>'
        )
    },
    getValues() {
        var formNode = document.querySelector('form');
        var nameInputNode = formNode.querySelector('#name');
        var placeInputNode = formNode.querySelector('#place');
        var textInputNode = formNode.querySelector('#text');

        return {
            author: nameInputNode.value,
            place: placeInputNode.value,
            date: now,
            text: textInputNode.value
        };
    }

};
