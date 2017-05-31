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
let listCell;
let deleteButton;
let frag = document.createDocumentFragment();

deleteButtonTmpl.innerHTML = '<button>Удалить</button>';

/**
 * Создает cookie с указанными именем и значением
 *
 * @param name - имя
 * @param value - значение
 */
function createCookie(name, value) {
    document.cookie = `${name}=${value};path=/;`
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
 * Получает части разделенные по символу
 *
 * @returns {Array}
 */
function getChunks(full, divider) {
    return full.split(divider);
}

// создать метод для отрисовки и удаления одного ряда
/**
 * Отрисовывает список cookies в таблице
 *
 * @param {Array} cookies
 */
function renderTable(cookies) {
    if (!cookies) {
        return;
    }

    listTable.innerHTML = '';

    cookies.forEach(row => {
        listRow = listRowTmpl.cloneNode(true);

        getChunks(row, '=').forEach(cell => {
            listCell = listCellTmpl.cloneNode(true);
            listCell.innerHTML = cell;
            listRow.appendChild(listCell);
        });

        deleteButton = deleteButtonTmpl.cloneNode(true);
        listRow.appendChild(deleteButton);

        frag.appendChild(listRow);
    });

    listTable.appendChild(frag);
}

// const cook = '_ym_uid=1477997572400563920; pixelRatio=2; vblastvisit=1490705236; vblastactivity=0; __utma=216415245.658853161.1482058994.1495786971.1496128144.20; _ym_isad=1; _ym_visorc_17649010=w'
renderTable(getChunks(document.cookie, '; '));

filterNameInput.addEventListener('keyup', function() {
});

// add
addButton.addEventListener('click', () => {
});

// delete
listTable.addEventListener('click', (event) => {
    if (event.target.tagName = 'BUTTON') {
        deleteCookie(); // в параметре имя ряда, которое равно имени куки
        renderTable(); // или вести поиск по имени ряда и целенаправленно его удалять
    }
});

// https://jsbin.com/qegonuz/edit?js,console,output


