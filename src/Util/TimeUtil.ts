export function TimeCalcInInterval(baseTime: string, addTime: string, interval: string) {
  const intBaseTime = parseInt(baseTime);
  const intAddTime = parseInt(addTime);
  const intInterval = parseInt(interval);
  const calcTime = (intBaseTime + intAddTime) % intInterval;

  if (calcTime < 0) {
    return intInterval + calcTime;
  }
  return calcTime;
}