const NAVIGATION_ACTIVE_CLASS = 'main-navigation__item--active';

const createItemCount = (count) => `<span class="main-navigation__item-count">${count}</span>`;

const createNavigationItem = ({type, link, text, isActive, isCalculated}, navigationStatistics) => {
  const activeClass = isActive ? NAVIGATION_ACTIVE_CLASS : '';
  const countTemplate = isCalculated ? createItemCount(navigationStatistics[type]) : '';
  return `<a href="${link}" class="main-navigation__item ${activeClass}">${text} ${countTemplate}</a>`;
};

export const createMainNavigation = ({navigationItems, navigationStatistics}) => {
  const navigationItemsTemplate = navigationItems
    .map((navItem) => createNavigationItem(navItem, navigationStatistics))
    .join('');
  return `
    <nav class="main-navigation">
      <div class="main-navigation__items">
        ${navigationItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
`;
};
