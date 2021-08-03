import {getHumanizeDate, getHumanizeFilmDuration} from '../utils';

const CONTROL_WATCHLIST = 'watchlist';
const CONTROL_WATCHED = 'watched';
const CONTROL_FAVORITE = 'favorite';
const CONTROL_ACTIVE_CLASS = 'film-card__controls-item--active';
const CardControlTypes = [
  {
    classModifier: 'film-card__controls-item--add-to-watchlist',
    text: 'Add to watchlist',
    type: CONTROL_WATCHLIST,
  },
  {
    classModifier: 'film-card__controls-item--mark-as-watched',
    text: 'Mark as watched',
    type: CONTROL_WATCHED,
  },
  {
    classModifier: 'film-card__controls-item--favorite',
    text: 'Mark as favorite',
    type: CONTROL_FAVORITE,
  },
];

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

  const createControlItem = (item) => {
    const {classModifier, text, type} = item;
    const activeClass = userDetails[type] ? CONTROL_ACTIVE_CLASS : '';
    return `
      <button class="film-card__controls-item ${classModifier} ${activeClass}" type="button">
          ${text}
      </button>
    `;
  };
  const controlsTemplate = CardControlTypes.map(createControlItem).join('');
  const shortDescription = description.length > 140 ? `${description.slice(0, 139)}…` : description;
  const year = getHumanizeDate(date, 'YYYY');
  const genres = genre.join(' ');
  const filmDuration = getHumanizeFilmDuration(runtime);
  return `
    <article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${filmDuration}</span>
        <span class="film-card__genre">${genres}</span>
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
