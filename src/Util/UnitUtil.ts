import dayjs from "dayjs";
import duration from "dayjs/plugin/duration"

dayjs.extend(duration);

/**
 * 
 * @param {string} milliTimeStr ミリ秒の整数のstring
 * @returns {duration.Duration}
 */
export function MilliTimeStrToDuration(milliTimeStr: string) {
  const milliTimeInt = parseInt(milliTimeStr);
  return dayjs.duration(milliTimeInt);
}

export function MilliTimeNumToDuration(milliTimeNum: number) {
  return dayjs.duration(milliTimeNum);
}

/**
 * 
 * @param {duration.Duration} dayjsTime 
 * @returns {string}
 */
export function DayjsTimeToHHmmss(dayjsTime: duration.Duration) {
  return dayjsTime.format("HH:mm:ss");
}

/**
 * 
 * @param {string} milliTimeStr 
 * @returns {string}
 */
export function MilliTimeStrToHHmmss(milliTimeStr: string) {
  const dayjsTime = MilliTimeStrToDuration(milliTimeStr);
  return DayjsTimeToHHmmss(dayjsTime);
}

export function MilliTimeNumToHHmmss(milliTimeNum: number) {
  const dayjsTime = MilliTimeNumToDuration(milliTimeNum);
  return DayjsTimeToHHmmss(dayjsTime);
}

/**
 * 
 * @param {string} HHmmssStr 
 * @returns {duration.Duration}
 */
export function HHmmssToDuration(HHmmssStr: string) {
  const HHmmssArray = HHmmssStr.split(":").map((v) => parseInt(v));
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
export function isStringHHmmss(testStr: string) {
  const regex = new RegExp("^\\d\\d:[0-5]\\d:[0-5]\\d$");
  return regex.test(testStr);
}