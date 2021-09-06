import AbstractObserver from '../utils/abstract-observer.js';

export default class Films extends AbstractObserver{
  constructor() {
    super();
    this._films = [];
  }

  set films(filmsList) {
    this._films = filmsList.slice();
  }

  get films() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((item) => item.filmInfo.id === update.filmInfo.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
