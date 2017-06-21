module.exports = function(data) {
    ymaps.templateLayoutFactory.createClass(
    '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
    '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
    '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
    )
};