import moment from 'moment';

/**
 * Format unix timestamp to format string.
 *
 * @export
 * @param {*} timestamp
 * @param {string} [format="YYYY-MM-DD HH:mm"]
 * @returns
 */
export function convertTimeToFormat(timestamp, format = 'YYYY-MM-DD HH:mm') {
  // If timestamp is 0, means time does not exist.
  let time = new Date(timestamp * 1000);
  let momentTime =
    timestamp || timestamp < 0 ? moment(time).format(format) : '';
  return momentTime;
}

export function formatTime(formData) {
  const time = formData.time;
  let startTime = time[0].format('YYYY-MM-DD') + ' 00:00:00';
  let endTime = time[1].format('YYYY-MM-DD') + ' 23:59:59';
  return [moment(startTime).unix(), moment(endTime).unix()];
}

export function isSettlementDate(start, end) {
  // 如果提现的起止时间都是0，不限制提现时间，任何一天都可以提现。
  if (start === 0 && end === 0) return true;

  let startStr;
  let endStr;

  if (String(start).length <= 1) {
    startStr = '0' + start;
  } else {
    endStr = String(start);
  }

  if (String(end).length <= 1) {
    endStr = '0' + end;
  } else {
    endStr = String(end);
  }
  let timeStrStart = `${moment().format('YYYY-MM')}-${startStr} 00:00:00`;
  let timeStrEnd = `${moment().format('YYYY-MM')}-${endStr} 23: 59: 59`;
  return moment().isBetween(timeStrStart, timeStrEnd);
}

export function timestampToMoment(timestamp, format = 'YYYY-MMM-DD') {
  return timestamp ? moment(new Date(timestamp)) : '';
}

export function timeToDay(value) {
  let time = value && value > 0 ? moment.unix(value).format('YYYY-MM-DD') : '';
  return time;
}
export function timeToMinute(value) {
  let time =
    value && value > 0 ? moment.unix(value).format('YYYY-MM-DD HH:mm') : '';
  return time;
}

export function timeToDayNoStuff(value) {
  return moment.unix(value).format('YYYYMMDD');
}
