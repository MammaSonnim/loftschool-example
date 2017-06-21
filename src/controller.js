var Model = require('./model');
var View = require('./view');

module.exports = {
    addGeoObject(address) {
        var geoObject = new Model.GeoObject(address);
        Model.geoObjects.add(geoObject);

        View.renderGeoObject(geoObject);
    },

    addReview(review) {
        View.renderReview(review);
    }
};


// model.review.save(form.getValue())