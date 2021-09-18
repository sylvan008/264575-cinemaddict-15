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

  addComment(updateType, update) {
    const {newComment, film} = update;
    return this._api.addComment(film.filmInfo.id, newComment)
      .then((data) => {
        this._comments = data.comments;
        this._notify(updateType, data.movie);
      });
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
