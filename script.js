const xhr = new XMLHttpRequest();
const requestURL = 'https://jsonplaceholder.typicode.com/users';

const users = document.querySelector('.users');
const info = document.querySelector('.info');

const createResponseType = (method, url, type) => {
  xhr.open(method, url);

  xhr.responseType = type;
};

const sendRequest = (method, url) => {
  createResponseType(method, url, 'json');

  xhr.onload = () => {
    if (xhr.status !== 200) {
      console.log(`Error: ${xhr.status}: ${xhr.statusText}`);
    } else {
      const data = xhr.response;
      data.forEach((item) => {
        const user = document.createElement('div');
        user.classList.add('user__item');
        user.id = item.id;
        user.innerHTML = `
           <h3 class='user__name'>${item.name}</h3>
           <span class='user__email'>${item.email}</span>
           <div>
            <strong>${item.address.zipcode}</strong>
            <span>${item.address.street}</span>
           </div>
           <button data-id='add'>Add</button>
         `;
        users.insertAdjacentElement('beforeend', user);
      });
    }
  };

  xhr.send();
};

sendRequest('GET', requestURL);

const infoData = [];

const renderInfoUser = () => {
  info.textContent = '';

  infoData.forEach((inf) => {
    const infUser = document.createElement('div');
    infUser.classList.add('info__user');

    infUser.innerHTML = `
      <h1>Name: ${inf.name}</h1>
      <h3>Email: ${inf.email}</h3>
    `;

    info.insertAdjacentElement('beforeend', infUser);
  });
};

const postRequest = (method, url, body) => {
  xhr.open(method, url);

  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = () =>
    xhr.status !== 201
      ? `Error: ${xhr.status}: ${xhr.statusText}`
      : renderInfoUser();

  xhr.send(JSON.stringify(body));
};

const onAddUserInfo = (event) => {
  if (event.target.dataset.id === 'add') {
    const parentNode = event.target.closest('.user__item');
    const id = Number(parentNode.id);
    const name = parentNode.querySelector('.user__name').textContent;
    const email = parentNode.querySelector('.user__email').textContent;

    const user = {
      id,
      name,
      email,
      count: 1,
    };

    const findUser = infoData.find((item) => item.id === id);

    if (findUser) {
      infoData.map((inf) =>
        inf.id === id ? { ...inf, count: inf.count + 1 } : inf
      );
    } else {
      infoData.push(user);
    }

    postRequest('POST', requestURL, user);
    renderInfoUser();
  }
};

renderInfoUser();

users.addEventListener('click', onAddUserInfo);
