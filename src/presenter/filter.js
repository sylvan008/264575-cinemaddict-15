import MainNavigation from '../view/main-navigation.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterTypes, MenuTypes} from '../utils/const.js';

export default class Filter {
  constructor(filterContainer, filtersModel, filmsModel, menuClickHandler) {
    this._filterContainer = filterContainer;
    this._filtersModel = filtersModel;
    this._filmsModel = filmsModel;
    this._menuClickHandler = menuClickHandler;
    this._menuType = MenuTypes.BOARD;

    this._filtersComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelAction = this._handleModelAction.bind(this);
    this._wrapMenuClickHandler = this._wrapMenuClickHandler.bind(this);

    this._filtersModel.addObserver(this._handleModelAction);
    this._filmsModel.addObserver(this._handleModelAction);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filtersComponent;

    this._filtersComponent = new MainNavigation(this._filtersModel.activeFilter, filters, this._menuType);
    this._filtersComponent.setFilterChangeHandler(this._handleViewAction);
    this._filtersComponent.setMenuClickHandler(this._wrapMenuClickHandler);

    if (!prevFilterComponent) {
      render(this._filterContainer, this._filtersComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filtersComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    const films = this._filmsModel.films;

    return [
      {
        type: FilterTypes.ALL,
        text: 'All movies',
      },
      {
        type: FilterTypes.WATCHLIST,
        text: 'Watchlist',
        count: filter[FilterTypes.WATCHLIST](films).length,
      },
      {
        type: FilterTypes.HISTORY,
        text: 'History',
        count: filter[FilterTypes.HISTORY](films).length,
      },
      {
        type: FilterTypes.FAVORITES,
        text: 'Favorites',
        count: filter[FilterTypes.FAVORITES](films).length,
      },
    ];
  }

  _wrapMenuClickHandler(menuType) {
    if (this._menuType === menuType) {
      return;
    }
    this._menuType = menuType;
    this.init();
    this._menuClickHandler(menuType);
  }

  _handleViewAction(updateType, update) {
    this._filtersModel.updateFilter(updateType, update);
  }

  _handleModelAction() {
    this.init();
  }
}
