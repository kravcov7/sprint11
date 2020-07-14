import "./pages/index.css";

import  {Api} from './script/api.js';
import {Card} from './script/card.js';
import {CardList} from './script/cardList.js';
import {FormValidator} from './script/formValidator.js';
import {Popup} from './script/popup.js';
import {ImgPopup} from './script/imgPopup.js';
import {UserInfo} from './script/userInfo.js';
import {errorMessages} from './script/const.js';
(function () {

  const places = document.querySelector(".places-list");
  const userInfoButton = document.querySelector(".user-info__button");
  const userInfoEdit = document.querySelector(".user-info__edit");
  const profileName = document.querySelector(".user-info__name");
  const job = document.querySelector(".user-info__job");
  const form = document.querySelector("#new");
  const formData = document.querySelector("#data");
  const popupImageOpen = document.querySelector(".popup__image-open");
  const user = document.querySelector(".popup__input_type_user-name");
  const info = document.querySelector(".popup__input_type_about");

  const template = document
    .querySelector("#card-template")
    .content.querySelector(".place-card");

  const createCard = (...arg) =>
    new Card(...arg, createPopupImg, template).create();

  const zoomBig = new ImgPopup(
    document.querySelector("#popup-image"),
    document.querySelector(".popup__close_image"),
    popupImageOpen
  );
  const createPopupImg = (item) => zoomBig.openImg(item);

  const config = {
    url: (process.env.NODE_ENV === 'production' ? "https://praktikum.tk/cohort11":"http://praktikum.tk/cohort11"),
    headers: {
      authorization: "1f3b5d59-037b-410d-b189-d9392e7c23de",
      "Content-Type": "application/json",
    },
  };

  const api = new Api(config);
  const userInfo = new UserInfo(profileName, job);
  api
    .getUserData()
    .then((res) => {
      userInfo.setUserInfo(res);
      userInfo.updateUserInfo();
      user.value = userInfo.getUserInfo().userInf;
      info.value = userInfo.getUserInfo().infoInf;
    })
    .catch((err) => {
      console.log("Ошибка. Имя не получено");
    });

  formData.addEventListener("submit", (event) => {
    event.preventDefault();
    api
      .editName(user.value, info.value)
      .then((res) => {
        userInfo.setUserInfo(res);
        userInfo.updateUserInfo();
        popupUser.close();
      })
      .catch((err) => {
        console.log("Ошибка. Имя не изменилось");
      });
  });

  const placesList = new CardList(places, createCard, api);
  api
    .getCards()
    .then((res) => {
      placesList.render(res);
    })
    .catch((err) => {
      console.log("Ошибка. Массив карточек не загружен");
    });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    api
      .newCard(form.name.value, form.link.value)
      .then((res) => {
        placesList.addCard(form.name.value, form.link.value);
      })
      .catch((err) => {
        console.log("Ошибка. Новая карточка не добавлена");
      });
    /* +
     Надо исправить: 
      - закрывать нужно только после ответа сервера подтверждением  (не исправлено)
    */
    popupCard.close();
  });

  const popupCard = new Popup(
    document.querySelector("#popup-place"),
    document.querySelector("#popupClose")
  );
  const popupUser = new Popup(
    document.querySelector("#popup-edit"),
    document.querySelector(".popup__close_edit")
  );

  const formValidationPlace = new FormValidator(form, errorMessages);
  formValidationPlace.setEventListeners();

  userInfoButton.addEventListener("click", () => {
    form.reset();
    formValidationPlace.resetErrors();
    popupCard.open();
  });

  const formValidationUser = new FormValidator(formData, errorMessages);
  formValidationUser.setEventListeners();

  userInfoEdit.addEventListener("click", () => {
    formValidationUser.resetErrors();
    popupUser.open();
  });
})();

/*
  Неплохая работа, класс Api создан, данные запрашиваются и сохраняются на сервер
  Но к организации кода взаимодествия с сервером есть несколько замечаний:

  Надо исправить:
  - + передавать в конструктор только базовый адрес сервера, а 
    название ендпоинта добавлять к нему в самом методе
  - + вместо getTasks сделать два метода getUserData getCards
  - + достаточно одного экземпляра класса Api
  - + разделить запросы к серверу от навешивания обработчиков на форму
  - + карточки передавать в render, а не в констуктор CardList
  - + в методе render не делать запрос, а только отрисовывать передаваемые в него карточки
    (сейчас при загрузке приложения делается два одинаковых запроса карточек)
  - + в конце всех запросов к серверу должна быть обработка ошибок блоком catch
  - + все действия на странице должны производится после ответа сервера, в том числе
    и закрытие попапа при сохранении профиля

  Можно лучше: 
  - проверка ответа сервера и преобразование из json
    дублируется во всех методах класса Api, лучше вынести в отдельный метод
    
  - + в некоторых местах есть замечания по форматированию кода - проблемы с отступами.
    Об оформлении кода можно почитать здесь https://learn.javascript.ru/coding-style
    Практически все современные редакторы умеют автоматически форматировать код. 
    Постарайтесь настроить его, это сильно экономит время, а Ваш код будет всегда красив.
    Одно из наиболее популярных дополнений для форматирования кода - Prettier (https://prettier.io/)

*/

/*
  Отлично, замечания исправлены, только в одном месте Вы видимо забыли перенести popupCard.close();
  в блок then, уверен Вы сможете это исправить самостоятельно

  Для закрепления полученных знаний советую сделать и оставшуюся часть задания.
  Что бы реализовать оставшуюся часть задания необходимо разобраться с Promise.all
  https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
  Т.к. для отрисовки карточек нужен id пользователя, поэтому отрисовать мы сможем их только
  после полученния с сервера данных пользователя
  Выглядит этот код примерно так:
    Promise.all([     //в Promise.all передаем массив промисов которые нужно выполнить
      this.api.getUserData(),
      this.api.getInitialCards()
    ])    
      .then((values)=>{    //попадаем сюда когда оба промиса будут выполнены
        const [userData, initialCards] = values;
        ......................  //все данные получены, отрисовываем страницу
      })
      .catch((err)=>{     //попадаем сюда если один из промисов завершаться ошибкой
        console.log(err);
      })
      

  Если у Вас будет свободное время так же попробуйте освоить работу с сервером
  применив async/await для работы с асинхронными запросами.
  https://learn.javascript.ru/async-await
  https://habr.com/ru/company/ruvds/blog/414373/
  https://www.youtube.com/watch?v=SHiUyM_fFME
  Это часто используется в реальной работе

  Успехов в дальнейшем обучении!
*/