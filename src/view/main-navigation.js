import AbstractComponent from '../abstract-component.js';
import {NavigationTypes} from '../utils/const.js';

const NAVIGATION_ACTIVE_CLASS = 'main-navigation__item--active';
const navigationItems = [
  {
    type: NavigationTypes.DEFAULT,
    link: `#${NavigationTypes.DEFAULT}`,
    text: 'All movies',
    isCalculated: false,
  },
  {
    type: NavigationTypes.WATCHLIST,
    link: `#${NavigationTypes.WATCHLIST}`,
    text: 'Watchlist',
    isCalculated: true,
  },
  {
    type: NavigationTypes.HISTORY,
    link: `#${NavigationTypes.HISTORY}`,
    text: 'History',
    isCalculated: true,
  },
  {
    type: NavigationTypes.FAVORITES,
    link: `#${NavigationTypes.FAVORITES}`,
    text: 'Favorites',
    isCalculated: true,
  },
];

const createItemCount = (count) => `<span class="main-navigation__item-count">${count}</span>`;

const createNavigationItem = (navItem, navigationStatistics, activeFilter) => {
  const {type, link, text, isCalculated} = navItem;
  const activeClass = activeFilter === type ? NAVIGATION_ACTIVE_CLASS : '';

  return `<a href="${link}" class="main-navigation__item ${activeClass}">
      ${text}
      ${isCalculated ? createItemCount(navigationStatistics[type]) : ''}
    </a>
  `;
};

/**
 * @param {{name: number}} statistics
 * @return {string} HTML template
 */
const createNavigationTemplate = (activeFilter, statistics) =>
  `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${navigationItems.map((navItem) => createNavigationItem(navItem, statistics, activeFilter)).join('')}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;

export default class MainNavigation extends AbstractComponent {
  /**
   * @param {{name: number}} statistics
   */
  constructor(activeFilter, statistics) {
    super();
    /**
     * @type {{name: number}}
     * @private
     */
    this._statistics = statistics;
    this._activeFilter = activeFilter;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return createNavigationTemplate(this._activeFilter, this._statistics);
  }
}
