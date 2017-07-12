var geoObjectsMock = [
    {
        address: 'Москва, ул. Беломорская, 18',
        reviews: [
            {
                author: 'Андрей',
                place: 'Красный куб',
                date: '23324244424',
                text: 'Отлично!'
            },
            {
                author: 'Яна',
                place: 'Шоколадница',
                date: '232424234324',
                text: 'Плохо!'
            }
        ]
    },
    {
        address: 'Москва, ул. Лесная, 7',
        reviews: [
            {
                author: 'Андрей',
                place: 'Papa Johns',
                date: '23324244424',
                text: 'Отлично!'
            },
            {
                author: 'Яна',
                place: 'Dominos',
                date: '232424234324',
                text: 'Плохо!'
            }
        ]
    },
    {
        address: 'Москва, ул. Ленина, 7',
        reviews: [
            {
                author: 'Андрей',
                place: 'Papa Johns',
                date: '23324244424',
                text: 'Отлично!'
            }
        ]
    },
];

class Review {
    constructor() {
        this.author = '';
        this.date = '';
        this.place = '';
        this.text = '';
    }
}

class GeoObject {
    constructor(address) {
        this.address = address;
        this.reviews = [];
    }

    addReview(review) {
        this.reviews.push(review);
    }

    getReviews() {
        return this.reviews;
    }

    getReview(config) {
        return {
            author: config.author,
            place: config.place,
            date: config.date,
            text: config.text
        }
    }
}

var geoObjects = {
    list: geoObjectsMock,
    get() {
        return this.items;
    },
    add(geoObject) {
        this.list.push(geoObject);
        // save to ls
    }
};

module.exports = {
    GeoObject,
    geoObjects
};
