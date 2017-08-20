const storage = localStorage;

class GeoObjects {
    constructor() {
        this.list = {};
        this.loadFromStorage();
    }

    addGeoObject(geoObject, address) {
        this.list[address] = geoObject;
        // id++;
    }

    saveToStorage() {
        storage.geoObjects = JSON.stringify(this.list);
    }

    loadFromStorage() {
        let saved = storage.geoObjects;

        if (saved) {
            this.list = JSON.parse(saved);
        }
    }
}

class GeoObject {
    constructor(coords, address) {
        this.coords = coords;
        this.address = address;
        this.reviews = [];
    }

    addReview(review) {
        this.reviews.push(review);
    }
}

class Review {
    constructor(config) {
        this.author = config.author;
        this.place = config.place;
        this.text = config.text;
        this.date = config.date;
    }
}

module.exports = {
    GeoObjects: GeoObjects,
    GeoObject: GeoObject,
    Review: Review
};