export function LocLookup(locName, location) {
  if (locName != null)
    return locName;

  const intX = Math.floor(location["x"]);
  const intY = Math.floor(location["y"]);
  const intZ = Math.floor(location["z"]);
  const locstr = "[" + intX + "/" + intY + "/" + intZ + "]"
  return locstr;
}