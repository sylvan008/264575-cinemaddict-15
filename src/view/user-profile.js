import {createElement} from '../utils';

const EDGE_NOVICE = 10;
const EDGE_FAN = 20;

const getUserRank = (watchedFilmsCount) => {
  if (watchedFilmsCount <= EDGE_NOVICE) {
    return 'Novice';
  }
  if (watchedFilmsCount <= EDGE_FAN) {
    return 'Fan';
  }
  return 'Movie Buff';
};

const createUserRank = (rank) => `<p class="profile__rating">${rank}</p>`;

export default class UserProfile {
  constructor(watchedFilmsCount) {
    this._watchedFilmsCount = watchedFilmsCount;
    this._element = null;
  }

  getTemplate() {
    return `<section class="header__profile profile">
      ${this._watchedFilmsCount ? createUserRank(getUserRank(this._watchedFilmsCount)) : ''}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
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
