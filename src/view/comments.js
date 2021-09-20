import AbstractComponent from '../abstract-component.js';
import {getDateDifferenceFromNow, getHumanizeDate, getRelativeDate} from '../utils/date.js';
import {encodeUnsafeSymbols} from '../utils/common.js';

const COMMENT_TODAY = 'Today';
const COMMENT_DATE_TEMPLATE = 'YYYY/MM/DD hh:mm';
const CallbackTypes = {
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const getCommentDate = (date, dayDifference) => {
  switch(dayDifference) {
    case 0:
      return COMMENT_TODAY;
    case 1:
    case 2:
      return getRelativeDate(date);
    default:
      return getHumanizeDate(date, COMMENT_DATE_TEMPLATE);
  }
};

const createCommentItem = ({author, comment, date, emotion, id}, isDisabled, isDeleting, deleteCommentID) => {
  const commentDate = getCommentDate(date, getDateDifferenceFromNow(date));
  return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${encodeUnsafeSymbols(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete" data-comment-id="${id}" ${isDisabled ? 'disabled' : ''}>
            ${isDeleting && id === deleteCommentID ? 'Deleting' : 'Delete'}
          </button>
        </p>
      </div>
    </li>
  `;
};

/**
 * @param {comment[]} comments
 * @return {string} HTML template
 */
const createCommentsTemplate = (comments, isDisabled, isDeleting, deleteCommentID) =>
  `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">
        ${comments.map((comment) => createCommentItem(comment, isDisabled, isDeleting, deleteCommentID)).join('')}
      </ul>
    </section>
  `;

export default class Comments extends AbstractComponent {
  /**
   * @param {comment[]} comments
   */
  constructor(comments, isDisabled = false, isDeleting = false, deleteCommentID = null) {
    super();
    /**
     * @type {comment[]}
     * @private
     */
    this._comments = comments;
    this._isDisabled = isDisabled;
    this._isDeleting = isDeleting;
    this._deleteCommentID = deleteCommentID;

    this._commentDeleteHandler = this._commentDeleteHandler.bind(this);
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return createCommentsTemplate(this._comments, this._isDisabled, this._isDeleting, this._deleteCommentID);
  }

  _commentDeleteHandler(evt) {
    evt.preventDefault();
    this._callback[CallbackTypes.DELETE_COMMENT](evt.target.dataset.commentId);
  }

  setCommentDeleteHandler(callback) {
    this._callback[CallbackTypes.DELETE_COMMENT] = callback;
    this.getElement()
      .querySelector('.film-details__comments-list')
      .addEventListener('click', this._commentDeleteHandler);
  }
}
