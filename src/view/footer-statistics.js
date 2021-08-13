import AbstractComponent from '../abstract-component.js';

export default class FooterStatistics extends AbstractComponent {
  /**
   * @param {number} filmCount
   */
  constructor(filmCount) {
    super();
    /**
     * @type {number}
     * @private
     */
    this._filmCount = filmCount;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return `<p>${this._filmCount} movies inside</p>`;
  }
}
