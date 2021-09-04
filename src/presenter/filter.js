import MainNavigation from '../view/main-navigation.js';
import {render, RenderPosition} from '../utils/render.js';
import {FilmControlTypes as StatisticTypes, NavigationTypes} from '../utils/const.js';

const defaultStatistics = {
  [NavigationTypes.HISTORY]: 0,
  [NavigationTypes.WATCHLIST]: 0,
  [NavigationTypes.FAVORITES]: 0,
};

export default class Filter {
  constructor(filterContainer, filtersModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filtersModel = filtersModel;
    this._filmsModel = filmsModel;

    this._userStatistics = defaultStatistics;

    this._filtersComponent = null;
  }

  init() {
    this._countUserStatistics();
    this._renderFilters();
  }

  _countStatistic(filmsList, propertyName) {
    return filmsList.reduce((acc, {userDetails}) => acc + Number(userDetails[propertyName]), 0);
  }

  _countUserStatistics() {
    this._userStatistics[NavigationTypes.WATCHLIST] = this._countStatistic(this._getFilms(), StatisticTypes.WATCHLIST);
    this._userStatistics[NavigationTypes.FAVORITES] = this._countStatistic(this._getFilms(), StatisticTypes.FAVORITE);
    this._userStatistics[NavigationTypes.HISTORY] = this._countStatistic(this._getFilms(), StatisticTypes.WATCHED);
  }

  _getFilter() {
    return this._filtersModel.filter;
  }

  _getFilms() {
    return this._filmsModel.films;
  }

  _renderFilters() {
    if (this._filtersComponent !== null) {
      this._filtersComponent = null;
    }
    this._filtersComponent = new MainNavigation(this._getFilter(), this._userStatistics);
    render(this._filterContainer, this._filtersComponent, RenderPosition.AFTERBEGIN);
  }
}
