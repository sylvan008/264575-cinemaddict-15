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

  deleteComment(updateType, update) {
    const {commentId, film} = update;
    const comments = film.comments.filter((id) => id !== commentId);
    return this._api.deleteComment(commentId)
      .then(() => {
        this._notify(updateType, Object.assign({}, {
          ...film,
          comments,
        }));
      });
  }
}
