import FilmsModel from './model/films.js';
import {Board} from './presenter/board.js';
import FooterStatisticsView from './view/footer-statistics.js';
import UserProfile from './view/user-profile.js';
import {render} from './utils/render.js';
import {generateComment} from './mock/mock-comment.js';
import {generateFilm} from './mock/mock-film.js';
import CommentsModel from './model/comments.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const commentsData = new Array(100).fill('').map(generateComment);
const filmsData = new Array(22).fill('').map(generateFilm);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
filmsModel.films = filmsData;
commentsModel.comments = commentsData;

render(headerElement, new UserProfile());

const boardPresenter = new Board(mainElement, filmsModel, commentsModel);

boardPresenter.init();
render(footerStatisticsElement, new FooterStatisticsView(filmsData.length));
