const homeworkContainerNode = document.querySelector('#homework-container');
const popupNode = document.querySelector('#popup');
const listAllNode = document.querySelector('#list-all');
const listSelectedNode = document.querySelector('#list-selected');
const filterAllNode = document.querySelector('#filter-all');
const filterSelectedNode = document.querySelector('#filter-selected');
const saveBtnNode = document.querySelector('#save');
const ERROR_AUTH = 'Не удалось авторизоваться';
const VK_RESPONSE_VERSION = '5.64';
const VK_RESPONSE_FIELDS = 'photo_100';
const VK_NO_PHOTO = 'http://vk.com/images/camera_b.gif';
const fragment = document.createDocumentFragment();
let storage = localStorage;
let idsInListAll = '';
let idsInListSelected = '';

Handlebars.registerHelper('photo', function(value) {
    return value || VK_NO_PHOTO;
});
const friendTemplate = '' +
'<div class="friend__info">' +
    '<img src="{{photo photo_100}}" alt="{{first_name}} {{last_name}}" class="friend__img img" width="50" height="50">' +
    '<h3 class="friend__name name">{{first_name}} {{last_name}}</h3>' +
'</div>' +
'<button class="friend__toogle"></button>';
const templateFn = Handlebars.compile(friendTemplate);


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

function saveIDs(list, container) {
    let friends = list.childNodes;

    for (var friend of friends) {
        container += friend.dataset.id + ' ';
    }
}

function saveClickHandler() {
    saveIDs(listAllNode, storage.IDsInListAll);
    saveIDs(listSelectedNode, storage.IDsInListSelected);
}

function addListeners() {
    save.addEventListener('click', saveClickHandler())
}

function renderFriends(friendsObject, list) {
    let itemNode;

    for (let id in friendsObject) {
        itemNode = document.createElement('li');
        itemNode.classList.add('friend');
        itemNode.dataset.id = id;
        itemNode.innerHTML = templateFn(friendsObject[id]);
        fragment.appendChild(itemNode);
    }

    list.appendChild(fragment);
}

function getFilteredObjectByIDs(ids, obj) {
    var newObj = {};

    ids = ids.split(' ');

    ids.forEach(id => {
        newObj[id] = obj[id];
    });

    return newObj;
}

function renderLists(friendsObject) {
    if (!storage.IDsInListAll && !storage.IDsInListSelected) {
        renderFriends(friendsObject, listAllNode);
        return;
    }

    const friendsInListAll = getFilteredObjectByIDs(storage.IDsInListAll, friendsObject);
    const friendsInListSelected = getFilteredObjectByIDs(storage.IDsInListSelected, friendsObject);

    renderFriends(friendsInListAll, listAllNode);
    renderFriends(friendsInListSelected, listSelectedNode);
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


// 1. авторизация
// 2. дергаем с сервера
// 3. преобразовать в объект
// 4. рисуем в соответствие с размещенными айдишниками
// 5. навешиваем слушатели на крестики, драг-н-дроп
// 6. при перемещении таскаем ноды
// 7. при сохранении формируем 2 листа с айдишниками
