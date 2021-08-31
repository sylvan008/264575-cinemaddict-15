import Movie from './movie.js';
import FilmsBoard from '../view/films-board.js';
import FilmListView from '../view/film-list.js';
import MainNavigation from '../view/main-navigation.js';
import NoFilmView from '../view/no-film.js';
import ShowMoreButtonView from '../view/show-more.js';
import SortMenu from '../view/sort-menu.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {FilmListTypes, NavigationTypes} from '../utils/const.js';
import {sortFilmByComments, sortFilmByDate, sortFilmByRating, SortTypes} from '../utils/sort.js';
import {updateItem} from '../utils/common.js';

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
  constructor(boardContainer, filmsModel) {
    this._renderedCardCount = CARDS_LOAD_STEP;
    this._currentSortType = SortTypes.DEFAULT;
    this._filmsModel =filmsModel;
    this._presenters = {
      [PresenterListTypes.COMMON]: new Map(),
      [PresenterListTypes.RATING]: new Map(),
      [PresenterListTypes.COMMENTED]: new Map(),
    };
    this._userStatistics = defaultStatistics;
    this._boardContainer = boardContainer;

    this._handleShowMoreButtonCLick = this._handleShowMoreButtonCLick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._boardComponent = new FilmsBoard();
    this._showMoreButtonComponent = new ShowMoreButtonView();
  }

  init(filmsList, commentsList) {
    this._films = filmsList.slice();
    this._sourcedFilms = filmsList.slice();
    this._comments = commentsList.slice();
    this._countUserStatistics();

    this._mainNavigationComponent = new MainNavigation(this._userStatistics);
    this._filmsBoardComponent = new FilmsBoard();
    this._allFilmListComponent = new FilmListView(FilmListTypes.ALL_MOVIES);
    this._commentedFilmListComponent = new FilmListView(FilmListTypes.COMMENTED_MOVIES);
    this._topFilmListComponent = new FilmListView(FilmListTypes.TOP_MOVIES);

    this._renderBoard();
  }

  _getFilms() {
    return this._filmsModel.films;
  }

  _clearFilmList() {
    const destroyFilmPresenter = (presenter) => presenter.destroy();
    for (const presenterName in this._presenters) {
      this._presenters[presenterName].forEach(destroyFilmPresenter);
      this._presenters[presenterName].clear();
    }
    this._renderedCardCount = CARDS_LOAD_STEP;
    remove(this._showMoreButtonComponent);
    remove(this._sortMenuComponent);
  }

  _countStatistic(filmsList, propertyName) {
    return filmsList.reduce((acc, {userDetails}) => acc + Number(userDetails[propertyName]), 0);
  }

  _countUserStatistics() {
    this._userStatistics[NavigationTypes.WATCHLIST] = this._countStatistic(this._films, StatisticTypes.WATCHLIST);
    this._userStatistics[NavigationTypes.FAVORITES] = this._countStatistic(this._films, StatisticTypes.FAVORITE);
    this._userStatistics[NavigationTypes.HISTORY] = this._countStatistic(this._films, StatisticTypes.ALREADY_WATCHED);
  }

  _handleShowMoreButtonCLick() {
    const nextCards = Math.min(this._films.length, this._renderedCardCount + CARDS_LOAD_STEP);
    this._renderCards(
      this._presenters[PresenterListTypes.COMMON],
      this._allFilmListComponent,
      this._films,
      this._renderedCardCount,
      nextCards,
    );
    this._renderedCardCount = nextCards;
    if (this._renderedCardCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    Object.values(this._presenters).forEach((collection) => {
      const film = collection.get(updatedFilm.filmInfo.id);
      if (film) {
        film.init(updatedFilm, this._comments);
      }
    });
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
    this._films = this._sortFilms(sortType);
    this._clearFilmList();
    this._renderAllFilmList(0, this._renderedCardCount);
    this._renderCommentedFilmList(0, CARDS_EXTRA_LOAD_STEP);
    this._renderTopFilmList(0, CARDS_EXTRA_LOAD_STEP);
    this._renderSortMenu();
  }

  _renderAllFilmList(from, to) {
    render(this._filmsBoardComponent, this._allFilmListComponent);
    this._renderCards(
      this._presenters[PresenterListTypes.COMMON],
      this._allFilmListComponent,
      this._films,
      from,
      to,
    );
    if (this._films.length > CARDS_LOAD_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderCommentedFilmList(from, to) {
    const sortedFilms = this._sortFilms(SortTypes.COMMENTS);
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
    const sortedFilms = this._sortFilms(SortTypes.RATING);
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
    this._renderMainNavigation();
    this._renderSortMenu();

    if (!this._films.length) {
      render(this._boardContainer, new NoFilmView());
      return;
    }
    this._renderFilmsBoard();
  }

  _renderCard(presenterCollection, container, film) {
    const MoviePresenter = new Movie(container, this._handleFilmChange, this._handleModeChange);
    MoviePresenter.init(film, this._comments);
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
    render(this._boardContainer, this._filmsBoardComponent);

    this._renderAllFilmList(0, CARDS_LOAD_STEP);
    this._renderCommentedFilmList(0, CARDS_EXTRA_LOAD_STEP);
    this._renderTopFilmList(0, CARDS_EXTRA_LOAD_STEP);
  }

  _renderMainNavigation() {
    render(this._boardContainer, this._mainNavigationComponent);
  }

  _renderNoFilms() {
    render(this._boardContainer, new NoFilmView(), RenderPosition.AFTERBEGIN);
  }

  _renderSortMenu() {
    this._sortMenuComponent = new SortMenu(this._currentSortType);
    render(this._mainNavigationComponent, this._sortMenuComponent, RenderPosition.AFTEREND);
    this._sortMenuComponent.setSortChangeHandler(this._handleSortTypeChange);
  }

  _renderShowMoreButton() {
    render(this._allFilmListComponent, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonCLick);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortTypes.RATING:
        return this._films.slice().sort(sortFilmByRating);
      case SortTypes.COMMENTS:
        return this._films.slice().sort(sortFilmByComments);
      case SortTypes.DATE:
        return this._films.slice().sort(sortFilmByDate);
      default:
        return this._sourcedFilms.slice();
    }
  }
}
