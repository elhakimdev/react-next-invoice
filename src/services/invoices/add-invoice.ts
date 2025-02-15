import { Invoice } from "src/lib/database/connection";
import { apiClient } from "src/utils/http-client/fetch";

export const addInvoice = async (invoice: Partial<Invoice>) => {
  try {
    const newInvoice = await apiClient<{ message: string; invoice: Invoice }>('/api/invoices', 'POST', invoice);
    console.log('✅ Invoice added successfully:', newInvoice.invoice);
    return newInvoice;
  } catch (error) {
    console.error('❌ Failed to add invoice:', error);
    throw error;
  }
};