import UserProfileView from './view/user-profile.js';
import MainNavigationView from './view/main-navigation.js';
import SortMenuView from './view/sort-menu.js';
import FilmsBoardView from './view/films-board.js';
import FooterStatisticsView from './view/footer-statistics.js';
import PopupView from './view/popup.js';
import FilmListView from './view/film-list.js';
import FilmCardView from './view/film-card.js';
import ShowMoreButtonView from './view/show-more.js';
import Comments from './view/comments.js';
import NewCommentView from './view/new-comment.js';
import {generateFilm} from './mock/mock-film.js';
import {generateComment} from './mock/mock-comment.js';
import {sortFilmByComments, sortFilmByRating} from './utils/common.js';
import {NavigationTypes, FilmListTypes} from './utils/const.js';
import {render} from './utils/render.js';

const CARDS_LOAD_STEP = 5;
const CARDS_EXTRA_LOAD_STEP = 2;
const HIDE_OVERFLOW = 'hide-overflow';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

const commentsData = new Array(100).fill('').map(generateComment);
const filmsData = new Array(22).fill('').map(generateFilm);
const topFilmsData = filmsData.slice().sort(sortFilmByRating);
const commentsFilmsData = filmsData.slice().sort(sortFilmByComments);

const popupComponent = new PopupView();

const getFilmComments = (film) =>
  film.comments.map((movieCommentId) => commentsData.find(({id}) => id === movieCommentId));

const countUserStatistic = (filmsList, propertyName) => (
  filmsList.reduce((acc, {userDetails}) => acc + Number(userDetails[propertyName]), 0)
);
const watchlistFilmsCount = countUserStatistic(filmsData,'watchlist');
const watchedFilmsCount = countUserStatistic(filmsData, 'alreadyWatched');
const favoriteFilmsCount = countUserStatistic(filmsData, 'favorite');
const navigationStatistics = {
  [NavigationTypes.WATCHLIST]: watchlistFilmsCount,
  [NavigationTypes.HISTORY]: watchedFilmsCount,
  [NavigationTypes.FAVORITES]: favoriteFilmsCount,
};

const renderCards = (container, films) => {
  films.forEach((film) => {
    const cardElement = new FilmCardView(film).getElement();
    const handledElements = [
      cardElement.querySelector('.film-card__title'),
      cardElement.querySelector('.film-card__poster'),
      cardElement.querySelector('.film-card__comments'),
    ];

    const onPopupCloseHandler = (evt) => {
      evt.preventDefault();
      cardElement.removeChild(popupComponent.getElement());
      popupComponent.removeElement();
      document.body.classList.remove(HIDE_OVERFLOW);
    };

    const onCardClickHandler = (evt) => {
      evt.preventDefault();
      popupComponent.setFilmData(film);
      const popupElement = popupComponent.getElement();
      const filmDetailBottomContainer = popupElement.querySelector('.film-details__bottom-container');

      render(filmDetailBottomContainer, new Comments(getFilmComments(film)));

      const commentsContainer = filmDetailBottomContainer.querySelector('.film-details__comments-wrap');
      render(commentsContainer, new NewCommentView());

      const closeButtonElement = popupElement.querySelector('.film-details__close-btn');
      closeButtonElement.addEventListener('click', onPopupCloseHandler, {once: true});
      cardElement.appendChild(popupElement);
      document.body.classList.add(HIDE_OVERFLOW);
    };
    handledElements.forEach((element) => element.addEventListener('click', onCardClickHandler));

    render(container, cardElement);
  });
};

render(headerElement, new UserProfileView(watchedFilmsCount));
render(mainElement, new MainNavigationView(navigationStatistics));
render(mainElement, new SortMenuView());
render(mainElement, new FilmsBoardView());

const filmBoard = document.querySelector('.films');
const filmListAll = new FilmListView(FilmListTypes.ALL_MOVIES);
render(filmBoard, filmListAll);
render(filmBoard, new FilmListView(FilmListTypes.TOP_MOVIES));
render(filmBoard, new FilmListView(FilmListTypes.COMMENTED_MOVIES));

const allMovieSection = filmBoard.querySelector('.films-list');
const allMoviesList = allMovieSection.querySelector('.films-list__container');
const [topMoviesList, commentMoviesList] = filmBoard.querySelectorAll('.films-list--extra .films-list__container');
renderCards(allMoviesList, filmsData.slice(0, CARDS_LOAD_STEP));
renderCards(topMoviesList, topFilmsData.slice(0, CARDS_EXTRA_LOAD_STEP));
renderCards(commentMoviesList, commentsFilmsData.slice(0, CARDS_EXTRA_LOAD_STEP) );

render(footerStatisticsElement, new FooterStatisticsView(filmsData.length));

if (filmsData.length > CARDS_LOAD_STEP) {
  let renderedCardCount = CARDS_LOAD_STEP;
  render(allMovieSection, new ShowMoreButtonView());
  const loadMoreButton = allMovieSection.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    const nextCards = Math.min(filmsData.length, renderedCardCount + CARDS_LOAD_STEP);
    renderCards(allMoviesList, filmsData.slice(renderedCardCount, nextCards));
    renderedCardCount = nextCards;
    if (renderedCardCount >= filmsData.length) {
      loadMoreButton.remove();
    }
  });
}
