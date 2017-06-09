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

var itemTemplate = '<div class="friend__info"><img src="{{photo}}" alt="{{firstName}} {{lastName}}" class="friend__img img" width="50" height="50"><h3 class="friend__name name">{{firstName}} {{lastName}}</h3></div><button class="friend__toogle"></button>';

function vkApi(method, options) {
    if (!options.v) {
        options.v = VK_RESPONSE_VERSION;
    }

    return new Promise((resolve, reject) => {
        VK.api(method, options, response => {
            if (response.error) {
                reject(new Error(response.error.error_msg));
            } else {
                resolve(response);
            }
        })
    })
}

function vkInit() {
    return new Promise((resolve, reject) => {
        VK.init({
            apiId: 6066329
        });

        VK.Auth.login(response => {
            if (response.session) {
                resolve(response);
            } else {
                reject(new Error(ERROR_AUTH));
            }
        }, 2);
    })
}

function renderItems(items) {
    const fragment = document.createDocumentFragment();
    const templateFn = Handlebars.compile(itemTemplate);

    let itemNode;
    let html;
    let data;

    items.forEach(item => {
        itemNode = document.createElement('li');
        itemNode.classList.add('friend');

        data = {
            photo: item.photo_100 || VK_NO_PHOTO,
            firstName: item.first_name,
            lastName: item.last_name
        };

        html = templateFn(data);
        itemNode.innerHTML = html;
        fragment.appendChild(itemNode);
    });

    listAllNode.appendChild(fragment);
}

new Promise(function(resolve) {
    window.onload = resolve;
})
    .then(() => vkInit())
    .then(() => vkApi('users.get', {}))
    .then(() => vkApi('friends.get', {fields: VK_RESPONSE_FIELDS}))
    .then(response => renderItems(response.response.items))
    .catch(e => alert(e.message));