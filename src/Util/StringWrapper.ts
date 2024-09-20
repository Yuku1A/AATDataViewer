export type StringWrapper = {
  readonly value: string;
}

export function stringArrayToWrapper(values: string[]): StringWrapper[] {
  const result: StringWrapper[] = [];
  values.map((v) => result.push({value: v}));
  return result;
}