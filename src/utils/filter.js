import {FilmControlTypes, FilterTypes} from './const.js';

const filter = {
  [FilterTypes.ALL]: (filmsList) => filmsList.slice(),
  [FilterTypes.HISTORY]: (filmsList) => filmsList.filter((film) => film.userDetails[FilmControlTypes.WATCHED]),
  [FilterTypes.WATCHLIST]: (filmList) => filmList.filter((film) => film.userDetails[FilmControlTypes.WATCHLIST]),
  [FilterTypes.FAVORITES]: (filmList) => filmList.filter((film) => film.userDetails[FilmControlTypes.FAVORITE]),
};

export {
  filter
};
