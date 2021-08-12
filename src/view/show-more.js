import AbstractComponent from '../AbstractComponent.js';

export default class ShowMoreButton extends AbstractComponent {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return '<button class="films-list__show-more">Show more</button>';
  }

  /**
   * @param {Event} evt
   * @private
   */
  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  /**
   * @param {function} callback
   */
  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }
}
