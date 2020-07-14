import {Popup} from './popup.js'
export class ImgPopup extends Popup {
  constructor(container, popupClose, background) {
    super(container, popupClose);
    this._background = background;
  }

  openImg(img) {
    this._background.src = img;
    this.open();
  }
}
