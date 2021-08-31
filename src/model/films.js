import AbstractObserver from '../utils/abstract-observer.js';

export default class Films extends AbstractObserver{
  constructor() {
    super();
    this._films = [];
  }

  set films(filmsList) {
    this._films = filmsList.slice();
  }

  get films() {
    return this._films;
  }
}
