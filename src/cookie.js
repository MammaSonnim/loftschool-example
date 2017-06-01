/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');
let listRowTmpl = document.createElement('tr');
let listCellTmpl = document.createElement('td');
let deleteButtonTmpl = document.createElement('td');
let listRow;
let deleteButton;
let frag = document.createDocumentFragment();

deleteButtonTmpl.innerHTML = '<button>Удалить</button>';

/**
 * Возвращает значение поля
 *
 * @param {HTMLElement} input
 * @returns {string}
 */
function getValue(input) {
    return input.value;
}

/**
 * Получает части разделенные по символу
 *
 * @returns {Array}
 */
function getChunks(full, divider) {
    return full.split(divider);
}

/**
 * Создает объект из отдельной cookie
 *
 * @param {string} cookie
 * @returns {Object}
 */
function getCurrentCookie(cookie) {
    var obj = {};
    var chunks = getChunks(cookie, '=');

    obj.name = chunks[0];
    obj.value = chunks[1];

    return obj;
}

/**
 * Создает массив из объектов cookies
 *
 * @param {string} cookies
 * @returns {Array<Object>}
 */
function getCurrentCookies(cookies) {
    var currentCookies = getChunks(cookies, '; ');
    var arr = [];

    currentCookies.forEach(cookie => {
        arr.push(getCurrentCookie(cookie));
    });

    return arr;
}

/**
 * Создает объект cookie из введенных значений
 *
 * @returns {Object}
 */
function getNewCookie() {
    var obj = {};

    obj.name = getValue(addNameInput);
    obj.value = getValue(addValueInput);

    return obj;
}

/**
 * Создает cookie в BOM
 *
 * @param {Object} config
 */
function createCookie(config) {
    document.cookie = `${config.name}=${config.value};`;
}

/**
 * Добавляет cookie в BOM и на страницу
 *
 * @param {Object} cookie
 */
function addCookie(cookie) {
    var currentCookies = getCurrentCookies(document.cookie);

    var compareNameAndValue = function(currentCookie) {
        return cookie.name === currentCookie.name && cookie.value === currentCookie.value
    };

    if (currentCookies.some(compareNameAndValue)) {
        return;
    }

    var compareName = function(currentCookie) {
        return cookie.name === currentCookie.name
    };

    if (currentCookies.some(compareName)) {
        deleteRow(document.getElementById(cookie.name));
    }

    createCookie(cookie);
    renderRow(cookie);
}

/**
 * Удаляет cookie с указанным именем
 *
 * @param name - имя
 */
function deleteCookie(name) {
    document.cookie = `${name}=;path=/;expires=${new Date(0)};`
}

/**
 * Создает один ряд таблицы
 *
 * @param {Object} cookie
 */
function createRow(cookie) {
    listRow = listRowTmpl.cloneNode(true);

    var listCellName = listCellTmpl.cloneNode(true);
    listCellName.innerHTML = cookie.name;
    listRow.appendChild(listCellName);

    var listCellValue = listCellTmpl.cloneNode(true);
    listCellValue.innerHTML = cookie.value;
    listRow.appendChild(listCellValue);

    listRow.setAttribute('id', cookie.name);

    deleteButton = deleteButtonTmpl.cloneNode(true);
    listRow.appendChild(deleteButton);

    frag.appendChild(listRow);
}

/**
 * Отрисовывает один ряд таблицы
 *
 * @param {Object} cookie
 */
function renderRow(cookie) {
    createRow(cookie);
    listTable.appendChild(frag);
}

/**
 * Удалеет один ряд таблицы
 *
 * @param {HTMLElement} row
 */
function deleteRow(row) {
    row.remove();
}

/**
 * Отрисовывает список всех cookies в таблице
 *
 * @param {Array} cookies
 */
function renderTable(cookies) {
    if (!cookies) {
        return;
    }

    listTable.innerHTML = '';

    cookies.forEach(cookie => {
        createRow(cookie);
    });

    listTable.appendChild(frag);
}

/** @param {Event} event*/
function deleteButtonClickHandler(event) {
    var row = event.target.parentNode.parentNode;
    var rowName = row.getAttribute('id');

    deleteCookie(rowName);
    deleteRow(row);
}

/** @param {Event} event*/
function addButtonClickHandler(event) {
    addCookie(getNewCookie());
}

/** @param {Event} event*/
function filterNameInputKeyupHandler(event) {
    
}

function init() {
    renderTable(getCurrentCookies(document.cookie));
    filterNameInput.addEventListener('keyup', function() {
        filterNameInputKeyupHandler();
    });
    addButton.addEventListener('click', (event) => {
        addButtonClickHandler(event);
    });
    listTable.addEventListener('click', (event) => {
        if (event.target.tagName = 'BUTTON') {
            deleteButtonClickHandler(event);
        }
    });
}


init();
// https://jsbin.com/qegonuz/edit?js,console,output