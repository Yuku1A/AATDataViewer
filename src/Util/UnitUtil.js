import dayjs from "dayjs";
import duration from "dayjs/plugin/duration"

dayjs.extend(duration);

/**
 * 
 * @param {string} milliTimeStr ミリ秒の整数のstring
 * @returns {duration.Duration}
 */
export function MilliTimeStrToDuration(milliTimeStr) {
  const milliTimeInt = parseInt(milliTimeStr);
  return dayjs.duration(milliTimeInt);
}

/**
 * 
 * @param {duration.Duration} dayjsTime 
 * @returns {string}
 */
export function DayjsTimeToHHmmss(dayjsTime) {
  return dayjsTime.format("HH:mm:ss");
}

/**
 * 
 * @param {string} milliTimeStr 
 * @returns {string}
 */
export function MilliTimeStrToHHmmss(milliTimeStr) {
  const dayjsTime = MilliTimeStrToDuration(milliTimeStr);
  return DayjsTimeToHHmmss(dayjsTime);
}

/**
 * 
 * @param {string} HHmmssStr 
 * @returns {duration.Duration}
 */
export function HHmmssToDuration(HHmmssStr) {
  const HHmmssArray = HHmmssStr.split(":");
  return dayjs.duration({
    hours: HHmmssArray[0], 
    minutes: HHmmssArray[1], 
    seconds: HHmmssArray[2]
  })
}

/**
 * 
 * @param {string} testStr 
 * @returns {boolean}
 */
export function isStringHHmmss(testStr) {
  const regex = new RegExp("^\\d\\d:[0-5]\\d:[0-5]\\d$");
  return regex.test(testStr);
}