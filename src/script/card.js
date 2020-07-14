export  class Card {
  constructor(name, link, createPopupImg, template) {
    this._link = link;
    this._name = name;
    this._createPopupImg = createPopupImg;
    this._template = template;
    this._like = this._like.bind(this);
    this._remove = this._remove.bind(this);
  }

  create() {
    this._view = this._template.cloneNode(true);
    this._view.querySelector(".place-card__name").textContent = this._name;
    this._view.querySelector(
      ".place-card__image"
    ).style.backgroundImage = `url(${this._link})`;
    this._view.querySelector(".place-card__image").dataset.url = this._link;

    this.like = this._view.querySelector(".place-card__like-icon");
    this.delete = this._view.querySelector(".place-card__delete-icon");
    this.imgCard = this._view.querySelector(".place-card__image");
    this.setEventListeners();

    return this._view;
  }

  _like() {
    this.like.classList.toggle("place-card__like-icon_liked");
  }
  _remove() {
    this.removeEventListeners();
    this._view.remove();
  }
  zoomImg = () => {
    this._createPopupImg(this._link);
  };
  setEventListeners() {
    this.like.addEventListener("click", this._like);
    this.delete.addEventListener("click", this._remove);
    this.imgCard.addEventListener("click", this.zoomImg);
  }

  removeEventListeners() {
    this.like.removeEventListener("click", this._like);
    this.delete.removeEventListener("click", this._remove);
    this.imgCard.removeEventListener("click", this.zoomImg);
  }
}
