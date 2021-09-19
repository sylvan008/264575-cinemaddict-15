import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import CommentsView from '../view/comments.js';
import NewCommentView from '../view/new-comment.js';
import {remove, render, replace} from '../utils/render.js';
import {getId, isEscapeKey} from '../utils/common.js';
import {FilterTypes, UpdateType, UserAction} from '../utils/const.js';
import {getDateNow} from '../utils/date.js';

const START_SCROLL = 0;
const HIDE_OVERFLOW = 'hide-overflow';
const Mode = {
  OPEN: 'open',
  DEFAULT: 'default',
};

/**
 * Create new film card
 * @class
 * @param {HTMLElement} cardListContainer
 * @param {function} changeData
 * @param {function} changeMode
 */
export default class Movie {
  constructor(cardListContainer, changeData, changeMode, getComments) {
    this._mode = Mode.DEFAULT;
    this._getComments = getComments;
    this._cardListContainer = cardListContainer;
    this._changeData = (...args) => {
      this._saveScroll();
      changeData(...args);
    };
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._popupComponent = null;
    this._scrollTop = START_SCROLL;

    this._handleFilmCardClick = this._handleFilmCardClick.bind(this);
    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleAddToFavoriteButtonClick = this._handleAddToFavoriteButtonClick.bind(this);
    this._handleAddToHistoryButtonClick = this._handleAddToHistoryButtonClick.bind(this);
    this._handleAddToWatchlistButtonClick = this._handleAddToWatchlistButtonClick.bind(this);
    this._handleCommentSubmit = this._handleCommentSubmit.bind(this);
    this._handleCommentDelete = this._handleCommentDelete.bind(this);
  }

  init(film, activeFilter) {
    const prevFilmCardComponent = this._filmCardComponent;
    this._film = film;
    this._comments = [];
    this._activeFilter = activeFilter;

    this._createFilmCardComponent(this._film);

    if (prevFilmCardComponent === null) {
      render(this._cardListContainer, this._filmCardComponent);
      return;
    }

    if (this._cardListContainer.contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this._mode === Mode.OPEN) {
      this._renderPopupComponent();
    }

    remove(prevFilmCardComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    if(this._popupComponent) {
      this.resetView();
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._popupComponent);
      this._popupComponent = null;
      document.removeEventListener('keydown', this._escKeyDownHandler);
      this._enableBodyOverflow();
      this._mode = Mode.DEFAULT;
      this._scrollTop = START_SCROLL;
    }
  }

  _createFilmCardComponent(film) {
    this._filmCardComponent = new FilmCardView(film);
    this._filmCardComponent.setCardOpenHandler(this._handleFilmCardClick);
    this._filmCardComponent.setAddFilmToFavoriteHandler(this._handleAddToFavoriteButtonClick);
    this._filmCardComponent.setAddFilmToHistoryHandler(this._handleAddToHistoryButtonClick);
    this._filmCardComponent.setAddFilmToWatchlistHandler(this._handleAddToWatchlistButtonClick);
  }

  _createFilmPopupComponent(film) {
    this._popupComponent = new PopupView(film);

    this._popupComponent.setCloseHandler(this._handlePopupCloseButtonClick);
    this._popupComponent.setAddFilmToFavoriteHandler(this._handleAddToFavoriteButtonClick);
    this._popupComponent.setAddFilmToHistoryHandler(this._handleAddToHistoryButtonClick);
    this._popupComponent.setAddFilmToWatchlistHandler(this._handleAddToWatchlistButtonClick);

    this._getComments(this._film.filmInfo.id)
      .then((comments) => {
        this._comments = comments;
        this._renderPopupComments(this._comments);
        this._renderNewComment(this._popupComponent.getElement().querySelector('.film-details__inner'));
      });
  }

  _disableBodyOverflow() {
    document.body.classList.add(HIDE_OVERFLOW);
  }

  _enableBodyOverflow() {
    document.body.classList.remove(HIDE_OVERFLOW);
  }

  _escKeyDownHandler(evt) {
    if (!isEscapeKey(evt)) {
      return;
    }
    this.resetView();
  }

  _handleFilmCardClick() {
    this._changeMode();
    this._mode = Mode.OPEN;
    this._renderPopupComponent();
  }

  _handlePopupCloseButtonClick() {
    this.resetView();
  }

  _handleAddToHistoryButtonClick() {
    const userDetails = {...this._film.userDetails};
    userDetails.alreadyWatched = !userDetails.alreadyWatched;

    this._changeData(
      UserAction.UPDATE_FILM,
      this._setCurrentTypeUpdate(FilterTypes.HISTORY),
      Object.assign({}, this._film, {userDetails}),
    );
  }

  _handleAddToWatchlistButtonClick() {
    const userDetails = {...this._film.userDetails};
    userDetails.watchlist = !userDetails.watchlist;

    this._changeData(
      UserAction.UPDATE_FILM,
      this._setCurrentTypeUpdate(FilterTypes.WATCHLIST),
      Object.assign({}, this._film, {userDetails}),
    );
  }

  _handleAddToFavoriteButtonClick() {
    const userDetails = {...this._film.userDetails};
    userDetails.favorite = !userDetails.favorite;

    this._changeData(
      UserAction.UPDATE_FILM,
      this._setCurrentTypeUpdate(FilterTypes.FAVORITES),
      Object.assign({}, this._film, {userDetails}),
    );
  }

  _handleCommentDelete(commentId) {
    const comments = this._film.comments.filter((id) => id !== commentId);
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      commentId,
    );
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign({}, this._film, {comments}),
    );
  }

  _handleCommentSubmit(newComment) {
    const comment = Object.assign({}, newComment, {
      id: getId(),
      date: getDateNow(),
      author: 'Keks', // TODO Вставить имя пользователя
    });
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      comment,
    );
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.PATCH,
      Object.assign({}, this._film, {
        comments: [
          ...this._film.comments,
          comment.id,
        ],
      }),
    );
  }

  _renderPopupComponent() {
    const prevElement = this._popupComponent;
    this._createFilmPopupComponent(this._film);

    if (prevElement !== null) {
      replace(this._popupComponent, prevElement);
      remove(prevElement);
    } else {
      render(document.body, this._popupComponent);
    }

    this._popupComponent.getElement().scrollTop = this._scrollTop;
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._disableBodyOverflow();
  }

  _renderPopupComments(comments) {
    const filmDetailBottomContainer = this._popupComponent.getElement()
      .querySelector('.film-details__bottom-container');

    this._popupComments = new CommentsView(comments);
    this._popupComments.setCommentDeleteHandler(this._handleCommentDelete);
    render(filmDetailBottomContainer, this._popupComments);
  }

  _renderNewComment(formElement) {
    this._newCommentComponent = new NewCommentView(formElement);
    this._newCommentComponent.setFormSubmitHandler(this._handleCommentSubmit);
    const commentsContainer = formElement.querySelector('.film-details__comments-wrap');
    render(commentsContainer, this._newCommentComponent);
  }

  _setCurrentTypeUpdate(filterType) {
    return this._activeFilter === filterType ? UpdateType.MINOR : UpdateType.PATCH;
  }

  _saveScroll() {
    if (this._mode === Mode.OPEN && this._popupComponent) {
      this._scrollTop = this._popupComponent.getElement().scrollTop;
    }
  }
}
