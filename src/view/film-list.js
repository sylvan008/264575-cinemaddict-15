import {createElement} from '../utils';

const createFilmListTemplate = (listProps) => {
  const {title, isHidden, isExtra} = listProps;
  const filmListClasses = isExtra ? 'films-list--extra' : '';
  const titleClasses = isHidden ? 'visually-hidden' : '';
  return `<section class="films-list ${filmListClasses}">
      <h2 class="films-list__title ${titleClasses}">${title}</h2>

      <div class="films-list__container"></div>
    </section>
  `;
};

export default class FilmList {
  constructor(listProps) {
    this._listProps = listProps;
    this._element = null;
  }

  getTemplate() {
    return createFilmListTemplate(this._listProps);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
