import Dexie, { type Table } from "dexie";

interface Session {
  name: string;
  value: string;
}

export const db = new Dexie("AATDataViewer") as Dexie & {
  sessions: Table<Session, string>
};
db.version(1).stores({
  sessions: "name"
});

export function put(key: string, jsonString: string) {
  return db.sessions.put({name: key, value: jsonString});
}

export async function get(key: string) {
  const recordObj = await db.sessions.get(key);
  if (typeof recordObj === "undefined")
    throw new Error();
  return recordObj.value;
}

export function remove(key: string) {
  return db.sessions.delete(key);
}

export function getKeys() {
  const collections = db.sessions.toCollection();
  return collections.primaryKeys();
}