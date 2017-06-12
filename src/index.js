const homeworkContainerNode = document.querySelector('#homework-container');
const popupNode = homeworkContainerNode.querySelector('#popup');
const contentNode = popupNode.querySelector('#content');
const listAllNode = contentNode.querySelector('#list-all');
const listSelectedNode = contentNode.querySelector('#list-selected');
const filterAllNode = contentNode.querySelector('#filter-all');
const filterSelectedNode = contentNode.querySelector('#filter-selected');
const saveBtnNode = popupNode.querySelector('#save');
const ERROR_AUTH = 'Не удалось авторизоваться';
const VK_RESPONSE_VERSION = '5.64';
const VK_RESPONSE_FIELDS = 'photo_100';
const VK_NO_PHOTO = 'http://vk.com/images/camera_b.gif';
const fragment = document.createDocumentFragment();
const idDivider = ',';
const storage = localStorage;
let draggedItem = null;
let friendsInListAll = {};
let friendsInListSelected = {};
let filteredFriends;

Handlebars.registerHelper('photo', function(value) {
    return value || VK_NO_PHOTO;
});
const friendTemplate = '' +
'<div class="friend__info">' +
    '<img src="{{photo photo_100}}" alt="{{first_name}} {{last_name}}" class="friend__img img" width="50" height="50">' +
    '<h3 class="friend__name name">{{first_name}} {{last_name}}</h3>' +
'</div>' +
'<button class="friend__toggle"></button>';
const templateFn = Handlebars.compile(friendTemplate);

/**
 * Обрщается к api VK и получает данные
 *
 * @param {string} method
 * @param {Object} options
 * @return {Promise}
 */
function vkApi(method, options) {
    if (!options.v) {
        options.v = VK_RESPONSE_VERSION;
    }

    return new Promise((resolve, reject) => {
        VK.api(method, options, data => {
            if (data.error) {
                reject(new Error(data.error.error_msg));
            } else {
                resolve(data.response);
            }
        })
    })
}

/**
 * Инициализирует обращение к VK
 *
 * @return {Promise}
 */
function vkInit() {
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 6066329
        });

        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error(ERROR_AUTH));
            }
        }, 2);
    })
}

/**
 * Создает объект с друзьями из данных c VK
 *
 * @param {Array} arr
 * @return {Object}
 */
function getFriendsObject(arr) {
    let item;
    let id;
    let obj = {};

    for (let i = 0; i < arr.length; i++) {
        item = arr[i];
        id = item.id;

        obj[id] = {};
        obj[id].first_name = item.first_name;
        obj[id].last_name = item.last_name;
        obj[id].photo_100 = item.photo_100;
    }

    return obj;
}

/**
 * Возвращает объект с друзьми только с теми ID, которые были сохранены
 *
 * @param {string} ids
 * @param {Object} obj
 * @return {Object}
 */
function getSavedFriendObjects(ids, obj) {
    let savedFriends = {};
    let idsArr = ids.split(idDivider);

    idsArr.forEach(id => {
        savedFriends[id] = obj[id];
    });

    return savedFriends;
}

/**
 * Создает список ID из объекта с друзьями
 *
 * @param {Object} obj
 * @return {string}
 */
function getIDs(obj) {
    return (Object.keys(obj)).join(idDivider);
}

/**
 * Синхронизирует один из объектов с друзьями с соответствующим DOM-списком друзей
 *
 * @param {HTMLElement} listToDrop
 * @param {HTMLElement} draggedItem
 */
function syncFriendObjectsWithNodes(listToDrop, draggedItem) {
    let id = draggedItem.dataset.id;

    if (listToDrop === listAllNode) {
        friendsInListAll[id] = friendsInListSelected[id];
        delete friendsInListSelected[id];

    } else {
        friendsInListSelected[id] = friendsInListAll[id];
        delete friendsInListAll[id];
    }
}

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
 * Получает объект с отфильтрованными друзьями
 *
 * @param {Object} friendsObj
 * @param {string} filterValue
 * @return {Object}
 */
function getFilteredFriends(friendsObj, filterValue) {
    let filteredFriends = {};

    if (filterValue) {
        for (let id in friendsObj) {
            let friend = friendsObj[id];
            if (friend && isMatching(friend.first_name + ' ' + friend.last_name, filterValue)) {
                filteredFriends[id] = friend;
            }
        }
    } else {
        filteredFriends = friendsObj;
    }

    return filteredFriends;
}

/**
 * Проверяет, соответствует ли DOM-элемент друга значению фильтра
 *
 * @param {HTMLElement} node
 * @param {string} filterValue
 * @return {boolean}
 */
function isFriendNodeMatchedFilterValue(node, filterValue) {
    return isMatching(node.dataset.info, filterValue);
}

/**
 * Отрисовывает DOM-элементы друзей
 *
 * @param {Object} friendsObject
 * @param {HTMLElement} list
 */
