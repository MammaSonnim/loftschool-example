module.exports = '' +
    '<div class="cluster-item">' +
        '<h2 class="cluster-item__place">{{ properties.review.place|raw }}</h2>' +
        '<a class="cluster-item__address" id="address" href="#">{{ properties.address|raw }}</a>' +
        '<div class="cluster-item__text">{{ properties.review.text|raw }}</div>' +
        '<div class="cluster-item__date">{{ properties.review.date|raw }}</div>' +
    '</div>';