
import {FilmControlTypes} from '../utils/const.js';
import AbstractComponent from '../AbstractComponent.js';
import {getHumanizeDate, getHumanizeFilmDuration} from '../utils/date.js';

const DESCRIPTION_MAX_LENGTH = 140;
const DESCRIPTION_PREVIEW_LENGTH = 139;
const DATE_YEAR = 'YYYY';
const CONTROL_ACTIVE_CLASS = 'film-card__controls-item--active';
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
        ${genre.map((item) => `<span class="film-card__genre">${item}</span>`).join('')}
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
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }
}
