import Movie from './movie.js';
import FilmsBoard from '../view/films-board.js';
import FilmListView from '../view/film-list.js';
import NoFilmView from '../view/no-film.js';
import ShowMoreButtonView from '../view/show-more.js';
import SortMenu from '../view/sort-menu.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {FilmListTypes, UpdateType, UserAction} from '../utils/const.js';
import {sortFilmByComments, sortFilmByDate, sortFilmByRating, SortTypes} from '../utils/sort.js';
import {filter} from '../utils/filter.js';

const CARDS_LOAD_STEP = 5;
const CARDS_EXTRA_LOAD_STEP = 2;
const PresenterListTypes = {
  COMMON: 'filmPresenter',
  RATING: 'filmRatingPresenter',
  COMMENTED: 'filmCommentedPresenter',
};

export class Board {
  constructor(boardContainer, filmsModel, commentsModel, filtersModel) {
    this._boardContainer = boardContainer;
    this._headerElement = boardContainer.querySelector('.header');
    this._mainElement = boardContainer.querySelector('.main');

    this._renderedCardCount = CARDS_LOAD_STEP;
    this._currentSortType = SortTypes.DEFAULT;

    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filtersModel = filtersModel;

    this._presenters = {
      [PresenterListTypes.COMMON]: new Map(),
      [PresenterListTypes.RATING]: new Map(),
      [PresenterListTypes.COMMENTED]: new Map(),
    };

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonCLick = this._handleShowMoreButtonCLick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);

    this._userProfileComponent = null;
    this._sortMenuComponent = null;
    this._showMoreButtonComponent = null;
    this._allFilmListComponen = null;
    this._commentedFilmListComponent = null;
    this._topFilmListComponent = null;

    this._filmsBoardComponent = new FilmsBoard();
  }

  init() {
    this._renderBoard();
  }

  _getFilms(sortType = SortTypes.DEFAULT) {
    this._filterType = this._filtersModel.activeFilter;
    const films = this._filmsModel.films;
    const filteredFilms = filter[this._filterType](films);

    switch (sortType) {
      case SortTypes.RATING:
        return filteredFilms.sort(sortFilmByRating);
      case SortTypes.COMMENTS:
        return filteredFilms.sort(sortFilmByComments);
      case SortTypes.DATE:
        return filteredFilms.sort(sortFilmByDate);
      default:
        return filteredFilms;
    }
  }

  _getComments() {
    return this._commentsModel.comments;
  }

  _clearBoard({resetRenderedCardCount = false, resetSort = false} = {}) {
    for (const presenterName in this._presenters) {
      this._presenters[presenterName].forEach((presenter) => presenter.destroy());
      this._presenters[presenterName].clear();
    }
    if (resetRenderedCardCount) {
      this._renderedCardCount = CARDS_LOAD_STEP;
    }
    if (resetSort) {
      this._currentSortType = SortTypes.DEFAULT;
    }
    if (this._noFilmsComponent) {
      remove(this._noFilmsComponent);
    }
    remove(this._allFilmListComponent);
    remove(this._topFilmListComponent);
    remove(this._commentedFilmListComponent);
    remove(this._showMoreButtonComponent);
    remove(this._sortMenuComponent);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType) {
    // В зависимости от типа изменений, выбираем что делать
    // - обновить всю доску
    // - обновить список
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedCardCount: true, resetSort: true});
        this._renderBoard();
        break;
    }
  }

  _handleShowMoreButtonCLick() {
    const films = this._getFilms(this._currentSortType);
    const filmCount = films.length;
    const nextCards = Math.min(filmCount, this._renderedCardCount + CARDS_LOAD_STEP);
    this._renderCards(
      this._presenters[PresenterListTypes.COMMON],
      this._allFilmListComponent,
      films,
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
    this._clearBoard();
    this._renderAllFilmList(0, this._renderedCardCount);
    this._renderCommentedFilmList(0, CARDS_EXTRA_LOAD_STEP);
    this._renderTopFilmList(0, CARDS_EXTRA_LOAD_STEP);
    this._renderSortMenu();
  }

  _renderAllFilmList(from, to) {
    this._allFilmListComponent = new FilmListView(FilmListTypes.ALL_MOVIES);
    const films = this._getFilms(this._currentSortType);
    const filmCount = films.length;
    render(this._filmsBoardComponent, this._allFilmListComponent);
    this._renderCards(
      this._presenters[PresenterListTypes.COMMON],
      this._allFilmListComponent,
      films,
      from,
      to,
    );
    if (filmCount > this._renderedCardCount) {
      this._renderShowMoreButton();
    }
  }

  _renderCommentedFilmList(from, to) {
    this._commentedFilmListComponent = new FilmListView(FilmListTypes.COMMENTED_MOVIES);
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
    this._topFilmListComponent = new FilmListView(FilmListTypes.TOP_MOVIES);
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

  _renderNoFilms() {
    this._noFilmsComponent = new NoFilmView(this._filterType);
    render(this._filmsBoardComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSortMenu() {
    if (this._sortMenuComponent !== null) {
      this._sortMenuComponent = null;
    }

    this._sortMenuComponent = new SortMenu(this._currentSortType);
    this._sortMenuComponent.setSortChangeHandler(this._handleSortTypeChange);

    render(this._filmsBoardComponent, this._sortMenuComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonCLick);

    render(this._allFilmListComponent, this._showMoreButtonComponent);
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
