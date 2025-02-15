import { Invoice } from "src/lib/database/connection";
import { apiClient } from "src/utils/http-client/fetch";

export const fetchAllInvoices = async () => {
  try {
    const allInvoices = await apiClient<{ message: string; invoices: Invoice[] }>('/api/invoices', 'GET');
    console.log('✅ Invoice all');
    return allInvoices;
  } catch (error) {
    console.error('❌ Failed to load all invoice:', error);
    throw error;
  }
};