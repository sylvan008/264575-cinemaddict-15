import AbstractComponent from '../abstract-component.js';

export default class NoFilm extends AbstractComponent{
  getTemplate() {
    return '<h2 className="films-list__title">There are no movies in our database</h2>';
  }
}
