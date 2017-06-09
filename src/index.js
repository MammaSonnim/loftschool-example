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

Handlebars.registerHelper('photo', function(value) {
    return value || VK_NO_PHOTO;
});

var friendTemplate = '' +
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

new Promise(function(resolve) {
    window.onload = resolve;
})
    .then(() => vkInit())
    .then(() => vkApi('users.get', {}))
    .then(() => vkApi('friends.get', {fields: VK_RESPONSE_FIELDS}))
    .then(response => listAllNode.innerHTML = templateFn(response))
    .catch(e => alert(e.message));