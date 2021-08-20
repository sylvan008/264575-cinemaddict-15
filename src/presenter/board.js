import Movie from './movie.js';
import FilmsBoard from '../view/films-board.js';
import FilmListView from '../view/film-list.js';
import MainNavigation from '../view/main-navigation.js';
import NoFilmView from '../view/no-film.js';
import ShowMoreButtonView from '../view/show-more.js';
import SortMenu from '../view/sort-menu.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {FilmListTypes, NavigationTypes} from '../utils/const.js';
import {sortFilmByComments, sortFilmByRating, SortTypes} from '../utils/sort.js';

const CARDS_LOAD_STEP = 5;
const CARDS_EXTRA_LOAD_STEP = 2;

const defaultStatistics = {
  [NavigationTypes.HISTORY]: 0,
  [NavigationTypes.WATCHLIST]: 0,
  [NavigationTypes.FAVORITES]: 0,
};

export class Board {
  constructor(boardContainer) {
    this._renderedCardCount = CARDS_LOAD_STEP;
    this._films = [];
    this.commets = [];
    this._userStatistics = defaultStatistics;
    this._boardContainer = boardContainer;

    this._handleShowMoreButtonCLick = this._handleShowMoreButtonCLick.bind(this);

    this._boardComponent = new FilmsBoard();
    this._sortMenuComponent = new SortMenu();
    this._showMoreButtonComponent = new ShowMoreButtonView();
  }

  init(filmsList, commentsList) {
    this._films = filmsList.slice();
    this._comments = commentsList.slice();
    this._topFilms = this._films.slice().sort(sortFilmByRating);
    this._commentsFilms = this._films.slice().sort(sortFilmByComments);
    this._countUserStatistics();

    this._mainNavigationComponent = new MainNavigation(this._userStatistics);
    this._filmsBoardComponent = new FilmsBoard();
    this._allFilmListComponent = new FilmListView(FilmListTypes.ALL_MOVIES);

    this._renderBoard();
  }

  _countStatistic(filmsList, propertyName) {
    return filmsList.reduce((acc, {userDetails}) => acc + Number(userDetails[propertyName]), 0);
  }

  _countUserStatistics() {
    this._userStatistics[NavigationTypes.WATCHLIST] = this._countStatistic(this._films, 'watchlist');
    this._userStatistics[NavigationTypes.FAVORITES] = this._countStatistic(this._films, 'favorite');
    this._userStatistics[NavigationTypes.HISTORY] = this._countStatistic(this._films, 'alreadyWatched');
  }

  _handleShowMoreButtonCLick() {
    const nextCards = Math.min(this._films.length, this._renderedCardCount + CARDS_LOAD_STEP);
    this._renderCards(this._allFilmListComponent, this._films, this._renderedCardCount, nextCards);
    this._renderedCardCount = nextCards;
    if (this._renderedCardCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderAllFilmList(from, to) {
    render(this._filmsBoardComponent, this._allFilmListComponent);
    this._renderCards(this._allFilmListComponent, this._films, from, to);
    if(this._films.length > CARDS_LOAD_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderCommentedFilmList(from, to) {
    const sortedFilms = this._sortFilms(SortTypes.COMMENTS);
    if (!sortedFilms.length) {
      return;
    }
    this._commentedFilmListComponent = new FilmListView(FilmListTypes.COMMENTED_MOVIES);
    render(this._filmsBoardComponent, this._commentedFilmListComponent);
    this._renderCards(this._commentedFilmListComponent, sortedFilms, from, to);
  }

  _renderTopFilmList(from, to) {
    const sortedFilms = this._sortFilms(SortTypes.RATING);
    if (!sortedFilms.length) {
      return;
    }
    this._topFilmListComponent = new FilmListView(FilmListTypes.TOP_MOVIES);
    render(this._filmsBoardComponent, this._topFilmListComponent);
    this._renderCards(this._topFilmListComponent, sortedFilms, from, to);
  }

  _renderBoard() {
    render(this._boardContainer, this._boardComponent);

    this._renderMainNavigation();

    if (!this._films.length) {
      render(this._boardComponent, new NoFilmView());
      return;
    }
    this._renderSortMenu();
    this._renderFilmsBoard();
  }

  _renderCard(container, film) {
    const MoviePresenter = new Movie(container);
    MoviePresenter.init(film, this._comments);
  }

  _renderCards(listComponent, filmsList, from, to) {
    const container = listComponent.getElement().querySelector('.films-list__container');
    filmsList.slice(from, to)
      .forEach((film) => {
        this._renderCard(container, film);
      });
  }

  _renderFilmsBoard() {
    render(this._boardComponent, this._filmsBoardComponent);

    this._renderAllFilmList(0, CARDS_LOAD_STEP);
    this._renderCommentedFilmList(0, CARDS_EXTRA_LOAD_STEP);
    this._renderTopFilmList(0, CARDS_EXTRA_LOAD_STEP);
  }

  _renderMainNavigation() {
    render(this._boardComponent, this._mainNavigationComponent);
  }

  _renderNoFilms() {
    render(this._filmsBoardComponent, new NoFilmView(), RenderPosition.AFTERBEGIN);
  }

  _renderSortMenu() {
    render(this._boardComponent, this._sortMenuComponent);
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
    }
  }
}
