export default class Session{
  constructor(
    public readonly sessionName: string, 
    public readonly trainRecord: any, 
    public readonly opTimer: any, 
    public readonly lSpawnList: any
  ) { }

  static isThis(value: unknown): value is Session {
    const value2 = value as Record<keyof Session, unknown>;
    if (typeof value2.sessionName !== "string")
      return false;
    if (typeof value2.lSpawnList !== "object")
      return false;
    if (typeof value2.opTimer !== "object")
      return false;
    if (typeof value2.trainRecord !== "object")
      return false;
    return true;
  }
}