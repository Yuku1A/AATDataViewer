import Dexie from "dexie";

const db = new Dexie("AATDataViewer");
db.version(1).stores({
  sessions: "name"
});
export default db;