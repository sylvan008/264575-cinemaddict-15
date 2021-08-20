import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import CommentsView from '../view/comments.js';
import NewCommentView from '../view/new-comment.js';
import {remove, render, replace} from '../utils/render.js';
import {isEscapeKey} from '../utils/common.js';

const HIDE_OVERFLOW = 'hide-overflow';

export default class Movie {
  constructor(cardListContainer) {
    this._cardListContainer = cardListContainer;

    this._filmCardComponent = null;
    this._popupComponent = null;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(film, comments) {
    const prevFilmCardComponent = this._filmCardComponent;

    this._film = film;
    this._comments = comments;

    this._filmCardComponent = new FilmCardView(film);
    this._filmCardComponent.setCardOpenHandler(this._handleFilmCardClick);

    if (prevFilmCardComponent === null) {
      render(this._cardListContainer, this._filmCardComponent);
      return;
    }

    if (this._cardListContainer.getElement().contains(prevFilmCardComponent.getElement())) {
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

  _getFilmComments(film) {
    return film.comments.map((movieCommentId) => this._comments.find(({id}) => id === movieCommentId));
  }

  _handleFilmCardClick() {
    this._popupComponent = new PopupView(this._film);

    this._renderPopupComments(this._getFilmComments(this._film));
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
