import dayjs from "dayjs";
import duration from "dayjs/plugin/duration"

dayjs.extend(duration);

export function MilliTimeStrToDuration(milliTimeStr) {
  const milliTimeInt = parseInt(milliTimeStr);
  return dayjs.duration(milliTimeInt);
}

export function DayjsTimeToHHmmss(dayjsTime) {
  return dayjsTime.format("HH:mm:ss");
}

export function MilliTimeStrToHHmmss(milliTimeStr) {
  const dayjsTime = MilliTimeStrToDuration(milliTimeStr);
  return DayjsTimeToHHmmss(dayjsTime);
}

export function HHmmssToDuration(HHmmssStr) {
  const HHmmssArray = HHmmssStr.split(":");
  return dayjs.duration({
    hours: HHmmssArray[0], 
    minutes: HHmmssArray[1], 
    seconds: HHmmssArray[2]
  })
}

export function isStringHHmmss(testStr) {
  const regex = new RegExp("^\\d\\d:[0-5]\\d:[0-5]\\d$");
  return regex.test(testStr);
}