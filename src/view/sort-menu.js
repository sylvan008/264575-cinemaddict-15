import {SortTypes} from '../utils/const.js';
import AbstractComponent from '../abstract-component.js';

const ITEM_ACTIVE_CLASS = 'sort__button--active';
const sortItems = [
  {
    type: SortTypes.DEFAULT,
    text: 'Sort by default',
    isActive: true,
  },
  {
    type: SortTypes.DATE,
    text: 'Sort by date',
    isActive: false,
  },
  {
    type: SortTypes.RATING,
    text: 'Sort by rating',
    isActive: false,
  },
];

const createSortMenuTemplate = () =>
  `<ul class="sort">
    ${sortItems.map(({text, isActive}) =>
    `<li><a href="#" class="sort__button ${isActive ? ITEM_ACTIVE_CLASS : ''}">${text}</a></li>`,
  ).join('')}</ul>`;

export default class SortMenu extends AbstractComponent {
  /**
   * @return {string}
   */
  getTemplate() {
    return createSortMenuTemplate();
  }
}
