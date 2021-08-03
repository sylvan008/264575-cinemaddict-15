import {getHumanizeDate, getHumanizeFilmDuration} from '../utils';
import {FilmControlTypes} from '../utils/const.js';

const CONTROL_ACTIVE_CLASS = 'film-details__control-button--active';
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

export const createPopup = ({filmInfo, userDetails}) => {
  const {
    poster,
    title,
    originalTitle,
    totalRating,
    ageRating,
    director,
    writers,
    actors,
    release,
    runtime,
    genre,
    description,
  } = filmInfo;

  const writersStr = writers.join(', ');
  const actorsStr = actors.join(', ');
  const releaseDate = getHumanizeDate(release.date, 'D MMMM YYYY');
  const releaseCountry = release.country;
  const filmDuration = getHumanizeFilmDuration(runtime);
  const genreTemplate = genre.map(createGenreItem).join('');
  const filmDetailControlTemplate = filmDetailControlTypes
    .map((type) => createControlButton(type, userDetails))
    .join('');
  return `
  <section class="film-details">
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
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writersStr}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actorsStr}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${filmDuration}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">${genreTemplate}</td>
              </tr>
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
