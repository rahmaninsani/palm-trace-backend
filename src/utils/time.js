import moment from 'moment';
import 'moment-timezone';

moment.locale('id');

const getCurrentTime = () => {
  return moment().tz('Asia/Jakarta').format();
};

const getWeekStartEndDate = () => {
  const startOfWeek = moment().tz('Asia/Jakarta').startOf('isoWeek').format();
  const endOfWeek = moment().tz('Asia/Jakarta').endOf('isoWeek').format();

  return {
    startOfWeek,
    endOfWeek,
  };
};

const getDayOfDate = (date) => {
  return moment(date).tz('Asia/Jakarta').format('dddd').toLowerCase();
};

const time = { getCurrentTime, getWeekStartEndDate, getDayOfDate };
export default time;
