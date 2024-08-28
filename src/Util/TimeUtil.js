export function TimeCalcInInterval(baseTime, addTime, interval) {
  const intBaseTime = parseInt(baseTime);
  const intAddTime = parseInt(addTime);
  const intInterval = parseInt(interval);
  const calcTime = (intBaseTime + intAddTime) % intInterval;

  if (calcTime < 0) {
    return intInterval + calcTime;
  }
  return calcTime;
}