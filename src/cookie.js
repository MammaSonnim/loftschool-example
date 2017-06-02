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
 * @return {string}
 */
function getValue(input) {
    return input.value;
}
// или const getValue = ({value}) => value;

/**
 * Проверяет встречается ли подстрока chunk в строке full
 *
 * @param {string} full
 * @param {string} chunk
 * @return {boolean}
 */
function isMatching(full, chunk) {
    return !!(full.match(new RegExp(chunk, 'i')));
}

/**
 * Создает объект из отдельной cookie
 *
 * @param {string} cookie
 * @return {Object}
 */
function getCurrentCookie(cookie) {
    const [name, value] = cookie.split('=');

    return {
        name,
        value
    };
}

/**
 * Создает массив из объектов cookies
 *
 * @param {string} cookies
 * @return {Array<Object>}
 */
function getCurrentCookies(cookies) {
   return cookies.split('; ').map(cookie => getCurrentCookie(cookie));
}

/**
 * Создает объект cookie из введенных значений
 *
 * @return {Object}
 */
function getNewCookie() {
    return {
        name: getValue(addNameInput),
        value: getValue(addValueInput)
    };
}

/**
 * Создает cookie в BOM
 *
 * @param {Object} {name, value}
 */
function createCookie({name, value}) {
    document.cookie = `${name}=${value};`;
}

/**
 * Сравнивает имя и значение текущих cookie и новой
 *
 * @param {Array} currentCookies
 * @param {Object} newCookie
 */
function isEqualNameAndValue(currentCookies, newCookie) {
    return currentCookies.some(currentCookie => newCookie.name === currentCookie.name && newCookie.value === currentCookie.value)
}

/**
 * Сравнивает имя текущих cookie и новой
 *
 * @param {Array} currentCookies
 * @param {Object} newCookie
 */
function isEqualName(currentCookies, newCookie) {
    return currentCookies.some(currentCookie => newCookie.name === currentCookie.name)
}

/**
 * Проверяет, соответствует ли новые cookie значению фильтра
 *
 * @param {string} newCookieValue
 * @param {string} filterValue
 */
function isMatchingToFilter(newCookieValue, filterValue) {
    return isMatching(newCookieValue, filterValue);
}

/**
 * Добавляет cookie в BOM и на страницу
 *
 * @param {Object} newCookie
 */
function addCookie(newCookie) {
    var currentCookies = getCurrentCookies(document.cookie);

    if (isEqualNameAndValue(currentCookies, newCookie)) {
        return;
    }

    if (isEqualName(currentCookies, newCookie)) {
        deleteRow(document.getElementById(newCookie.name));
    }

    if (!filterNameInput.value || isMatchingToFilter(newCookie.name + newCookie.value, filterNameInput.value)) {
        renderRow(newCookie);
    }

    createCookie(newCookie);
}

/**
 * Удаляет cookie с указанным именем
 *
 * @param {string} name - имя
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
 * @param {Object} row
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

/**
 * Возвращает отфильтрованные cookies
 *
 * @param {Array} currentCookies
 * @param {string} filterValue
 * @return {Array}
 */
function getFilteredCookies(currentCookies, filterValue) {
    return currentCookies.filter(item => isMatching(item.name + item.value, filterValue));
}

/**
 * Запускает рендер отфильтрованных cookies
 */
function renderFilteredCookies() {
    var currentCookies = getCurrentCookies(document.cookie);
    var filterValue = filterNameInput.value;

    if (filterValue) {
        renderTable(getFilteredCookies(currentCookies, filterValue))
    } else {
        renderTable(currentCookies);
    }
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
    renderFilteredCookies();
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
        if (event.target.tagName === 'BUTTON') {
            deleteButtonClickHandler(event);
        }
    });
}

init();
