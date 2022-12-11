import { DBSchema, IDBPDatabase, openDB } from 'idb';

export type Row = {
  data: any;
};

interface EngramDB extends DBSchema {
  rows: {
    value: any;
    key: string;
  };
}

let _db: Promise<IDBPDatabase<EngramDB>> | null = null;

export function getDb() {
  if (_db) {
    return _db;
  }

  _db = openDB<EngramDB>("sheets-db", 1, {
    upgrade(db, oldVersion, newVersion) {
      if (oldVersion < 1) {
        db.createObjectStore("rows", { autoIncrement: true });
      }
    },
  });

  return _db;
}

export async function addRow(data: EngramDB["rows"]["value"]) {
  const db = await getDb();

  await db.add("rows", data);
}

export async function getAllRows() {
  const db = await getDb();
  return db.getAll("rows");
}