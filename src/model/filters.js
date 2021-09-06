import AbstractObserver from '../utils/abstract-observer.js';
import {FilterTypes} from '../utils/const.js';

export default class Filters  extends AbstractObserver {
  constructor() {
    super();
    this._filter = FilterTypes.ALL;
  }

  get activeFilter() {
    return this._filter;
  }

  updateFilter(updateType, update) {
    if (this._filter === update) {
      return;
    }
    this._filter = update;
    this._notify(updateType, update);
  }
}
