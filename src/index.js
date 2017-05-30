/* ДЗ 7.1 - BOM */

/**
 * Функция должна создавать окно с указанным именем и размерами
 *
 * @param {string} name - имя окна
 * @param {number} width - ширина окна
 * @param {number} height - высота окна
 * @return {Window}
 */
function createWindow(name, width, height) {
    return window.open(name, `width=${width},height=${height}`)
}

/**
 * Функция должна закрывать указанное окно
 *
 * @param {Window} window - окно, которое нужно закрыть
 */
function closeWindow(window) {
    if (!window.closed) {
        window.close();
    }
}

/**
 * Функция должна создавать cookie с указанными именем и значением
 *
 * @param name - имя
 * @param value - значение
 */
function createCookie(name, value) {
    document.cookie = `${name}=${value};path=/;`
}

/**
 * Функция должна удалять cookie с указанным именем
 *
 * @param name - имя
 */
function deleteCookie(name) {
    document.cookie = `${name}=;path=/;expires=${new Date(0)};`
}

export {
    createWindow,
    closeWindow,
    createCookie,
    deleteCookie
};
