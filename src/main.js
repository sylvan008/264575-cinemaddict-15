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
import {getRandomInteger, renderElement, sortFilmByComments, sortFilmByRating} from './utils';
import {NavigationTypes, FilmListTypes, RenderPosition} from './utils/const.js';

const CARDS_LOAD_STEP = 5;
const CARDS_EXTRA_LOAD_STEP = 2;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

const commentsData = new Array(100).fill('').map(generateComment);
const filmsData = new Array(22).fill('').map(generateFilm);
const topFilmsData = filmsData.slice().sort(sortFilmByRating);
const commentsFilmsData = filmsData.slice().sort(sortFilmByComments);
const selectedMovie = filmsData[getRandomInteger(0, filmsData.length - 1)];
const selectedMovieComments = selectedMovie.comments
  .map((movieCommentId) => commentsData.find(({id}) => id === movieCommentId));
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
  films.forEach((film) => renderElement(container, new FilmCardView(film).getElement()));
};

renderElement(headerElement, new UserProfileView(watchedFilmsCount).getElement());
renderElement(mainElement, new MainNavigationView(navigationStatistics).getElement());
renderElement(mainElement, new SortMenuView().getElement());
renderElement(mainElement, new FilmsBoardView().getElement());

const filmBoard = document.querySelector('.films');
const filmListAll = new FilmListView(FilmListTypes.ALL_MOVIES);
renderElement(filmBoard, filmListAll.getElement());
renderElement(filmBoard, new FilmListView(FilmListTypes.TOP_MOVIES).getElement());
renderElement(filmBoard, new FilmListView(FilmListTypes.COMMENTED_MOVIES).getElement());

const allMovieSection = filmBoard.querySelector('.films-list');
const allMoviesList = allMovieSection.querySelector('.films-list__container');
const [topMoviesList, commentMoviesList] = filmBoard.querySelectorAll('.films-list--extra .films-list__container');
renderCards(allMoviesList, filmsData.slice(0, CARDS_LOAD_STEP));
renderCards(topMoviesList, topFilmsData.slice(0, CARDS_EXTRA_LOAD_STEP));
renderCards(commentMoviesList, commentsFilmsData.slice(0, CARDS_EXTRA_LOAD_STEP) );

renderElement(footerStatisticsElement, new FooterStatisticsView(filmsData.length).getElement());
renderElement(footerElement, new PopupView(selectedMovie).getElement(), RenderPosition.AFTEREND);

const filmDetailBottomContainer = document.querySelector('.film-details .film-details__bottom-container');
renderElement(filmDetailBottomContainer, new Comments(selectedMovieComments).getElement());

const commentsContainer = filmDetailBottomContainer.querySelector('.film-details__comments-wrap');
renderElement(commentsContainer, new NewCommentView().getElement());

if (filmsData.length > CARDS_LOAD_STEP) {
  let renderedCardCount = CARDS_LOAD_STEP;
  renderElement(allMovieSection, new ShowMoreButtonView().getElement());
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
