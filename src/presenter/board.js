import Movie from './movie.js';
import FilmsBoard from '../view/films-board.js';
import FilmListView from '../view/film-list.js';
import MainNavigation from '../view/main-navigation.js';
import NoFilmView from '../view/no-film.js';
import ShowMoreButtonView from '../view/show-more.js';
import SortMenu from '../view/sort-menu.js';
import UserProfile from '../view/user-profile.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {FilmListTypes, NavigationTypes, UpdateType, UserAction} from '../utils/const.js';
import {sortFilmByComments, sortFilmByDate, sortFilmByRating, SortTypes} from '../utils/sort.js';

const CARDS_LOAD_STEP = 5;
const CARDS_EXTRA_LOAD_STEP = 2;
const PresenterListTypes = {
  COMMON: 'filmPresenter',
  RATING: 'filmRatingPresenter',
  COMMENTED: 'filmCommentedPresenter',
};
const StatisticTypes = {
  ALREADY_WATCHED: 'alreadyWatched',
  WATCHLIST: 'watchlist',
  FAVORITE: 'favorite',
};

const defaultStatistics = {
  [NavigationTypes.HISTORY]: 0,
  [NavigationTypes.WATCHLIST]: 0,
  [NavigationTypes.FAVORITES]: 0,
};

export class Board {
  constructor(boardContainer, filmsModel, commentsModel) {
    this._boardContainer = boardContainer;
    this._headerElement = boardContainer.querySelector('.header');
    this._mainElement = boardContainer.querySelector('.main');

    this._renderedCardCount = CARDS_LOAD_STEP;
    this._currentSortType = SortTypes.DEFAULT;

    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;

    this._presenters = {
      [PresenterListTypes.COMMON]: new Map(),
      [PresenterListTypes.RATING]: new Map(),
      [PresenterListTypes.COMMENTED]: new Map(),
    };
    this._userStatistics = defaultStatistics;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonCLick = this._handleShowMoreButtonCLick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);

    this._userProfileComponent = null;
    this._mainNavigationComponent = null;
    this._sortMenuComponent = null;
    this._showMoreButtonComponent = null;

