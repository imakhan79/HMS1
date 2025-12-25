
import React, { useState } from 'react';
import { Visit, Vitals, OPDType } from '../types';

interface Props {
  visits: Visit[];
  onUpdate: (visitId: string, vitals: Vitals) => void;
}

const NurseStation: React.FC<Props> = ({ visits, onUpdate }) => {
  const [activeVisit, setActiveVisit] = useState<Visit | null>(null);
  const [vitals, setVitals] = useState<Vitals>({
    bloodPressure: '120/80',
    heartRate: 72,
    temperature: 98.6,
    oxygenSaturation: 98,
    weight: 70,
    timestamp: new Date().toISOString()
  });

  const handleSave = () => {
    if (activeVisit) {
      onUpdate(activeVisit.id, { ...vitals, timestamp: new Date().toISOString() });
      setActiveVisit(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="bg-teal-100 text-teal-600 p-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </span>
          Vitals Counter Queue ({visits.length})
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visits.map(v => (
            <div 
              key={v.id} 
              className="border p-4 rounded-xl hover:border-teal-500 hover:bg-teal-50 cursor-pointer transition-all flex justify-between items-center group shadow-sm"
              onClick={() => {
                setActiveVisit(v);
                setVitals({ ...vitals, fetalHeartRate: undefined, headCircumference: undefined });
              }}
            >
              <div>
                <p className="font-black text-xl text-teal-700">{v.token}</p>
                <p className="text-xs font-bold text-gray-500 uppercase">{v.opd.replace('_', ' ')}</p>
                <p className="text-[10px] text-gray-400 font-mono">MR: {v.mrNumber}</p>
              </div>
              <span className="bg-teal-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              </span>
            </div>
          ))}
          {visits.length === 0 && <p className="text-gray-400 col-span-full py-10 text-center border-2 border-dashed rounded-xl">No patients waiting in queue.</p>}
        </div>
      </div>

      {activeVisit && (
        <div className="bg-white p-6 rounded-xl shadow-2xl border-2 border-teal-500 animate-in fade-in slide-in-from-bottom-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-black text-teal-800">{activeVisit.token}</h3>
                <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{activeVisit.opd.replace('_', ' ')}</span>
              </div>
              <p className="text-gray-500 mt-1 font-medium">Capturing Vitals for Visit ID: {activeVisit.id}</p>
            </div>
            <button onClick={() => setActiveVisit(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="text-xs font-black uppercase text-gray-400 mb-1 block">BP (mmHg)</label>
              <input value={vitals.bloodPressure} onChange={e => setVitals({...vitals, bloodPressure: e.target.value})} className="w-full text-2xl font-black text-teal-600 bg-transparent border-b-4 border-gray-200 focus:border-teal-500 outline-none transition-colors py-1" placeholder="120/80" />
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Pulse (BPM)</label>
              <input type="number" value={vitals.heartRate} onChange={e => setVitals({...vitals, heartRate: parseInt(e.target.value)})} className="w-full text-2xl font-black text-teal-600 bg-transparent border-b-4 border-gray-200 focus:border-teal-500 outline-none transition-colors py-1" />
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Temp (°F)</label>
              <input type="number" step="0.1" value={vitals.temperature} onChange={e => setVitals({...vitals, temperature: parseFloat(e.target.value)})} className="w-full text-2xl font-black text-teal-600 bg-transparent border-b-4 border-gray-200 focus:border-teal-500 outline-none transition-colors py-1" />
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="text-xs font-black uppercase text-gray-400 mb-1 block">SpO2 (%)</label>
              <input type="number" value={vitals.oxygenSaturation} onChange={e => setVitals({...vitals, oxygenSaturation: parseInt(e.target.value)})} className="w-full text-2xl font-black text-teal-600 bg-transparent border-b-4 border-gray-200 focus:border-teal-500 outline-none transition-colors py-1" />
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Weight (kg)</label>
              <input type="number" value={vitals.weight} onChange={e => setVitals({...vitals, weight: parseInt(e.target.value)})} className="w-full text-2xl font-black text-teal-600 bg-transparent border-b-4 border-gray-200 focus:border-teal-500 outline-none transition-colors py-1" />
            </div>

            {/* Specialty Specific Fields */}
            {activeVisit.opd === OPDType.GYNECOLOGY && (
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                <label className="text-xs font-black uppercase text-rose-400 mb-1 block">Fetal HR (BPM)</label>
                <input type="number" value={vitals.fetalHeartRate || ''} onChange={e => setVitals({...vitals, fetalHeartRate: parseInt(e.target.value)})} className="w-full text-2xl font-black text-rose-600 bg-transparent border-b-4 border-rose-200 focus:border-rose-500 outline-none transition-colors py-1" />
              </div>
            )}
            {activeVisit.opd === OPDType.PEDIATRICS && (
              <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                <label className="text-xs font-black uppercase text-cyan-400 mb-1 block">Head Circ. (cm)</label>
                <input type="number" step="0.1" value={vitals.headCircumference || ''} onChange={e => setVitals({...vitals, headCircumference: parseFloat(e.target.value)})} className="w-full text-2xl font-black text-cyan-600 bg-transparent border-b-4 border-cyan-200 focus:border-cyan-500 outline-none transition-colors py-1" />
              </div>
            )}
          </div>

          <button 
            onClick={handleSave} 
            className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-teal-700 transition-all shadow-xl hover:shadow-teal-200 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            Complete Vitals Check & Move to Junior Doctor
          </button>
        </div>
      )}
    </div>
  );
};

export default NurseStation;
