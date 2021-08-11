import AbstractComponent from '../AbstractComponent.js';

export default class FooterStatistics extends AbstractComponent {
  constructor(filmCount) {
    super();
    this._filmCount = filmCount;
  }

  getTemplate() {
    return `<p>${this._filmCount} movies inside</p>`;
  }
}
