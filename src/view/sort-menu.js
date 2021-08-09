import {SortTypes} from '../utils/const.js';

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

const createSortItem = ({text, isActive}) => {
  const activeClass = isActive ? ITEM_ACTIVE_CLASS : '';
  return `<li><a href="#" class="sort__button ${activeClass}">${text}</a></li>`;
};

export const createSortMenu = () => `
  <ul class="sort">
    ${sortItems.map(createSortItem).join('')}
  </ul>
`;
