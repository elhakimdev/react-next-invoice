import { JSONFile } from 'lowdb/node'
import { Low } from 'lowdb';
import { StatusOptionsVal } from 'src/app/invoices/add/page';
import { defaultInvoices } from './data/invoices';
import { mkdirSync } from 'fs';
import path from 'path';
export interface Invoice {
  id: string,
  name: string,
  date: string,
  number: string,
  amount: string|number,
  status: StatusOptionsVal,
}
// Define database schema
export type Data = {
  users: { id: string; name: string; email: string }[];
  invoices: Invoice[]
};

// Set database file location
const file = path.join(process.cwd(), 'src/lib/database/data/db.json');

// Ensure the data directory exists
mkdirSync(path.dirname(file), { recursive: true });

// Initialize LowDB with a default structure
const defaultData: Data = { users: [
  
], invoices: [
  ...defaultInvoices
] };
const adapter = new JSONFile<Data>(file);
const db = new Low<Data>(adapter, defaultData);

// Function to ensure database is loaded
export const getDB = async () => {
  await db.read(); // Load database

  if (!db.data || Object.keys(db.data).length === 0) {
    console.log('🔧 Database is empty. Initializing default data...');
    db.data = defaultData;
    await db.write();
  } else {
    console.log('✅ Database loaded successfully');
  }

  console.log('📂 Current DB Data:', db.data);
  return db;
};

export const saveDB = async () => {
  await db.write();
}