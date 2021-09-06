import AbstractComponent from '../abstract-component.js';
import {FilterTypes} from '../utils/const.js';

const NoFilmsTextTypes = {
  [FilterTypes.ALL]: 'There are no movies in our database',
  [FilterTypes.HISTORY]: 'There are no watched movies now',
  [FilterTypes.WATCHLIST]: 'There are no movies to watch now',
  [FilterTypes.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmsTemplate = (data) => `<h2 className="films-list__title">${NoFilmsTextTypes[data]}</h2>`;

export default class NoFilm extends AbstractComponent{
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createNoFilmsTemplate(this._data);
  }
}
