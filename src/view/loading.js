import AbstractComponent from '../abstract-component.js';

const createNoFilmTemplate = () => '<h2 class="films-list__title">Loading...</h2>';

export default class Loading extends AbstractComponent {
  getTemplate() {
    return createNoFilmTemplate();
  }
}
