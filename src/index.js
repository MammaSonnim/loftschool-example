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
let storage = localStorage;

Handlebars.registerHelper('photo', function(value) {
    return value || VK_NO_PHOTO;
});

const friendTemplate = '' +
    '{{#each items}}' +
        '<li class="friend">' +
            '<div class="friend__info">' +
                '<img src="{{photo photo_100}}" alt="{{first_name}} {{last_name}}" class="friend__img img" width="50" height="50">' +
                '<h3 class="friend__name name">{{first_name}} {{last_name}}</h3>' +
            '</div>' +
            '<button class="friend__toogle"></button>' +
        '</li>' +
    '{{/each}}';

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

function saveClickHandler() {
    let listAllHtml = listAllNode.innerHTML;
    let listSelectedHTML = listSelectedNode.innerHTML;

    storage.listAllHtml = listAllHtml;
    storage.listSelectedHTML = listSelectedHTML;
}

new Promise(function(resolve) {
    window.onload = resolve;
})
    .then(() => vkInit())
    .then(() => vkApi('users.get', {}))
    // .then(() => {
    //     return storage.data ? JSON.parse(storage.data) : vkApi('friends.get', {fields: VK_RESPONSE_FIELDS});
    // })
    .then(() => vkApi('friends.get', {fields: VK_RESPONSE_FIELDS}))
    .then(response => {
        return listAllNode.innerHTML = templateFn(response);

        // return getFriendsObject(response.items);
    })
    .then(friends => {
        save.addEventListener('click', function() {
            saveClickHandler();
        })
    })
    .catch(e => alert(e.message));