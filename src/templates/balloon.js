module.exports = '' +
    '<section class="geo-object" id="geo-object" data-address="{{ properties.address }}">' +
        '<header class="geo-object__header">' +
            '<h2 class="geo-object__address">{{ properties.address }}</h2>' +
            '<button class="geo-object__close" id="close">Закрыть</button>' +
        '</header>' +
        '<div class="container">' +
            '<ul class="geo-object__reviews-wrapper">' +
            '{% if properties.reviews %}' +
                '{% for review in properties.reviews %}' +
                    '<li class="review"><span class="review__author">{{ review.author }}</span><span class="review__place">{{ review.place }}</span><span class="review__date">{{ review.date }}</span><span class="review__text">{{ review.text }}</span></li>' +
                '{% endfor %}' +
            '{% else %}' +
                'Отзывов нет..' +
            '{% endif %}' +
            '</ul>' +

            '<hr>' +'<hr>' +

            '<form action="" class="geo-object__form form" id="form">' +
                '<input type="text" class="form__field field field_name" id="name">' +
                '<input type="text" class="form__field field field_place" id="place">' +
                '<textarea name="" cols="30" rows="10" class="form__field field field_text" id="text"></textarea>' +
                '<button type="submit" class="form__btn btn" id="submit"></button>' +
            '</form>' +
        '</div>' +
    '</section>';