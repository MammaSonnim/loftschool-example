var geoObjectsMock = [
    {
        address: 'Москва, ул. Льва Толстого, 16',
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
        address: 'Москва, ул. Льва Толстого, 26',
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
}

var geoObjects = {
    list: geoObjectsMock,
    get() {
        return this.items;
    },
    add(geoObject) {
        this.items.push(geoObject);
        // save to ls
    }
};

module.exports = {
    GeoObject,
    geoObjects
};
