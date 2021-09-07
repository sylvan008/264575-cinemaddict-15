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

  addComment(data) {
    this._comments.push(data);
  }

  deleteComment(id) {
    this._comments = this._comments.filter((comment) => comment.id !== id);
  }
}
