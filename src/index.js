/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve()
        }, 1000)
    })
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {
    var url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';

    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();

        xhr.addEventListener('load', function() {
            resolve(xhr.response);
        })
    })
        .then(response => JSON.parse(response))
        .then(towns => towns.sort(
            (a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
        ));
}

export {
    delayPromise,
    loadAndSortTowns
};
