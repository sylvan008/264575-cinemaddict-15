import FooterStatisticsView from './view/footer-statistics.js';
import {generateFilm} from './mock/mock-film.js';
import {generateComment} from './mock/mock-comment.js';
import {render} from './utils/render.js';
import {Board} from './presenter/board.js';
import UserProfile from './view/user-profile.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerStatisticsElement = document.querySelector('.footer__statistics');

const commentsData = new Array(100).fill('').map(generateComment);
const filmsData = new Array(22).fill('').map(generateFilm);

render(headerElement, new UserProfile());
const boardPresenter = new Board(mainElement);
boardPresenter.init(filmsData, commentsData);
render(footerStatisticsElement, new FooterStatisticsView(filmsData.length));
