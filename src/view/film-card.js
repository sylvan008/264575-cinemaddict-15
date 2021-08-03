import {getHumanizeDate, getHumanizeFilmDuration} from '../utils';
import {FilmControlTypes} from '../utils/const.js';

const DESCRIPTION_MAX_LENGTH = 140;
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
  return `
      <button class="film-card__controls-item ${classModifier} ${activeClass}" type="button">
          ${text}
      </button>
    `;
};
const createGenreItem = (genre) => `<span class="film-card__genre">${genre}</span>`;

export const createFilmCard = ({filmInfo, commentsCount, userDetails}) => {
  const {
    poster,
    title,
    totalRating,
    release: {date},
    runtime,
    genre,
    description,
  } = filmInfo;

  const controlsTemplate = CardControlTypes.map((type) => createControlItem(type, userDetails)).join('');
  const shortDescription = description.length > DESCRIPTION_MAX_LENGTH
    ? `${description.slice(0, DESCRIPTION_MAX_LENGTH - 1)}…`
    : description;
  const year = getHumanizeDate(date, 'YYYY');
  const genreTemplate = genre.map(createGenreItem).join('');
  const filmDuration = getHumanizeFilmDuration(runtime);
  return `
    <article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${filmDuration}</span>
        ${genreTemplate}
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>

      <div class="film-card__controls">
        ${controlsTemplate}
      </div>
    </article>
  `;
};
