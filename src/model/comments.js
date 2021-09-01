import AbstractObserver from '../utils/abstract-observer.js';

export default class CommentsModel extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  set comments(commentsList) {
    this._comments = commentsList;
  }

  get comments() {
    return this._comments;
  }
}
