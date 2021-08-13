import AbstractComponent from '../abstract-component.js';

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

const createUserProfileTemplate = (count) =>
  `<section class="header__profile profile">
      ${count ? createUserRank(getUserRank(count)) : ''}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
  `;

export default class UserProfile extends AbstractComponent {
  /**
   * @param {number} watchedFilmsCount
   */
  constructor(watchedFilmsCount = 0) {
    super();
    /**
     * @type {number}
     * @private
     */
    this._watchedFilmsCount = watchedFilmsCount;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return createUserProfileTemplate(this._watchedFilmsCount);
  }
}
