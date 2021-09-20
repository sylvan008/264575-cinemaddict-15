import {createElement} from './utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;
const SHAKE_CLASS = 'shake';

export default class AbstractComponent {
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error('Can\'t instantiate AbstractComponent, only concrete one.');
    }
    /**
     * @type {?HTMLElement}
     * @private
     */
    this._element = null;

    /**
     * @type {{name: function}}
     * @private
     */
    this._callback = {};
  }

  /**
   * Метод должен будет возвращать строковое представление HTML разметки будущего компонента
   * @abstract
   */
  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
  }

  /**
   * Возвращает HTML элемент созданный из разметки.
   * @return {HTMLElement}
   */
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  /**
   * Удаляет ссылку на элемент в компоненте
   * @return {void}
   */
  removeElement() {
    this._element = null;
  }

  shake() {
    this.getElement().classList.add(SHAKE_CLASS);
    setTimeout(() => this.getElement().classList.remove(SHAKE_CLASS), SHAKE_ANIMATION_TIMEOUT);
  }
}
