import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import CommentsView from '../view/comments.js';
import NewCommentView from '../view/new-comment.js';
import {remove, render, replace} from '../utils/render.js';
import {isEscapeKey} from '../utils/common.js';
import {FilterTypes, UpdateType, UserAction} from '../utils/const.js';

const START_SCROLL = 0;
const HIDE_OVERFLOW = 'hide-overflow';
const Mode = {
  OPEN: 'open',
  DEFAULT: 'default',
};
export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING_DELETE: 'ABORTING_DELEtE',
  ABORTING_SAVE: 'ABORTING_SAVE',
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
    this._deleteCommentId = null;
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

  setViewState(mode) {
    if (this._popupComponent === null) {
      return;
    }
    switch (mode) {
      case State.SAVING:
        this._newCommentComponent.updateData({isSaving: true, isDisabled: true});
        break;
      case State.DELETING:
        remove(this._popupComments);
        this._renderPopupComments(this._comments, {isDisabled: true, isDeleting: true, deleteCommentId: this._deleteCommentId});
        break;
      case State.ABORTING_SAVE:
        this._newCommentComponent.updateData({isSaving: true, isDisabled: false});
        this._newCommentComponent.shake();
        break;
      case State.ABORTING_DELETE:
        remove(this._popupComments);
        this._renderPopupComments(this._comments);
        render(this._popupComments, this._newCommentComponent);
        this._popupComponent.shake();
        break;
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


    this._renderPopupComments(this._comments);
    this._renderNewComment(this._popupComponent.getElement().querySelector('.film-details__inner'));
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
    this._deleteCommentId = commentId;
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      {
        commentId,
        film: this._film,
      },
    );
  }

  _handleCommentSubmit(newComment) {
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      {
        newComment,
        film: this._film,
      },
    );
  }

  _renderPopupComponent() {
    this._getComments(this._film.filmInfo.id)
      .then((comments) => {
        this._comments = comments;

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
      })
      .catch(() => {
        this._mode = Mode.DEFAULT;
      });
  }

  _renderPopupComments(comments, state = {isDisabled: false, isDeleting: false, deleteCommentId: null}) {
    const {isDisabled, isDeleting, deleteCommentId} = state;
    const filmDetailBottomContainer = this._popupComponent.getElement()
      .querySelector('.film-details__bottom-container');

    this._popupComments = new CommentsView(comments, isDisabled, isDeleting, deleteCommentId);
    this._popupComments.setCommentDeleteHandler(this._handleCommentDelete);
    render(filmDetailBottomContainer, this._popupComments);
  }

  _renderNewComment(formElement) {
    this._newCommentComponent = new NewCommentView(formElement);
    this._newCommentComponent.setFormSubmitHandler(this._handleCommentSubmit);
    render(this._popupComments, this._newCommentComponent);
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
