import AbstractObserver from '../utils/abstract-observer.js';
import {UpdateType} from '../utils/const.js';

export default class Films extends AbstractObserver{
  constructor(api) {
    super();
    this._api = api;
    this._films = [];

    this._init();
  }

  _init() {
    this._api.getFilms()
      .then((films) => {
        this.setFilms(UpdateType.INIT, films);
      })
      .catch(() => {
        this.setFilms(UpdateType.INIT, []);
      });
  }

  setFilms(updateType, filmsList) {
    this._films = filmsList.slice();

    this._notify(updateType);
  }

  get films() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((item) => item.filmInfo.id === update.filmInfo.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    return this._api.updateFilm(update)
      .then((response) => {
        this._films = [
          ...this._films.slice(0, index),
          response,
          ...this._films.slice(index + 1),
        ];

        this._notify(updateType, response);
      });
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        filmInfo: {
          ...film['film_info'],
          id: film.id,
          ageRating: film['film_info']['age_rating'],
          originalTitle: film['film_info']['alternative_title'],
          totalRating: film['film_info']['total_rating'],
          release: {
            ...film['film_info'].release,
            releaseCountry: film['film_info'].release['release_country'],
          },
        },
        userDetails: {
          ...film['user_details'],
          watchingDate: film['user_details']['watching_date'],
          alreadyWatched: film['user_details']['already_watched'],
        },
      },
    );

    delete adaptedFilm.id;
    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];
    delete adaptedFilm.filmInfo['alternative_title'];
    delete adaptedFilm.filmInfo['total_rating'];
    delete adaptedFilm.filmInfo['age_rating'];
    delete adaptedFilm.filmInfo.release['release_country'];
    delete adaptedFilm.userDetails['watching_date'];
    delete adaptedFilm.userDetails['already_watched'];

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        id: film.filmInfo.id,
        ['film_info']: {
          ...film.filmInfo,
          ['age_rating']: film.filmInfo.ageRating,
          ['alternative_title']: film.filmInfo.originalTitle,
          ['total_rating']: film.filmInfo.totalRating,
          release: {
            ...film.filmInfo.release,
            ['release_country']: film.filmInfo.release.releaseCountry,
          },
        },
        ['user_details']: {
          ...film.userDetails,
          ['watching_date']: film.userDetails.watchingDate,
          ['already_watched']: film.userDetails.alreadyWatched,
        },
      },
    );

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.userDetails;
    delete adaptedFilm['film_info'].id;
    delete adaptedFilm['film_info'].originalTitle;
    delete adaptedFilm['film_info'].totalRating;
    delete adaptedFilm['film_info'].ageRating;
    delete adaptedFilm['film_info'].release.releaseCountry;
    delete adaptedFilm['user_details'].watchingDate;
    delete adaptedFilm['user_details'].alreadyWatched;

    return adaptedFilm;
  }
}
