export class Api {
  constructor(config) {
    this.url = config.url;
    this.headers = config.headers;
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject("Произошла ошибка");
    }
    return res.json();
  }

  getUserData() {
    return (
      fetch(`${this.url}/users/me`, {
        headers: this.headers,
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject("Произошла ошибка");
        })
    );
  }
  getCards() {
    return (
      fetch(`${this.url}/cards`, {
        headers: this.headers,
      })
        /*
        Можно лучше: проверка ответа сервера и преобразование из json
        дублируется во всех методах класса Api, лучше вынести в отдельный метод:
          _getResponseData(res) {
          if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`); 
          }
          return res.json();
          }
        Подчеркивание в начале имени метода говорит о том, что метод является приватным, т.е.
        не используется вне класса Api   
      */
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject("Произошла ошибка");
        })
    );
  }

  editName(name, about) {
    return fetch(`${this.url}/users/me`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject("Произошла ошибка");
    });
  }

  newCard(name, link) {
    return fetch(`${this.url}/cards`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject("Произошла ошибка");
    });
  }
}
