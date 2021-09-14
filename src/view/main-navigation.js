import AbstractComponent from '../abstract-component.js';
import {MenuTypes, UpdateType} from '../utils/const.js';

const NAVIGATION_ACTIVE_CLASS = 'main-navigation__item--active';

const CallbackTypes = {
  CHANGE_FILTER: 'CHANGE_FILTER',
  SWITCH_PAGE: 'SWITCH_PAGE',
};

const createNavigationItem = (navItem, activeFilter, menuType) => {
  const {type, text, count = null} = navItem;
  const activeClass = (menuType === MenuTypes.BOARD && activeFilter === type) ? NAVIGATION_ACTIVE_CLASS : '';

  return `<a href="#${type}" class="main-navigation__item ${activeClass}" data-filter="${type}" data-menu-type="${MenuTypes.BOARD}">
      ${text}
      ${count ? `<span class="main-navigation__item-count">${count}</span>` : ''}
    </a>
  `;
};

/**
 * @param {{name: number}} statistics
 * @return {string} HTML template
 */
const createNavigationTemplate = (activeFilter, filters, menuType) =>
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filters.map((filter) => createNavigationItem(filter, activeFilter, menuType)).join('')}
    </div>
    <a href="#stats"
        class="main-navigation__additional ${menuType === MenuTypes.STATISTICS ? NAVIGATION_ACTIVE_CLASS : ''}"
        data-menu-type="${MenuTypes.STATISTICS}"
    >
      Stats
    </a>
  </nav>`;

export default class MainNavigation extends AbstractComponent {
  /**
   * @param {{name: number}} statistics
   */
  constructor(activeFilter, filters, menuType) {
    super();
    this._filters = filters;
    this._activeFilter = activeFilter;
    this._menuType = menuType;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return createNavigationTemplate(this._activeFilter, this._filters, this._menuType);
  }

  setFilterChangeHandler(callback) {
    this._callback[CallbackTypes.CHANGE_FILTER] = callback;
    this.getElement()
      .querySelector('.main-navigation__items')
      .addEventListener('click', this._filterChangeHandler);
  }

  setMenuClickHandler(callback) {
    this._callback[CallbackTypes.SWITCH_PAGE] = callback;
    this.getElement()
      .addEventListener('click', this._menuClickHandler);
  }

  _filterChangeHandler(evt) {
    if (evt.target.closest('.main-navigation__item')) {
      evt.preventDefault();
      this._callback[CallbackTypes.CHANGE_FILTER](UpdateType.MAJOR, evt.target.dataset.filter);
    }
  }

  _menuClickHandler(evt) {
    if (evt.target.closest('.main-navigation__item') || evt.target.closest('.main-navigation__additional')) {
      evt.preventDefault();
      this._callback[CallbackTypes.SWITCH_PAGE](evt.target.dataset.menuType);
    }
  }
}
