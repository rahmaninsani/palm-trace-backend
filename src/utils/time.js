import moment from 'moment';
import 'moment-timezone';

const getCurrentTime = () => {
  moment.locale('id');
  return moment().tz('Asia/Jakarta').format();
};

const time = { getCurrentTime };
export default time;
