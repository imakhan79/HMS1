
import React from 'react';
import { Visit, LabStatus } from '../types';

interface Props {
  visits: Visit[];
  onUpdateStatus: (visitId: string, labId: string, status: LabStatus) => void;
}

const LabModule: React.FC<Props> = ({ visits, onUpdateStatus }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="bg-orange-100 text-orange-600 p-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        </span>
        Laboratory Worklist
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visits.flatMap(v => v.labOrders.map(o => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{v.token}</div>
                  <div className="text-xs text-gray-500">{v.mrNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {o.testName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    o.status === LabStatus.ORDERED ? 'bg-red-100 text-red-800' :
                    o.status === LabStatus.SAMPLE_COLLECTED ? 'bg-blue-100 text-blue-800' :
                    o.status === LabStatus.PROCESSING ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {o.status === LabStatus.ORDERED && (
                    <button onClick={() => onUpdateStatus(v.id, o.id, LabStatus.SAMPLE_COLLECTED)} className="text-blue-600 hover:text-blue-900">Collect Sample</button>
                  )}
                  {o.status === LabStatus.SAMPLE_COLLECTED && (
                    <button onClick={() => onUpdateStatus(v.id, o.id, LabStatus.PROCESSING)} className="text-yellow-600 hover:text-yellow-900">Start Process</button>
                  )}
                  {o.status === LabStatus.PROCESSING && (
                    <button onClick={() => onUpdateStatus(v.id, o.id, LabStatus.COMPLETED)} className="text-green-600 hover:text-green-900">Finalize Result</button>
                  )}
                  {o.status === LabStatus.COMPLETED && (
                    <span className="text-gray-400">Archived</span>
                  )}
                </td>
              </tr>
            )))}
            {visits.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">No lab orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabModule;
