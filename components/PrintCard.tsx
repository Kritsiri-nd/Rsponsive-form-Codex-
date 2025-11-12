'use client'

type Props = {
  id: string
  full_name: string
  company: string | null
  issued_date: string | null
  expired_date: string | null
  onPrint?: () => void
}

export default function PrintCard({ id, full_name, company, issued_date, expired_date, onPrint }: Props) {
  return (
    <div className="bg-white p-6 border rounded-lg shadow print:shadow-none print:border-none">

      <h2 className="text-center text-xl font-bold mb-4">{id}</h2>

      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr>
            <td className="border px-3 py-2 font-semibold w-40">ID NO.</td>
            <td className="border px-3 py-2 bg-yellow-100">{id}</td>
          </tr>

          <tr>
            <td className="border px-3 py-2 font-semibold">Company Name</td>
            <td className="border px-3 py-2">{company}</td>
          </tr>

          <tr>
            <td className="border px-3 py-2 font-semibold">Name Surname</td>
            <td className="border px-3 py-2">{full_name}</td>
          </tr>

          <tr>
            <td className="border px-3 py-2 font-semibold">Issued Date</td>
            <td className="border px-3 py-2">{issued_date}</td>
          </tr>

          <tr>
            <td className="border px-3 py-2 font-semibold">Expired Date</td>
            <td className="border px-3 py-2">{expired_date}</td>
          </tr>
        </tbody>
      </table>

      <div className="text-center mt-4 print:hidden">
        <button
          onClick={onPrint ?? (() => window.print())}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Print
        </button>
      </div>
    </div>
  )
}