function renderFriends(friendsObject, list) {
    list.innerHTML = '';
    let itemNode;
    let friend;

    for (let id in friendsObject) {
        friend = friendsObject[id];
        itemNode = document.createElement('li');
        itemNode.classList.add('friend');
        itemNode.dataset.id = id;
        itemNode.dataset.info = friend && friend.first_name + ' ' + friend.last_name;
        itemNode.setAttribute('draggable', 'true');
        itemNode.innerHTML = templateFn(friend);
        fragment.appendChild(itemNode);
    }

    list.appendChild(fragment);
}

/**
 * Отрисовывает списки с друзьями
 *
 * @param {Object} friendsObject
 */
function renderLists(friendsObject) {
    if (!storage.IDsInListAll && !storage.IDsInListSelected) {
        friendsInListAll = friendsObject;
    } else {
        friendsInListAll = getSavedFriendObjects(storage.IDsInListAll, friendsObject);
        friendsInListSelected = getSavedFriendObjects(storage.IDsInListSelected, friendsObject);

        renderFriends(friendsInListSelected, listSelectedNode);
    }

    renderFriends(friendsInListAll, listAllNode);
}

/**
 * Перемещает друга из списка в список — объектов и DOM-представлений, в зависимости от значения фильтра
 *
 * @param {HTMLElement} friend
 * @param {HTMLElement} targetList
 * @param {string} filterValue
 */
function moveFriend(friend, targetList, filterValue) {
    if (!filterValue || filterValue && isFriendNodeMatchedFilterValue(friend, filterValue)) {
        targetList.appendChild(friend);
    } else {
        friend.remove();
    }

    syncFriendObjectsWithNodes(targetList, friend);
}

/**
 * Навешивает обработчики drag-n-drop
 *
 * @param {HTMLElement} node
 */
function addDragNDropListeners(node) {
    node.addEventListener('dragstart', event => {
         if (event.target.tagName.toLowerCase() === 'li') {
             draggedItem = event.target;
             event.dataTransfer.setData('text/plain', event.target.dataset.id);
         }
    });

    node.addEventListener('dragover', event => {
        event.preventDefault();
        return false;
    });

    node.addEventListener('drop', event => {
        let target = event.target;
        let isListItemTag = target.tagName.toLowerCase() === 'li';
        let isListTag = target.tagName.toLowerCase() === 'ul';
        let listToDrop;
        let currentFilter;

        if (isListItemTag || isListTag) {
            listToDrop = isListItemTag ? target.parentNode : target;

            currentFilter = isListItemTag ?
                (target.parentNode.previousElementSibling).querySelector('input') :
                (target.previousElementSibling).querySelector('input');

            moveFriend(draggedItem, listToDrop, currentFilter.value);
        }
    });

    node.addEventListener('dragenter', event => {
        event.preventDefault();
    });

    node.addEventListener('dragleave', event => {
        event.preventDefault();
    });
}

/** @param {Event} event*/
function saveClickHandler(event) {
    storage.IDsInListAll = getIDs(friendsInListAll);
    storage.IDsInListSelected = getIDs(friendsInListSelected);
}

/** @param {Event} event*/
function filterKeyupHandler(event) {
    if (event.target === filterAllNode) {
        filteredFriends = getFilteredFriends(friendsInListAll, event.target.value);
        renderFriends(filteredFriends, listAllNode);
    }

    if (event.target === filterSelectedNode) {
        filteredFriends = getFilteredFriends(friendsInListSelected, event.target.value);
        renderFriends(filteredFriends, listSelectedNode);
    }
}

/** @param {Event} event*/
function toggleClickHandler(event) {
    if (event.target.tagName.toLowerCase() === 'button') {
        let currentItem = event.target.parentNode;
        let newSection = currentItem.parentNode.parentNode.nextElementSibling ||
            currentItem.parentNode.parentNode.previousElementSibling;
        let newList = newSection.querySelector('ul');
        let filter = (newList.parentNode).querySelector('input');

        moveFriend(currentItem, newList, filter.value);
    }
}

/**
 * Инициализирует навешивание всех обработчиков
 */
function addListeners() {
    saveBtnNode.addEventListener('click', saveClickHandler);
    addDragNDropListeners(popupNode);
    popupNode.addEventListener('keyup', filterKeyupHandler);
    contentNode.addEventListener('click', toggleClickHandler);
}

new Promise(function(resolve) {
    window.onload = resolve;
})
    .then(() => vkInit())
    .then(() => vkApi('users.get', {}))
    .then(() => vkApi('friends.get', {fields: VK_RESPONSE_FIELDS}))
    .then(response => getFriendsObject(response.items))
    .then(friendsObject => renderLists(friendsObject))
    .then(() => addListeners())
    .catch(e => alert(e.message));
