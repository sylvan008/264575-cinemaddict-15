import AbstractComponent from '../abstract-component.js';

export default class FilmsBoard extends AbstractComponent {
  /**
   * @return {string}
   */
  getTemplate() {
    return '<section class="films"></section>';
  }
}
