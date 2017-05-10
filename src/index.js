/* ДЗ 1 - Функции */

/*
 Задание 1:

 Функция должна принимать один аргумент и возвращать его
 */
function returnFirstArgument(arg) {
    return arg;
}

/*
 Задание 2:

 Функция должна принимать два аргумента и возвращать сумму переданных значений
 Значение по умолчанию второго аргумента должно быть 100
 */
function defaultParameterValue(a, b=100) {
    return a + b;
}

/*
 Задание 3:

 Функция должна возвращать все переданные в нее аргументы в виде массива
 Количество переданных аргументов заранее неизвестно

 Как можно преобразовать arguments в массив:
 1) var args = Array.prototype.slice.call(arguments);
 2) var args = Array.from(arguments); (не поддерживается в IE и Opera)
 3) var args = [...arguments]; (не поддерживается в IE и Opera)

 Выбрала второй способ, потому что он наиболее читабельный.
 */
function returnArgumentsArray() {
    return Array.from(arguments);
}

/*
 Задание 4:

 Функция должна принимать другую функцию и возвращать результат вызова переданной функции
 */
function returnFnResult(fn) {
    return fn();
}

/*
 Задание 5:

 Функция должна принимать число (значение по умолчанию - 0) и возвращать функцию (F)
 При вызове F, переданное число должно быть увеличено на единицу и возвращено из F
 */
function returnCounter(number=0) {
    // return function() { return ++number; }
    return () => ++number;
}

/*
 Задание 6 *:

 Функция должна принимать другую функцию (F) и некоторое количество дополнительных аргументов
 Функция должна привязать переданные аргументы к функции F и вернуть получившуюся функцию
 */
function bindFunction(fn) {
    var args = [].slice.call(arguments, 1);

    // используем apply, потому что у нас массив аргументов, а bind и call используют аргументы через запятую.
    // По условию ужно вернуть функцию, а не результат, поэтому также используем bind, иначе можно было бы сделать так -
    // fn.apply(null, args)
    // Если вызвать bindFunction(fn, 2, 4), то после применения apply выражение разворачивается в fn.bind(null, 2, 4)
    return fn.bind.apply(fn, [null].concat(args))
}

export {
    returnFirstArgument,
    defaultParameterValue,
    returnArgumentsArray,
    returnFnResult,
    returnCounter,
    bindFunction
}
