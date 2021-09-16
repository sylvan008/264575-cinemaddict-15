import AbstractObserver from '../utils/abstract-observer.js';

export default class CommentsModel extends AbstractObserver {
  constructor(api) {
    super();
    this._api = api;
    this._comments = [];
  }

  getComments(filmId) {
    return this._api.getComments(filmId)
      .then((comments) => {
        this._comments = comments;
        return this._comments;
      });
  }

  addComment(data) {
    this._comments.push(data);
  }

  deleteComment(id) {
    this._comments = this._comments.filter((comment) => comment.id !== id);
  }
}
