import FilmsModel from './model/films.js';
import FiltersModel from './model/filters.js';
import {Board} from './presenter/board.js';
import Filter from './presenter/filter.js';
import FooterStatisticsView from './view/footer-statistics.js';
import {render} from './utils/render.js';
import {generateComment} from './mock/mock-comment.js';
import {generateFilm} from './mock/mock-film.js';
import CommentsModel from './model/comments.js';

const pageElement = document.querySelector('body');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const commentsData = new Array(100).fill('').map(generateComment);
const filmsData = new Array(23).fill('').map(generateFilm);
const mainElement = pageElement.querySelector('.main');

const filtersModel = new FiltersModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

filmsModel.films = filmsData;
commentsModel.comments = commentsData;

const filtersPresenter = new Filter(mainElement, filtersModel, filmsModel);
filtersPresenter.init();

const boardPresenter = new Board(pageElement, filmsModel, commentsModel, filtersModel);
boardPresenter.init();

render(footerStatisticsElement, new FooterStatisticsView(filmsData.length));
