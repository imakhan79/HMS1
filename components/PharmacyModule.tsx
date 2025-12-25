
import React from 'react';
import { Visit } from '../types';

interface Props {
  visits: Visit[];
  onDispense: (visitId: string) => void;
}

const PharmacyModule: React.FC<Props> = ({ visits, onDispense }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
       <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="bg-green-100 text-green-600 p-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        </span>
        Pharmacy Counter
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visits.map(v => (
          <div key={v.id} className="border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{v.token}</h3>
                <p className="text-xs text-gray-500">{v.mrNumber}</p>
              </div>
              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">READY TO DISPENSE</span>
            </div>
            
            <div className="space-y-2 mb-4">
              {v.prescriptions.map((p, i) => (
                <div key={i} className="flex justify-between text-sm border-b pb-1">
                  <span>{p.medicineName}</span>
                  <span className="font-mono text-gray-500">{p.dosage}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                alert(`Medications for ${v.token} dispensed and inventory updated.`);
                onDispense(v.id);
              }}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
            >
              Mark as Dispensed
            </button>
          </div>
        ))}
        {visits.length === 0 && <div className="col-span-full py-20 text-center text-gray-400">No prescriptions waiting.</div>}
      </div>
    </div>
  );
};

export default PharmacyModule;
