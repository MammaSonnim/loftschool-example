/* ДЗ 3 - работа с массивами и объеектами */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {
    for (var i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
    var newArray = [];

    for (var i = 0; i < array.length; i++) {
        newArray.push(fn(array[i], i, array));
    }

    return newArray;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {
    var i = 0;
    var result = initial;

    if (initial === undefined) {
        result = array[0];
        i = 1;
    }

    while (i < array.length) {
        result = fn(result, array[i], i, array);
        i++;
    }

    return result;
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
    delete obj[prop];
}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
    return obj.hasOwnProperty(prop);
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {
    return Object.keys(obj);
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
    // первая реализация
    var propArray = [];

    for (var prop in obj) {
        // hasOwnProperty ограничивает свойства только перечисляемыми элементами
        if (obj.hasOwnProperty(prop)) {
            propArray.push(prop.toUpperCase())
        }
    }

    return propArray;

    // вторая реализация, 2 цикла
    // return Object.keys(obj).map(function(prop) {
    //     return prop.toUpperCase()
    // })
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from, to) {
    var newArray = [];
    var length = array.length;

    from = from || 0;
    if (from < 0) {
        from = Math.abs(from) > length ? 0 : length + from;
    }

    to = (to === undefined) ? length : to;
    if (to < 0) {
        to = length + to;
    }
    if (to > length) {
        to = length;
    }

    for (var i = from; i < to; i++) {
        newArray.push(array[i])
    }

    return newArray;
}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    return new Proxy(obj, {
        set: function(obj, prop, newValue) {
            if (typeof newValue  === 'number') {
                obj[prop] = newValue * newValue;

                return true;
            }

            obj[prop] = newValue;

            return true;
        }
    });
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};
