export class Popup {
  constructor(container, popupClose) {
    this._container = container;
    this._popupClose = popupClose;
    this.close = this.close.bind(this);
  }

  _setEventListeners() {
    this._popupClose.addEventListener("click", this.close);
  }

  _removeEventListeners() {
    this._popupClose.removeEventListener("click", this.close);
  }

  open() {
    this._container.classList.add("popup_is-opened");
    this._setEventListeners();
  }

  close() {
    this._container.classList.remove("popup_is-opened");
    this._removeEventListeners();
  }
}
