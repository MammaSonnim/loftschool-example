module.exports = '' +
    '<section class="geo-object" id="geo-object" data-address="{{ properties.address }}">' +
        '<header>' +
            '<h2 class="geo-object__address">{{ properties.address }}</h2>' +
            '<button class="geo-object__close">Закрыть</button>' +
        '</header>' +

        '<div class="geo-object__reviews-wrapper">' +
        '{% if properties.reviews %}' +
            'Отзыв' +
        '{% else %}' +
            'Отзывов нет..' +
        '{% endif %}' +
        '</div>' +

        '<hr>' +

        '<form action="" class="geo-object__form form" id="form">' +
            '<input type="text" class="form__field field field_name" id="name">' +
            '<input type="text" class="form__field field field_place" id="place">' +
            '<textarea name="" cols="30" rows="10" class="form__field field field_text" id="text"></textarea>' +
            '<button type="submit" class="form__btn btn" id="submit"></button>' +
        '</form>' +
    '</section>';