import AbstractComponent from '../AbstractComponent.js';

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

export default class UserProfile extends AbstractComponent {
  constructor(watchedFilmsCount) {
    super();
    this._watchedFilmsCount = watchedFilmsCount;
  }

  getTemplate() {
    return `<section class="header__profile profile">
      ${this._watchedFilmsCount ? createUserRank(getUserRank(this._watchedFilmsCount)) : ''}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;
  }
}
