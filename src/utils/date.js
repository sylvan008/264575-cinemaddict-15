import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(relativeTime);

const HOUR = 60;
const BREAKDOWN_RANGE_DAY = 'day';

const getHumanizeDate = (date, template = 'D YYYY') => dayjs(date).format(template);

const getHumanizeFilmDuration = (runtime) => `${Math.floor(runtime / HOUR)}h ${runtime % HOUR}m`;

const getRelativeDate = (date) => dayjs(date).fromNow();

const getDateDifferenceFromNow = (date, breakdownRange = BREAKDOWN_RANGE_DAY) => dayjs().diff(date, breakdownRange);

const getDatesDifference = (dateA, dateB) => dayjs(dateA).diff(dayjs(dateB));

const getDateNow = () => dayjs();

export {
  getRelativeDate,
  getHumanizeDate,
  getHumanizeFilmDuration,
  getDateDifferenceFromNow,
  getDatesDifference,
  getDateNow
};
