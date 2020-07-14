export class CardList {
  constructor(container, createCard, api) {
    this._container = container;

    this._createCard = createCard;
    this._api = api;
  }

  addCard(name, link) {
    this._container.append(this._createCard(name, link));
  }

  render(cards) {
    /*  +
      Надо исправить: запрос карточек делается в index.js
      В метод render передавать массив полученных карточек 
      и делать запрос здесь не нужно
    */
    this._cards = cards;
    this._cards.forEach(({ name, link }) => {
      this.addCard(name, link);
    });
  }
}
