const ITEM_ACTIVE_CLASS = 'sort__button--active';

const createSortItem = ({text, isActive}) => {
  const activeClass = isActive ? ITEM_ACTIVE_CLASS : '';
  return `<li><a href="#" class="sort__button ${activeClass}">${text}</a></li>`;
};

export const createSortMenu = (sortItems) => {
  const sortItemsTemplate = sortItems.map(createSortItem).join('');
  return `
    <ul class="sort">
      ${sortItemsTemplate}
    </ul>
  `;
};
