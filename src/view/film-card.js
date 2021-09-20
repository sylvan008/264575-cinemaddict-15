import AbstractComponent from '../abstract-component.js';
import {FilmControlTypes} from '../utils/const.js';
import {getHumanizeDate, getHumanizeFilmDuration} from '../utils/date.js';

const DESCRIPTION_MAX_LENGTH = 140;
const DESCRIPTION_PREVIEW_LENGTH = 139;
const DATE_YEAR = 'YYYY';
const CONTROL_ACTIVE_CLASS = 'film-card__controls-item--active';
const CallbackTypes = {
  OPEN_POPUP: 'openPopup',
  ADD_HISTORY: 'addToHistory',
  ADD_WATCHLIST: 'addToWatchlist',
  ADD_FAVORITE: 'addToFavorite',
};
const CardControlTypes = [
  {
    classModifier: 'film-card__controls-item--add-to-watchlist',
    text: 'Add to watchlist',
    type: FilmControlTypes.WATCHLIST,
  },
  {
    classModifier: 'film-card__controls-item--mark-as-watched',
    text: 'Mark as watched',
    type: FilmControlTypes.WATCHED,
  },
  {
    classModifier: 'film-card__controls-item--favorite',
    text: 'Mark as favorite',
    type: FilmControlTypes.FAVORITE,
  },
];

const createControlItem = ({classModifier, text, type}, userDetails) => {
  const activeClass = userDetails[type] ? CONTROL_ACTIVE_CLASS : '';
  return `<button class="film-card__controls-item ${classModifier} ${activeClass}" type="button">
          ${text}
      </button>
    `;
};

const createFilmCardTemplate = (filmDetail) => {
  const {filmInfo, userDetails, comments} = filmDetail;
  const commentsCount = comments.length;
  const {
    poster,
    title,
    totalRating,
    release: {date},
    runtime,
    genre,
    description,
  } = filmInfo;

  const shortDescription = description.length > DESCRIPTION_MAX_LENGTH
    ? `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH)}…`
    : description;
  return `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${getHumanizeDate(date, DATE_YEAR)}</span>
        <span class="film-card__duration">${getHumanizeFilmDuration(runtime)}</span>
        ${genre.map((item) => `<span class="film-card__genre">${item}</span>`).join(' ')}
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>

      <div class="film-card__controls">
        ${CardControlTypes.map((type) => createControlItem(type, userDetails)).join('')}
      </div>
    </article>
  `;
};

export default class FilmCard extends AbstractComponent {
  /**
   * @param {film{}} film
   */
  constructor(film) {
    super();
    this._film = film;
    this._cardOpenHandler = this._cardOpenHandler.bind(this);
    this._filmAddToHistoryHandler = this._filmAddToHistoryHandler.bind(this);
    this._filmAddToWatchlistHandler = this._filmAddToWatchlistHandler.bind(this);
    this._filmAddToFavoriteHandler = this._filmAddToFavoriteHandler.bind(this);
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  /**
   * @param {Event} evt
   * @private
   */
  _cardOpenHandler(evt) {
    evt.preventDefault();
    this._callback[CallbackTypes.OPEN_POPUP]();
  }

  _filmAddToWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback[CallbackTypes.ADD_WATCHLIST]();
  }

  _filmAddToHistoryHandler(evt) {
    evt.preventDefault();
    this._callback[CallbackTypes.ADD_HISTORY]();
  }

  _filmAddToFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback[CallbackTypes.ADD_FAVORITE]();
  }

  /**
   * @param {function} callback
   */
  setCardOpenHandler(callback) {
    this._callback[CallbackTypes.OPEN_POPUP] = callback;

    this.getElement().querySelector('.film-card__title')
      .addEventListener('click', this._cardOpenHandler);
    this.getElement().querySelector('.film-card__poster')
      .addEventListener('click', this._cardOpenHandler);
    this.getElement().querySelector('.film-card__comments')
      .addEventListener('click', this._cardOpenHandler);
  }

  setAddFilmToFavoriteHandler(callback) {
    this._callback[CallbackTypes.ADD_FAVORITE] = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this._filmAddToFavoriteHandler);
  }

  setAddFilmToHistoryHandler(callback) {
    this._callback[CallbackTypes.ADD_HISTORY] = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this._filmAddToHistoryHandler);
  }

  setAddFilmToWatchlistHandler(callback) {
    this._callback[CallbackTypes.ADD_WATCHLIST] = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this._filmAddToWatchlistHandler);
  }
}
