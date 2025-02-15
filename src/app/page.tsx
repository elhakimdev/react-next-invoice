import Link from 'next/link'

export default function Index() {
  return (
      <div>
        <div className="wrapper">
          <div className="container">
            <div id="welcome">
              <h1>
                <span> Hello there, </span>
                Welcome react-next-invoice 👋
              </h1>

              <Link href={"/invoices/listing"}>Goto Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
