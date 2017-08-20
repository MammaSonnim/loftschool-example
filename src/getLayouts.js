const clusterItemTemplate = require('./templates/cluster-item.js');
const balloonTemplate = require('./templates/balloon.js');

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
            const openBalloon = require('./index.js').openBalloon;
            const geoObjects = require('./index.js').geoObjects;

            openBalloon(data.coords, data.address, geoObjects.list[data.address].reviews);
        }

    });

    return renderClusterItem;
}

function getContentLayout() {
    const contentLayout = ymaps.templateLayoutFactory.createClass(balloonTemplate, {
        build: function () {
            contentLayout.superclass.build.call(this);

            const submit = document.querySelector('#submit');
            const close = document.querySelector('#close');

            submit.addEventListener('click', this.submitClickHandler.bind(this));
            close.addEventListener('click', this.closeClickHandler.bind(this));
        },
        clear: function () {
            const submit = document.querySelector('#submit');
            const close = document.querySelector('#close');

            submit.removeEventListener('click', this.submitClickHandler.bind(this));
            close.removeEventListener('click', this.closeClickHandler.bind(this));

            contentLayout.superclass.clear.call(this);
        },

        submitClickHandler: function (e) {
            e.preventDefault();
            const createReview = require('./index.js').createReview;

            createReview();
        },
        closeClickHandler: function (e) {
            e.preventDefault();
            const closeBalloon = require('./index.js').closeBalloon;

            closeBalloon();
        }
    });

    return contentLayout;
}

module.exports = {
    getClusterLayout: getClusterLayout,
    getContentLayout: getContentLayout
};