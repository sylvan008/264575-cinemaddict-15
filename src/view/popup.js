import {FilmControlTypes} from '../utils/const.js';
import AbstractComponent from '../abstract-component.js';
import {getHumanizeDate, getHumanizeFilmDuration} from '../utils/date.js';

const CONTROL_ACTIVE_CLASS = 'film-details__control-button--active';
const DATE_TEMPLATE = 'D MMMM YYYY';
const CallbackTypes = {
  CLOSE: 'close',
  ADD_HISTORY: 'addToHistory',
  ADD_WATCHLIST: 'addToWatchlist',
  ADD_FAVORITE: 'addToFavorite',
  SCROLL: 'scroll',
};

const filmDetailControlTypes = [
  {
    classModifier: 'film-details__control-button--watchlist',
    text: 'Add to watchlist',
    type: FilmControlTypes.WATCHLIST,
  },
  {
    classModifier: 'film-details__control-button--watched',
    text: 'Already watched',
    type: FilmControlTypes.WATCHED,
  },
  {
    classModifier: 'film-details__control-button--favorite',
    text: 'Add to favorites',
    type: FilmControlTypes.FAVORITE,
  },
];

const createGenreItem = (genre) => `<span class="film-details__genre">${genre}</span>`;
const createControlButton = ({classModifier, text, type}, userDetails) => {
  const activeClass = userDetails[type] ? CONTROL_ACTIVE_CLASS : '';
  return `
    <button type="button" class="film-details__control-button ${classModifier} ${activeClass}" id="${type}" name="${type}">
      ${text}
    </button>
  `;
};
const tableDetailsModel = [
  {
    title: 'Director',
    key: 'director',
  },
  {
    title: 'Writers',
    key: 'writers',
    handler: (writers) => writers.join(', '),
  },
  {
    title: 'Actors',
    key: 'actors',
    handler: (actors) => actors.join(', '),
  },
  {
    title: 'Release Date',
    key: 'date',
    handler: (date) => getHumanizeDate(date, DATE_TEMPLATE),
  },
  {
    title: 'Country',
    key: 'release.country',
  },
  {
    title: 'Runtime',
    key: 'runtime',
    handler: (runtime) => getHumanizeFilmDuration(runtime),
  },
  {
    title: 'Genres',
    key: 'genre',
    handler: (genres) => genres.map(createGenreItem).join(''),
  },
];

const createTableTemplate = (tableModel, tableInfo) =>
  tableModel.map((model) => {
    const {title, key, handler} = model;
    const value = typeof handler === 'function'
      ? handler(tableInfo[key])
      : tableInfo[key];
    return `
      <tr class="film-details__row">
        <td class="film-details__term">${title}</td>
        <td class="film-details__cell">${value}</td>
      </tr>
    `;
  }).join('');

export const createPopupTemplate = ({filmInfo, userDetails}) => {
  const {
    poster,
    title,
    originalTitle,
    totalRating,
    ageRating,
    description,
  } = filmInfo;

  const tableInfo = {
    director: filmInfo.director,
    writers: filmInfo.writers,
    actors: filmInfo.actors,
    date: filmInfo.release.date,
    country: filmInfo.release.country,
    runtime: filmInfo.runtime,
    genre: filmInfo.genre,
  };

  const filmDetailControlTemplate = filmDetailControlTypes
    .map((type) => createControlButton(type, userDetails))
    .join('');
  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ageRating}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${originalTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              ${createTableTemplate(tableDetailsModel, tableInfo)}
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">${filmDetailControlTemplate}</section>
      </div>

      <div class="film-details__bottom-container"></div>
    </form>
  </section>
`;
};

export default class Popup extends AbstractComponent {
  constructor(film) {
    super();

    /**
     * @type {film{}}
     * @private
     */
    this._film = film;
    this._closeHandler = this._closeHandler.bind(this);
    this._filmAddToFavoriteHandler = this._filmAddToFavoriteHandler.bind(this);
    this._filmAddToHistoryHandler = this._filmAddToHistoryHandler.bind(this);
    this._filmAddToWatchlistHandler = this._filmAddToWatchlistHandler.bind(this);
    this._scrollTopHandler = this._scrollTopHandler.bind(this);
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return createPopupTemplate(this._film);
  }

  setCloseHandler(callback) {
    this._callback[CallbackTypes.CLOSE] = callback;
    this.getElement().querySelector('.film-details__close-btn')
      .addEventListener('click', this._closeHandler);
  }

  setAddFilmToFavoriteHandler(callback) {
    this._callback[CallbackTypes.ADD_FAVORITE] = callback;
    this.getElement().querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this._filmAddToFavoriteHandler);
  }

  setAddFilmToHistoryHandler(callback) {
    this._callback[CallbackTypes.ADD_HISTORY] = callback;
    this.getElement().querySelector('.film-details__control-button--watched')
      .addEventListener('click', this._filmAddToHistoryHandler);
  }

  setAddFilmToWatchlistHandler(callback) {
    this._callback[CallbackTypes.ADD_WATCHLIST] = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this._filmAddToWatchlistHandler);
  }

  setScrollTopHandler(callback) {
    this._callback[CallbackTypes.SCROLL] = callback;
    this.getElement().addEventListener('scroll', this._scrollTopHandler);
  }

  /**
   * @param {Event} evt
   * @private
   */
  _closeHandler(evt) {
    evt.preventDefault();
    this._callback[CallbackTypes.CLOSE]();
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

  _scrollTopHandler(evt) {
    evt.preventDefault();
    this._callback[CallbackTypes.SCROLL](evt.target.scrollTop);
  }
}
