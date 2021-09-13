import AbstractComponent from '../abstract-component.js';
import {UpdateType} from '../utils/const.js';

const NAVIGATION_ACTIVE_CLASS = 'main-navigation__item--active';

const CallbackTypes = {
  CHANGE_FILTER: 'CHANGE_FILTER',
};

const createNavigationItem = (navItem, activeFilter) => {
  const {type, text, count = null} = navItem;
  const activeClass = activeFilter === type ? NAVIGATION_ACTIVE_CLASS : '';

  return `<a href="#${type}" class="main-navigation__item ${activeClass}" data-filter="${type}">
      ${text}
      ${count ? `<span class="main-navigation__item-count">${count}</span>` : ''}
    </a>
  `;
};

/**
 * @param {{name: number}} statistics
 * @return {string} HTML template
 */
const createNavigationTemplate = (activeFilter, filters) =>
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filters.map((filter) => createNavigationItem(filter, activeFilter)).join('')}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;

export default class MainNavigation extends AbstractComponent {
  /**
   * @param {{name: number}} statistics
   */
  constructor(activeFilter, filters) {
    super();
    this._filters = filters;
    this._activeFilter = activeFilter;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return createNavigationTemplate(this._activeFilter, this._filters);
  }

  setFilterChangeHandler(callback) {
    this._callback[CallbackTypes.CHANGE_FILTER] = callback;
    this.getElement()
      .querySelector('.main-navigation__items')
      .addEventListener('click', this._filterChangeHandler);
  }

  _filterChangeHandler(evt) {
    if (evt.target.closest('.main-navigation__item')) {
      evt.preventDefault();
      this._callback[CallbackTypes.CHANGE_FILTER](UpdateType.MAJOR, evt.target.dataset.filter);
    }
  }
}
