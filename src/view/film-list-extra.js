import {createFilmListContainer} from './film-list-container.js';

export const filmListExtra = (title, films) => (`
   <section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>

      ${createFilmListContainer(films)}
    </section>
`);
