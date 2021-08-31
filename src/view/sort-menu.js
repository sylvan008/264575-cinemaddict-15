import {SortTypes} from '../utils/sort.js';
import AbstractComponent from '../abstract-component.js';

const ITEM_ACTIVE_CLASS = 'sort__button--active';
const sortItems = [
  {
    type: SortTypes.DEFAULT,
    text: 'Sort by default',
  },
  {
    type: SortTypes.DATE,
    text: 'Sort by date',
  },
  {
    type: SortTypes.RATING,
    text: 'Sort by rating',
  },
];
const CallbackTypes = {
  SORT_CHANGE: 'sortChange',
};

const createSortMenuTemplate = (currentSortType) =>
  `<ul class="sort">
    ${sortItems.map(({type, text}) =>
    `<li>
      <a href="#" class="sort__button ${type === currentSortType ? ITEM_ACTIVE_CLASS : ''}" data-sort-type="${type}">
        ${text}
      </a>
    </li>`,
  ).join('')}</ul>`;

export default class SortMenu extends AbstractComponent {
  constructor(sortType) {
    super();
    this._currentSortType = sortType;
    this._sortMenuClickHandler = this._sortMenuClickHandler.bind(this);
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return createSortMenuTemplate(this._currentSortType);
  }

  _sortMenuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.closest('a') === null) {
      return;
    }
    this._callback[CallbackTypes.SORT_CHANGE](evt.target.dataset.sortType);
  }

  setSortChangeHandler(callback) {
    this._callback[CallbackTypes.SORT_CHANGE] = callback;
    this.getElement().addEventListener('click', this._sortMenuClickHandler);
  }
}
