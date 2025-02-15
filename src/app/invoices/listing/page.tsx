import { AppPageTitle } from "src/components/app-page-title"

export default function ListInvoices() {
  return (
    <div>
      <AppPageTitle title="Invoices"/>
      <ul>
        <li>Invoice 1</li>
        <li>Invoice 2</li>
        <li>Invoice 3</li>
      </ul>
    </div>
  );
}