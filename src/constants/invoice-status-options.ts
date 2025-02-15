import { InvoiceStatus } from "src/interfaces/invoice-status";

export const invoiceStatusOptions: InvoiceStatus[] = [
  {
    key: "pending",
    value: "pending",
    text: "Pending",
    color: ""
  },
  {
    key: "paid",
    value: "paid",
    text: "Paid",
    color: ""
  },
  {
    key: "unpaid",
    value: "unpaid",
    text: "Unpaid",
    color: ""
  }
]