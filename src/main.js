import FilmsModel from './model/films.js';
import {Board} from './presenter/board.js';
import FooterStatisticsView from './view/footer-statistics.js';
import {render} from './utils/render.js';
import {generateComment} from './mock/mock-comment.js';
import {generateFilm} from './mock/mock-film.js';
import CommentsModel from './model/comments.js';

const pageElement = document.querySelector('body');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const commentsData = new Array(100).fill('').map(generateComment);
const filmsData = new Array(23).fill('').map(generateFilm);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
filmsModel.films = filmsData;
commentsModel.comments = commentsData;

const boardPresenter = new Board(pageElement, filmsModel, commentsModel);
boardPresenter.init();

render(footerStatisticsElement, new FooterStatisticsView(filmsData.length));
