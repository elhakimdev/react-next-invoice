import { Invoice, getDB, saveDB } from "src/lib/database/connection";

import { NextResponse } from "next/server";

// Fetch all invoices (optional filtering by status)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status");

  const db = await getDB();
  let invoices = db.data.invoices;
  console.log(invoices, db, db.data);

  if (statusFilter) {
    invoices = invoices.filter((invoice) => invoice.status === statusFilter);
  }

  return NextResponse.json(invoices);
}

// Create a new invoice
export async function POST(req: Request) {
  const db = await getDB();
  const body = await req.json();

  if (!body.name || !body.date || !body.number || !body.amount || !body.status) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const newInvoice: Invoice = {
    id: crypto.randomUUID(),
    name: body.name,
    date: body.date,
    number: body.number,
    amount: body.amount,
    status: body.status,
  };

  db.data.invoices.push(newInvoice);
  await saveDB();
  return NextResponse.json({ message: "Invoice added", data: newInvoice });
}

// Update an invoice
export async function PUT(req: Request) {
  const db = await getDB();
  const body = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
  }

  const invoiceIndex = db.data.invoices.findIndex((invoice) => invoice.id === body.id);
  if (invoiceIndex === -1) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  db.data.invoices[invoiceIndex] = { ...db.data.invoices[invoiceIndex], ...body };
  await saveDB();
  return NextResponse.json({ message: "Invoice updated", data: db.data.invoices[invoiceIndex] });
}

// Delete an invoice
export async function DELETE(req: Request) {
  const db = await getDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
  }

  const initialLength = db.data.invoices.length;
  db.data.invoices = db.data.invoices.filter((invoice) => invoice.id !== id);

  if (db.data.invoices.length === initialLength) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  await saveDB();
  return NextResponse.json({ message: "Invoice deleted" });
}
