
import React from 'react';
import { Visit } from '../types';

interface Props {
  visits: Visit[];
  onPaymentComplete: (visitId: string) => void;
}

const BillingModule: React.FC<Props> = ({ visits, onPaymentComplete }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
       <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="bg-rose-100 text-rose-600 p-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </span>
        Accounts & Unified Billing
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Token</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill Summary</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visits.map(v => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-bold text-rose-600">{v.token}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                   <div className="font-medium text-gray-900">{v.mrNumber}</div>
                   <div className="text-gray-500">{v.opd.replace('_', ' ')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                   <ul className="list-disc list-inside">
                     <li>OPD Fee: ${v.consultationFee}</li>
                     {v.labOrders.length > 0 && <li>Labs: {v.labOrders.length} tests</li>}
                     {v.prescriptions.length > 0 && <li>Pharmacy: {v.prescriptions.length} items</li>}
                   </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-bold text-gray-900">
                  ${v.totalAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                   <button 
                     onClick={() => {
                       if (confirm(`Accept payment of $${v.totalAmount} for ${v.token}?`)) {
                         onPaymentComplete(v.id);
                       }
                     }}
                     className="bg-rose-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-rose-700"
                   >
                     Complete Transaction
                   </button>
                </td>
              </tr>
            ))}
            {visits.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400 italic">No pending bills at the moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingModule;
