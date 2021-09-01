import AbstractComponent from './abstract-component.js';

export default class SmartComponent extends AbstractComponent {
  constructor() {
    super();
    this._data = {};
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign({}, this._data, update);

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);
    this.restoreHandlers();
  }
}
