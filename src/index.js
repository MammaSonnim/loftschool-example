const homeworkContainer = document.querySelector('#homework-container');
const popup = document.querySelector('#popup');
const listAll = document.querySelector('#list-all');
const listSelected = document.querySelector('#list-selected');
const filterAll = document.querySelector('#filter-all');
const filterSelected = document.querySelector('#filter-selected');
const saveBtn = document.querySelector('#save');
const template = document.querySelector('#template');
const itemSource = (template.content || template).querySelector('.friend');
const ERROR_AUTH = 'Не удалось авторизоваться';
const VK_RESPONSE_VERSION = '5.64';
const VK_RESPONSE_FIELDS = 'photo_100';

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
    let fragment = document.createDocumentFragment();

    items.forEach(item => {
        let itemNode = itemSource.cloneNode(true);
        let itemNameNode = itemNode.querySelector('.name');
        let itemImgNode = itemNode.querySelector('.img');

        itemNameNode.innerText = itemImgNode.alt = `${item.first_name} ${item.last_name}`;
        itemImgNode.src = item.photo_100;

        fragment.appendChild(itemNode);
    });

    listAll.appendChild(fragment);
}

new Promise(function(resolve) {
    window.onload = resolve;
})
    .then(() => vkInit())
    .then(() => vkApi('users.get', {}))
    .then(() => vkApi('friends.get', {fields: VK_RESPONSE_FIELDS}))
    .then(response => renderItems(response.response.items))
    .catch(e => alert(e.message));