import UserProfileView from '../view/user-profile.js';
import {remove, render, replace} from '../utils/render.js';

export default class User {
  constructor(headerContainer, filmsModel) {
    this._headerContainer = headerContainer;
    this._filmsModel = filmsModel;

    this._userProfileComponent = null;

    this._handleModelAction = this._handleModelAction.bind(this);

    this._filmsModel.addObserver(this._handleModelAction);
  }

  init() {
    const prevUserProfileComponent = this._userProfileComponent;
    this._userProfileComponent = new UserProfileView(this._getWatchedFilmsCount());

    if (!prevUserProfileComponent) {
      render(this._headerContainer, this._userProfileComponent);
      return;
    }

    replace(this._userProfileComponent, prevUserProfileComponent);
    remove(prevUserProfileComponent);
  }

  _renderUserProfile() {
    render(this._headerContainer, this._userProfileComponent(this._getWatchedFilmsCount()));
  }

  _getWatchedFilmsCount() {
    return this._filmsModel.films
      .filter((film) => film.userDetails.alreadyWatched)
      .length;
  }

  _handleModelAction() {
    this.init();
  }
}
