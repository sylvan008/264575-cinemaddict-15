import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import CommentsView from '../view/comments.js';
import NewCommentView from '../view/new-comment.js';
import {remove, render, replace} from '../utils/render.js';
import {isEscapeKey} from '../utils/common.js';

const HIDE_OVERFLOW = 'hide-overflow';

/**
 * Create new film card
 * @class
 * @param {HTMLElement} cardListContainer
 * @param {function} changeData
 */
export default class Movie {
  constructor(cardListContainer, changeData) {
    this._cardListContainer = cardListContainer;
    this._changeData = changeData;

    this._filmCardComponent = null;
    this._popupComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleAddToFavoriteButtonClick = this._handleAddToFavoriteButtonClick.bind(this);
    this._handleAddToHistoryButtonClick = this._handleAddToHistoryButtonClick.bind(this);
    this._handleAddToWatchlistButtonClick = this._handleAddToWatchlistButtonClick.bind(this);
  }

  init(film, comments) {
    const prevFilmCardComponent = this._filmCardComponent;

    this._film = film;
    this._comments = comments;

    this._filmCardComponent = new FilmCardView(this._film);
    this._filmCardComponent.setCardOpenHandler(this._handleFilmCardClick);
    this._filmCardComponent.setAddFilmToFavoriteHandler(this._handleAddToFavoriteButtonClick);
    this._filmCardComponent.setAddFilmToHistoryHandler(this._handleAddToHistoryButtonClick);
    this._filmCardComponent.setAddFilmToWatchlistHandler(this._handleAddToWatchlistButtonClick);

    if (prevFilmCardComponent === null) {
      render(this._cardListContainer, this._filmCardComponent);
      return;
    }

    if (this._cardListContainer.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  _escKeyDownHandler(evt) {
    if (!isEscapeKey(evt)) {
      return;
    }
    this._handlePopupCloseButtonClick();
  }

  _getFilmComments() {
    return this._film.comments.map((movieCommentId) => this._comments.find(({id}) => id === movieCommentId));
  }

  _handleFilmCardClick() {
    this._popupComponent = new PopupView(this._film);

    this._renderPopupComments(this._getFilmComments());
    this._renderNewComment();
    this._popupComponent.setCloseHandler(this._handlePopupCloseButtonClick);
    render(this._filmCardComponent, this._popupComponent);

    document.addEventListener('keydown', this._escKeyDownHandler);
    document.body.classList.add(HIDE_OVERFLOW);
  }

  _handlePopupCloseButtonClick() {
    remove(this._popupComponent);
    this._popupComponent = null;
    document.removeEventListener('keydown', this._escKeyDownHandler);
    document.body.classList.remove(HIDE_OVERFLOW);
  }

  _handleAddToHistoryButtonClick() {
    const userDetails = {...this._film.userDetails};
    userDetails.alreadyWatched = !userDetails.alreadyWatched;

    this._changeData(Object.assign({}, this._film, {userDetails}));
  }

  _handleAddToWatchlistButtonClick() {
    const userDetails = {...this._film.userDetails};
    userDetails.watchlist = !userDetails.watchlist;

    this._changeData(Object.assign({}, this._film, {userDetails}));
  }

  _handleAddToFavoriteButtonClick() {
    const userDetails = {...this._film.userDetails};
    userDetails.favorite = !userDetails.favorite;

    this._changeData(Object.assign({}, this._film, {userDetails}));
  }

  _renderPopupComments(comments) {
    const filmDetailBottomContainer = this._popupComponent.getElement()
      .querySelector('.film-details__bottom-container');
    render(filmDetailBottomContainer, new CommentsView(comments));
  }

  _renderNewComment() {
    const commentsContainer = this._popupComponent.getElement()
      .querySelector('.film-details__comments-wrap');
    render(commentsContainer, new NewCommentView());
  }
}
