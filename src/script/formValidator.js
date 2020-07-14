export class FormValidator {
  constructor(form, errorMsg) {
    this._form = form;
    this._errorMsg = errorMsg;
    this._button = this._form.querySelector(".button");
    this._errorRes = this._form.querySelectorAll(".error");
  }

  setEventListeners() {
    Array.from(this._form.querySelectorAll(".popup__input")).forEach(
      (input) => {
        this.errorElement = this._form.querySelector(`#${input.id}-error`);
        this.addListener(input, this.errorElement);
      }
    );
  }

  addListener(input, errorElement) {
    input.addEventListener("input", () =>
      this.checkInputValidity(input, errorElement)
    );
  }

  checkInputValidity(input, errorElement) {
    if (input.validity.valueMissing) {
      errorElement.textContent = this._errorMsg.empty;
    }
    if (input.validity.patternMismatch) {
      errorElement.textContent = this._errorMsg.wrongUrl;
    }
    if (input.validity.tooShort || input.validity.tooLong) {
      errorElement.textContent = this._errorMsg.wrongLength;
    }
    if (input.validity.valid) {
      errorElement.textContent = "";
    }
    this.setSubmitButtonState();
  }

  resetErrors() {
    this._errorRes.forEach((errorElement) => (errorElement.textContent = ""));
    this.setSubmitButtonState();
  }

  setSubmitButtonState() {
    if (this._form.checkValidity()) {
      this._button.removeAttribute("disabled");
      this._button.classList.remove("popup__button_disabled");
    } else {
      this._button.disabled = true;
      this._button.classList.add("popup__button_disabled");
    }
  }
}
