import {createFilmCard} from './film-card.js';

export const createFilmListContainer = (films) => {
  const filmCards = films.reduce((acc) => acc + createFilmCard(), '');
  return (`
    <div class="films-list__container">
      ${filmCards}
    </div>
  `);
};
