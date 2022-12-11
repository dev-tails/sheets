import { DBSchema, IDBPDatabase, openDB } from 'idb';

export type Row = {
  data: any;
};

interface EngramDB extends DBSchema {
  rows: {
    value: any;
    key: number;
  };
  sheets: {
    value: {
      columns: Array<{
        type: "text" | "image",
        title: string;
      }>
    };
    key: number;
  }
}

let _db: Promise<IDBPDatabase<EngramDB>> | null = null;

export function getDb() {
  if (_db) {
    return _db;
  }

  _db = openDB<EngramDB>("sheets-db", 2, {
    upgrade: async (db, oldVersion, newVersion) => {
      if (oldVersion < 1) {
        db.createObjectStore("rows", { autoIncrement: true });
        db.createObjectStore("sheets", { autoIncrement: true });

        await addSheet({
          columns: [
            {
              type: "text",
              title: "Title"
            },
            {
              type: "image",
              title: "Image"
            }
          ]
        })

        for (let i = 0; i < 1000; i++) {
          await addRow({ columns: []});
        }
      }
    },
  });

  return _db;
}

export async function addSheet(data: EngramDB["sheets"]["value"]) {
  const db = await getDb();

  await db.add("sheets", data);
}

export async function updateSheet(key: number, data: EngramDB["sheets"]["value"]) {
  const db = await getDb();

  await db.put("sheets", data, key);
}

export async function getSheet() {
  const db = await getDb();
  return (await db.getAll("sheets"))[0];
}

export async function addRow(data: EngramDB["rows"]["value"]) {
  const db = await getDb();

  await db.add("rows", data);
}

export async function updateRow(key: number, data: EngramDB["rows"]["value"]) {
  const db = await getDb();

  await db.put("rows", data, key);
}

export async function getAllRows() {
  const db = await getDb();
  return db.getAll("rows");
}