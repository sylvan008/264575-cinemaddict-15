import {createFilmList} from './film-list.js';
import {filmListExtra} from './film-list-extra.js';

export const createFilmsBoard = (films) => (`
  <section class="films">
    ${createFilmList(films.allFilms)}

    ${filmListExtra('Top rated', films.topRated)}

    ${filmListExtra('Most commented', films.mostRecommended)}
  </section>
`);
