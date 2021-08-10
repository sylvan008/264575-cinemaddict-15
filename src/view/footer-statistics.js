import {createElement} from '../utils';

export default class FooterStatistics {
  constructor(filmCount) {
    this._filmCount = filmCount;
    this._element = null;
  }

  getTemplate() {
    return `<p>${this._filmCount} movies inside</p>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
