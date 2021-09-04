import AbstractObserver from '../utils/abstract-observer.js';
import {NavigationTypes} from '../utils/const.js';

export default class Filters  extends AbstractObserver {
  constructor() {
    super();
    this._filter = NavigationTypes.DEFAULT;
  }

  get filter() {
    return this._filter;
  }

  set filter(activeFilter) {
    this._filter = activeFilter;
  }

  updateFilter(updateType, update) {
    if (this._filter === update) {
      return;
    }
    this._filter = update;
    this._notify(updateType, update);
  }
}
