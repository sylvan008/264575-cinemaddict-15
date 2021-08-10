import {createElement, getDateDifferenceFromNow, getHumanizeDate, getRelativeDate} from '../utils';

const COMMENT_TODAY = 'Today';
const COMMENT_DATE_TEMPLATE = 'YYYY/MM/DD hh:mm';

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

const createCommentItem = ({author, comment, date, emotion}) => {
  const commentDate = getCommentDate(date, getDateDifferenceFromNow(date));
  return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
  `;
};

export default class Comments {
  constructor(comments) {
    this._comments = comments;
    this._element = null;
  }

  getTemplate() {
    return `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${this._comments.length}</span></h3>

      <ul class="film-details__comments-list">
        ${this._comments.map(createCommentItem).join('')}
      </ul>
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
