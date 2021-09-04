import AbstractComponent from '../abstract-component.js';

export default class NoFilm extends AbstractComponent{
  getTemplate() {
    return '<section class="films-list"><h2 className="films-list__title">There are no movies in our database</h2></section>';
  }
}
