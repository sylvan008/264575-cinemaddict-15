import AbstractComponent from '../abstract-component.js';
import {getUserRank} from '../utils/common.js';


const createUserProfileTemplate = (count) =>
  `<section class="header__profile profile">
      ${count ? `<p class="profile__rating">${getUserRank(count)}</p>` : ''}
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
