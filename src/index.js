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
    url: (process.env.NODE_ENV === 'production' ? "https://nomoreparties.co/cohort11":"http://nomoreparties.co/cohort11"),
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