    this._filmsBoardComponent = new FilmsBoard();
  }

  init() {
    this._countUserStatistics(this._getFilms());

    this._mainNavigationComponent = new MainNavigation(this._userStatistics);
    this._allFilmListComponent = new FilmListView(FilmListTypes.ALL_MOVIES);
    this._commentedFilmListComponent = new FilmListView(FilmListTypes.COMMENTED_MOVIES);
    this._topFilmListComponent = new FilmListView(FilmListTypes.TOP_MOVIES);

    this._renderBoard();
  }

  _getFilms(sortType = SortTypes.DEFAULT) {
    switch (sortType) {
      case SortTypes.RATING:
        return this._filmsModel.films.slice().sort(sortFilmByRating);
      case SortTypes.COMMENTS:
        return this._filmsModel.films.slice().sort(sortFilmByComments);
      case SortTypes.DATE:
        return this._filmsModel.films.slice().sort(sortFilmByDate);
      default:
        return this._filmsModel.films;
    }
  }

  _getComments() {
    return this._commentsModel.comments;
  }

  _clearBoard() {
    remove(this._userProfileComponent);
    remove(this._mainNavigationComponent);
    this._clearFilmList();
  }

  _clearFilmList() {
    for (const presenterName in this._presenters) {
      this._presenters[presenterName].forEach((presenter) => presenter.destroy());
      this._presenters[presenterName].clear();
    }
    this._renderedCardCount = CARDS_LOAD_STEP;
    remove(this._showMoreButtonComponent);
    remove(this._sortMenuComponent);
  }

  _countStatistic(filmsList, propertyName) {
    return filmsList.reduce((acc, {userDetails}) => acc + Number(userDetails[propertyName]), 0);
  }

  _countUserStatistics(filmsList) {
    this._userStatistics[NavigationTypes.WATCHLIST] = this._countStatistic(filmsList, StatisticTypes.WATCHLIST);
    this._userStatistics[NavigationTypes.FAVORITES] = this._countStatistic(filmsList, StatisticTypes.FAVORITE);
    this._userStatistics[NavigationTypes.HISTORY] = this._countStatistic(filmsList, StatisticTypes.ALREADY_WATCHED);
  }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    // Вызывает обновление модели
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    console.log(updateType, data);
    // В зависимости от типа изменений, выбираем что делать
    // - обновить всю доску
    // - обновить список
    switch (updateType) {
      case UpdateType.MINOR:
        this._updatePresenters(data);
        break;
    }
  }

  _handleShowMoreButtonCLick() {
    const filmCount = this._getFilms().length;
    const nextCards = Math.min(filmCount, this._renderedCardCount + CARDS_LOAD_STEP);
    this._renderCards(
      this._presenters[PresenterListTypes.COMMON],
      this._allFilmListComponent,
      this._getFilms(this._currentSortType),
      this._renderedCardCount,
      nextCards,
    );
    this._renderedCardCount = nextCards;
    if (this._renderedCardCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleModeChange() {
    const resetFilmView = (presenter) => presenter.resetView();
    Object.values(this._presenters).forEach((collection) => collection.forEach(resetFilmView));
  }

  _handleSortTypeChange(sortType) {
    if (sortType === this._currentSortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmList();
    this._renderAllFilmList(0, this._renderedCardCount);
    this._renderCommentedFilmList(0, CARDS_EXTRA_LOAD_STEP);
    this._renderTopFilmList(0, CARDS_EXTRA_LOAD_STEP);
    this._renderSortMenu();
  }

  _renderAllFilmList(from, to) {
    const filmCount = this._getFilms().length;
    render(this._filmsBoardComponent, this._allFilmListComponent);
    this._renderCards(
      this._presenters[PresenterListTypes.COMMON],
      this._allFilmListComponent,
      this._getFilms(this._currentSortType),
      from,
      to,
    );
    if (filmCount > this._renderedCardCount) {
      this._renderShowMoreButton();
    }
  }

  _renderCommentedFilmList(from, to) {
    const sortedFilms = this._getFilms(SortTypes.COMMENTS);
    if (!sortedFilms.length) {
      return;
    }
    render(this._filmsBoardComponent, this._commentedFilmListComponent);
    this._renderCards(
      this._presenters[PresenterListTypes.COMMENTED],
      this._commentedFilmListComponent,
      sortedFilms,
      from,
      to,
    );
  }

  _renderTopFilmList(from, to) {
    const sortedFilms = this._getFilms(SortTypes.RATING);
    if (!sortedFilms.length) {
      return;
    }
    render(this._filmsBoardComponent, this._topFilmListComponent);
    this._renderCards(
      this._presenters[PresenterListTypes.RATING],
      this._topFilmListComponent,
      sortedFilms,
      from,
      to,
    );
  }

  _renderBoard() {
    this._renderUserProfile();
    this._renderMainNavigation();
    this._renderFilmsBoard();

    if (!this._getFilms().length) {
      this._renderNoFilms();
      return;
    }

    this._renderSortMenu();
    this._renderAllFilmList(0, this._renderedCardCount);
    this._renderCommentedFilmList(0, CARDS_EXTRA_LOAD_STEP);
    this._renderTopFilmList(0, CARDS_EXTRA_LOAD_STEP);
  }

  _renderCard(presenterCollection, container, film) {
    const MoviePresenter = new Movie(container, this._handleViewAction, this._handleModeChange);
    MoviePresenter.init(film, this._getComments());
    presenterCollection.set(film.filmInfo.id, MoviePresenter);
  }

  _renderCards(presenterCollection, listComponent, filmsList, from, to) {
    const container = listComponent.getElement().querySelector('.films-list__container');
    filmsList.slice(from, to)
      .forEach((film) => {
        this._renderCard(presenterCollection, container, film);
      });
  }

  _renderFilmsBoard() {
    render(this._mainElement, this._filmsBoardComponent);
  }

  _renderMainNavigation() {
    render(this._mainElement, this._mainNavigationComponent);
  }

  _renderNoFilms() {
    render(this._filmsBoardComponent, new NoFilmView(), RenderPosition.AFTERBEGIN);
  }

  _renderSortMenu() {
    if (this._sortMenuComponent !== null) {
      this._sortMenuComponent = null;
    }

    this._sortMenuComponent = new SortMenu(this._currentSortType);
    this._sortMenuComponent.setSortChangeHandler(this._handleSortTypeChange);

    render(this._mainNavigationComponent, this._sortMenuComponent, RenderPosition.AFTEREND);
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonCLick);

    render(this._allFilmListComponent, this._showMoreButtonComponent);
  }

  _renderUserProfile() {
    render(this._headerElement, new UserProfile(this._userStatistics[NavigationTypes.HISTORY]));
  }

  _updatePresenters(data) {
    Object.values(this._presenters).forEach((collection) => {
      const film = collection.get(data.filmInfo.id);
      if (film) {
        film.init(data, this._getComments());
      }
    });
  }
}
