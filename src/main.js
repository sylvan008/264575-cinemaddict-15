import FilmsModel from './model/films.js';
import FiltersModel from './model/filters.js';
import {Board} from './presenter/board.js';
import Filter from './presenter/filter.js';
import FooterStatisticsView from './view/footer-statistics.js';
import StatisticView from './view/statistic.js';
import {MenuTypes} from './utils/const.js';
import {remove, render} from './utils/render.js';
import {generateComment} from './mock/mock-comment.js';
import {generateFilm} from './mock/mock-film.js';
import CommentsModel from './model/comments.js';
import Api from './api.js';

const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic gjoo9fvs4njdfsii49hck439!';

const pageElement = document.querySelector('body');
const footerStatisticsElement = document.querySelector('.footer__statistics');
const mainElement = pageElement.querySelector('.main');

const api = new Api(END_POINT, AUTHORIZATION);
api.getFilms().then((data) => {
  console.log(data);
});
const commentsData = new Array(100).fill('').map(generateComment);
const filmsData = new Array(23).fill('').map(generateFilm);

const filtersModel = new FiltersModel();
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();

filmsModel.films = filmsData;
commentsModel.comments = commentsData;

const boardPresenter = new Board(pageElement, filmsModel, commentsModel, filtersModel);
boardPresenter.init();

let statisticComponent = null;

const handleSiteMenuClick = (menuType) => {
  switch (menuType) {
    case MenuTypes.BOARD:
      if (boardPresenter.isInit) {
        return;
      }
      boardPresenter.init();
      remove(statisticComponent);
      statisticComponent = null;
      break;
    case MenuTypes.STATISTICS:
      boardPresenter.destroy();
      statisticComponent = new StatisticView(filmsModel.films.filter((film) => film.userDetails.alreadyWatched));
      render(mainElement, statisticComponent);
      break;
  }
};

const filtersPresenter = new Filter(mainElement, filtersModel, filmsModel, handleSiteMenuClick);
filtersPresenter.init();

render(footerStatisticsElement, new FooterStatisticsView(filmsData.length));
