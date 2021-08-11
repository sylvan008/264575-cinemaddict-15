import AbstractComponent from '../AbstractComponent.js';

export default class FilmsBoard extends AbstractComponent {
  getTemplate() {
    return '<section class="films"></section>';
  }
}
