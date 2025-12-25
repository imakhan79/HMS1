
import React, { useState } from 'react';
import { Visit, LabOrder, LabStatus, Prescription, SpecialtyData } from '../types';
import SpecialtyFormSwitcher from './SpecialtyFormSwitcher';

interface Props {
  visits: Visit[];
  onComplete: (visitId: string, updates: Partial<Visit>) => void;
}

const ConsultantRoom: React.FC<Props> = ({ visits, onComplete }) => {
  const [activeVisit, setActiveVisit] = useState<Visit | null>(null);
  const [finalDiagnosis, setFinalDiagnosis] = useState('');
  const [specialtyData, setSpecialtyData] = useState<SpecialtyData>({});
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [newMed, setNewMed] = useState({ name: '', dose: '', dur: '' });

  const addMed = () => {
    if (!newMed.name) return;
    setPrescriptions([...prescriptions, {
      medicineName: newMed.name,
      dosage: newMed.dose,
      duration: newMed.dur,
      cost: 50
    }]);
    setNewMed({ name: '', dose: '', dur: '' });
  };

  const handleComplete = () => {
    if (!activeVisit) return;
    const medCost = prescriptions.reduce((acc, curr) => acc + curr.cost, 0);
    onComplete(activeVisit.id, {
      diagnosis: finalDiagnosis || activeVisit.diagnosis,
      specialtyData,
      prescriptions,
      totalAmount: activeVisit.totalAmount + medCost
    });
    setActiveVisit(null);
    setPrescriptions([]);
    setFinalDiagnosis('');
    setSpecialtyData({});
  };

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
        <h2 className="text-lg font-black text-purple-900 mb-6 flex items-center justify-between">
          Consultant Queue
          <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-[10px]">{visits.length} Ready</span>
        </h2>
        <div className="space-y-4">
          {visits.map(v => (
            <div 
              key={v.id} 
              className={`p-4 rounded-xl cursor-pointer border-2 transition-all hover:scale-105 ${activeVisit?.id === v.id ? 'border-purple-600 bg-purple-50 shadow-lg' : 'border-gray-100 hover:bg-gray-50'}`}
              onClick={() => {
                setActiveVisit(v);
                setFinalDiagnosis(v.diagnosis || '');
                setSpecialtyData(v.specialtyData || {});
              }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-black text-purple-900">{v.token}</span>
                <span className="text-[10px] text-purple-400 font-bold uppercase">{v.opd}</span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono">{v.mrNumber}</p>
            </div>
          ))}
          {visits.length === 0 && <p className="text-center text-gray-400 py-10 italic">Consultation queue is empty.</p>}
        </div>
      </div>

      <div className="md:col-span-3 space-y-6">
        {activeVisit ? (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-purple-100 animate-in fade-in slide-in-from-right-8">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-purple-50">
              <div>
                <h2 className="text-3xl font-black text-purple-900">Patient: {activeVisit.token}</h2>
                <p className="text-gray-400 font-medium">Full Clinical Consultation & E-Prescription</p>
              </div>
              <div className="bg-purple-100 text-purple-700 px-6 py-2 rounded-full font-black text-sm">Consultation Active</div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">Pre-Consultation Screening</h3>
                <div className="space-y-3">
                  <p className="text-sm"><strong>Initial Symptoms:</strong> <span className="text-gray-600 italic">{activeVisit.preliminaryNotes || 'N/A'}</span></p>
                  <p className="text-sm"><strong>Junior Diagnosis:</strong> <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-bold text-xs uppercase">{activeVisit.diagnosis || 'Pending'}</span></p>
                  <div className="pt-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Ordered Investigations</p>
                    <div className="flex flex-wrap gap-2">
                      {activeVisit.labOrders.map(l => (
                        <span key={l.id} className="text-[10px] bg-white border border-blue-100 text-blue-600 px-3 py-1 rounded-lg font-bold shadow-sm">{l.testName}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100">
                <h3 className="text-xs font-black text-teal-600 uppercase mb-4 tracking-widest">Vital Signs Log</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-teal-50 shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold">BP</p>
                    <p className="font-black text-teal-700">{activeVisit.vitals?.bloodPressure}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-teal-50 shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold">HR</p>
                    <p className="font-black text-teal-700">{activeVisit.vitals?.heartRate}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-teal-50 shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold">Temp</p>
                    <p className="font-black text-teal-700">{activeVisit.vitals?.temperature}°F</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-teal-50 shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold">SpO2</p>
                    <p className="font-black text-teal-700">{activeVisit.vitals?.oxygenSaturation}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialty Assessment (Editable by Consultant too) */}
            <div className="mb-10 p-6 rounded-2xl border-2 border-dashed border-purple-100">
               <h3 className="text-xs font-black text-purple-400 uppercase mb-4 tracking-widest">Specialty-Specific Assessment</h3>
               <SpecialtyFormSwitcher 
                 opd={activeVisit.opd} 
                 data={specialtyData} 
                 onChange={setSpecialtyData} 
               />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black text-purple-900 uppercase mb-2">Final Clinical Impression</label>
                <textarea 
                  value={finalDiagnosis}
                  onChange={e => setFinalDiagnosis(e.target.value)}
                  className="w-full h-24 p-4 border rounded-2xl focus:ring-4 focus:ring-purple-100 outline-none text-sm transition-all shadow-inner bg-gray-50/30"
                  placeholder="Finalize the diagnosis here..."
                />
              </div>

              <div className="border-t pt-8">
                <h3 className="text-sm font-black text-purple-900 uppercase mb-6 flex items-center gap-3">
                   <span className="bg-purple-600 text-white p-2 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                   </span>
                   Master E-Prescription
                </h3>
                
                <div className="grid grid-cols-4 gap-4 mb-6 bg-purple-50 p-4 rounded-2xl">
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-purple-400 uppercase ml-1">Drug Name</label>
                    <input value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} className="w-full p-3 border rounded-xl text-sm font-bold" placeholder="Medicine Name" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-purple-400 uppercase ml-1">Dosage</label>
                    <input value={newMed.dose} onChange={e => setNewMed({...newMed, dose: e.target.value})} className="w-full p-3 border rounded-xl text-sm" placeholder="1-0-1" />
                  </div>
                  <div className="flex items-end">
                    <button onClick={addMed} className="w-full bg-purple-600 text-white p-3 rounded-xl font-black text-xs uppercase hover:bg-purple-700 shadow-lg">Add Med</button>
                  </div>
                </div>

                <div className="space-y-3 mb-10">
                  {prescriptions.map((m, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm group hover:border-purple-300 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="bg-purple-100 text-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black">{i+1}</span>
                        <div>
                          <p className="font-black text-purple-900 text-sm">{m.medicineName}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">{m.dosage}</p>
                        </div>
                      </div>
                      <button onClick={() => setPrescriptions(prescriptions.filter((_, idx) => idx !== i))} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                  {prescriptions.length === 0 && <p className="text-center py-6 text-gray-300 text-sm border-2 border-dashed rounded-2xl">No medications prescribed yet.</p>}
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleComplete} 
                    className="flex-grow bg-purple-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-purple-700 transition-all shadow-2xl hover:shadow-purple-200 active:scale-[0.98] flex items-center justify-center gap-4"
                  >
                    Finalize & Sync to Pharmacy/Lab/Billing
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-32 rounded-3xl border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300">
             <div className="bg-gray-50 p-8 rounded-full mb-6">
                <svg className="w-24 h-24 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
             </div>
             <p className="text-2xl font-black uppercase tracking-widest text-gray-400">Waiting for clinical assessment</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantRoom;
