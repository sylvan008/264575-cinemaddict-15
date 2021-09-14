import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartComponent from '../smart-component.js';
import {getUserRank} from '../utils/common.js';
import {StatisticFiltersTypes} from '../utils/const.js';
import {getDateIsAfter} from '../utils/date.js';

const StatisticFiltersItems = [
  {
    value: StatisticFiltersTypes.ALL_TIME,
    text: 'All time',
  },
  {
    value: StatisticFiltersTypes.TODAY,
    text: 'Today',
  },
  {
    value: StatisticFiltersTypes.WEEK,
    text: 'Week',
  },
  {
    value: StatisticFiltersTypes.MONTH,
    text: 'Month',
  },
  {
    value: StatisticFiltersTypes.YEAR,
    text: 'Year',
  },
];

const createFilterTemplate = (filterItem, currentFilter) =>
  `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${filterItem.value}" value="${filterItem.value}" ${filterItem.value === currentFilter ? 'checked' : ''}>
  <label for="statistic-${filterItem.value}" class="statistic__filters-label">${filterItem.text}</label>`;

const createStatisticTemplate = (totalFilmsCount, filmsForPeriodCount, runtime, currentFilter, topGenre = '') => {
  const [hours, minutes] = runtime;
  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      ${totalFilmsCount ? `<span class="statistic__rank-label">${getUserRank(totalFilmsCount)}</span>` : ''}
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      ${StatisticFiltersItems.map((item) => createFilterTemplate(item, currentFilter)).join('')}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${filmsForPeriodCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

const countStatistics = (films) => {
  const statistics = {};
  films.forEach(({filmInfo}) => {
    filmInfo.genre.forEach((genre) => {
      if (!statistics[genre]) {
        statistics[genre] = 0;
      }
      statistics[genre] += 1;
    });
  });

  return statistics;
};

const createChart = (statisticCtx, labels, data) => {
  const BAR_HEIGHT = 50;

  statisticCtx.height = BAR_HEIGHT * labels.length;
  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export default class Statistic extends SmartComponent {
  constructor(films) {
    super();

    this._data = {
      films,
      filmsForPeriod: films,
      watchedFilmsCount: films.length,
      currentFilter: StatisticFiltersTypes.ALL_TIME,
      sortedStatistics: this._getStatistics(films),
    };

    this._changeFilmHandler = this._changeFilmHandler.bind(this);

    this._filmChart = null;

    this._renderChart();
    this._setInnerHandlers();
  }

  getTemplate() {
    return createStatisticTemplate(
      this._data.films.length,
      this._data.watchedFilmsCount,
      this._getAllFilmsRuntime(this._data.filmsForPeriod),
      this._data.currentFilter,
      this._data.sortedStatistics.labels[0],
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _changeFilmHandler(evt) {
    if (evt.target.closest('.statistic__filters-input')) {
      const filter = evt.target.value;
      const filmsForPeriod = this._getFilms(this._data.films, filter);
      this.updateData({
        filmsForPeriod,
        currentFilter: filter,
        watchedFilmsCount: filmsForPeriod.length,
        sortedStatistics: this._getStatistics(filmsForPeriod),
      });
      this._renderChart();
    }
  }

  _getAllFilmsRuntime(films) {
    const runtime = films.reduce((acc, film) => acc + film.filmInfo.runtime, 0);
    return [
      Math.floor(runtime / 60),
      runtime % 60,
    ];
  }

  _getFilms(films, activeFilter) {
    if (activeFilter === StatisticFiltersTypes.ALL_TIME) {
      return films;
    }
    return films.filter(({userDetails}) => getDateIsAfter(userDetails.watchingDate, activeFilter));
  }

  _getStatistics(films) {
    const sortedStatistics = Object.entries(countStatistics(films))
      .sort((statA, statB) => statB[1] - statA[1]);
    return {
      labels: sortedStatistics.reduce((acc, element) => [...acc, element[0]], []),
      data: sortedStatistics.reduce((acc, element) => [...acc, element[1]], []),
    };
  }

  _renderChart() {
    if (this._data.filmsForPeriod.length) {
      this._filmChart = createChart(
        this.getElement().querySelector('.statistic__chart'),
        this._data.sortedStatistics.labels,
        this._data.sortedStatistics.data,
      );
    }
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.statistic__filters')
      .addEventListener('change', this._changeFilmHandler);
  }
}
