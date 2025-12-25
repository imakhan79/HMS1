
import React, { useState } from 'react';
import { Visit, LabOrder, LabStatus, SpecialtyData } from '../types';
import { getClinicalInsights } from '../services/geminiService';
import SpecialtyFormSwitcher from './SpecialtyFormSwitcher';

interface Props {
  visits: Visit[];
  onForward: (visitId: string, updates: Partial<Visit>) => void;
}

const JuniorDoctorDesk: React.FC<Props> = ({ visits, onForward }) => {
  const [activeVisit, setActiveVisit] = useState<Visit | null>(null);
  const [notes, setNotes] = useState('');
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState('');
  const [specialtyData, setSpecialtyData] = useState<SpecialtyData>({});
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiInsights, setAiInsights] = useState<{summary: string, differentials: string[]} | null>(null);

  const availableTests = [
    { id: 'CBC', name: 'Complete Blood Count', cost: 150 },
    { id: 'LFT', name: 'Liver Function Test', cost: 300 },
    { id: 'RFT', name: 'Renal Function Test', cost: 300 },
    { id: 'USG', name: 'Ultrasound Scan', cost: 800 },
    { id: 'XRAY', name: 'Chest X-Ray', cost: 400 },
    { id: 'HCG', name: 'Beta HCG', cost: 450 },
    { id: 'ECG', name: '12-Lead ECG', cost: 200 },
  ];

  const handleGetAIHelp = async () => {
    if (!activeVisit?.vitals) return;
    setLoadingAI(true);
    const result = await getClinicalInsights(activeVisit.vitals, notes);
    setAiInsights(result);
    setLoadingAI(false);
  };

  const handleForward = () => {
    if (!activeVisit) return;
    
    const labOrders: LabOrder[] = selectedTests.map(testId => {
      const test = availableTests.find(t => t.id === testId)!;
      return {
        id: Math.random().toString(36).substr(2, 9),
        testName: test.name,
        status: LabStatus.ORDERED,
        cost: test.cost
      };
    });

    const totalTestCost = labOrders.reduce((acc, curr) => acc + curr.cost, 0);

    onForward(activeVisit.id, {
      preliminaryNotes: notes,
      diagnosis: provisionalDiagnosis,
      specialtyData,
      labOrders,
      totalAmount: activeVisit.totalAmount + totalTestCost
    });
    
    setActiveVisit(null);
    setNotes('');
    setProvisionalDiagnosis('');
    setSpecialtyData({});
    setSelectedTests([]);
    setAiInsights(null);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Patient Assessment Queue</h2>
        <div className="space-y-3">
          {visits.map(v => (
            <div 
              key={v.id} 
              className={`p-4 rounded-xl cursor-pointer border-l-8 transition-all hover:scale-[1.02] ${activeVisit?.id === v.id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-200 hover:bg-gray-50'}`}
              onClick={() => {
                setActiveVisit(v);
                setNotes(v.preliminaryNotes || '');
                setProvisionalDiagnosis(v.diagnosis || '');
                setSpecialtyData(v.specialtyData || {});
              }}
            >
              <div className="flex justify-between items-start">
                <span className="font-black text-lg text-indigo-900">{v.token}</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase font-bold">{v.opd}</span>
              </div>
              <p className="text-xs text-gray-500 font-mono mt-1">{v.mrNumber}</p>
            </div>
          ))}
          {visits.length === 0 && <p className="text-center text-gray-400 py-10 italic">Waiting for nurse to forward patients...</p>}
        </div>
      </div>

      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
        {activeVisit ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h2 className="text-2xl font-black text-indigo-900 uppercase">Assessment: {activeVisit.token}</h2>
                <p className="text-sm text-gray-400">Junior Doctor Desk | ID: {activeVisit.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 lg:grid-cols-6 gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              <div className="text-center p-2 rounded-lg bg-white border border-indigo-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase">BP</p>
                <p className="font-black text-indigo-600">{activeVisit.vitals?.bloodPressure}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-white border border-indigo-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase">HR</p>
                <p className="font-black text-indigo-600">{activeVisit.vitals?.heartRate}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-white border border-indigo-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Temp</p>
                <p className="font-black text-indigo-600">{activeVisit.vitals?.temperature}°F</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-white border border-indigo-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase">SpO2</p>
                <p className="font-black text-indigo-600">{activeVisit.vitals?.oxygenSaturation}%</p>
              </div>
              {activeVisit.vitals?.fetalHeartRate && (
                <div className="text-center p-2 rounded-lg bg-rose-50 border border-rose-100">
                  <p className="text-[10px] text-rose-400 font-bold uppercase">Fetal HR</p>
                  <p className="font-black text-rose-600">{activeVisit.vitals.fetalHeartRate}</p>
                </div>
              )}
            </div>

            {/* Specialty Clinical Fields */}
            <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
               <SpecialtyFormSwitcher 
                 opd={activeVisit.opd} 
                 data={specialtyData} 
                 onChange={setSpecialtyData} 
               />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-black text-gray-700 uppercase">Symptoms & Notes</label>
                  <button 
                    onClick={handleGetAIHelp}
                    disabled={loadingAI}
                    className="text-[10px] flex items-center gap-1 bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-black uppercase hover:bg-indigo-200 transition-colors"
                  >
                    {loadingAI ? 'AI Analyzing...' : 'Clinical AI Assistant'}
                  </button>
                </div>
                <textarea 
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full h-24 p-3 border rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm"
                  placeholder="Patient describes severe headache and nausea..."
                />
              </div>

              {aiInsights && (
                <div className="bg-indigo-600 text-white p-4 rounded-xl shadow-lg animate-in fade-in zoom-in-95">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" /></svg>
                    <h4 className="text-xs font-black uppercase tracking-wider">AI Clinical Insight</h4>
                  </div>
                  <p className="text-xs mb-3 font-medium opacity-90 leading-relaxed">{aiInsights.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {aiInsights.differentials.map(d => (
                      <span key={d} className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold border border-white/30">{d}</span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-black text-gray-700 uppercase mb-1">Provisional Diagnosis</label>
                <input 
                  value={provisionalDiagnosis}
                  onChange={e => setProvisionalDiagnosis(e.target.value)}
                  className="w-full p-3 border rounded-xl text-sm font-bold text-indigo-900"
                  placeholder="e.g. Acute Migraine / Seasonal Viral"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-gray-700 uppercase mb-2">Diagnostic Orders</label>
                <div className="flex flex-wrap gap-2">
                  {availableTests.map(test => (
                    <button
                      key={test.id}
                      onClick={() => setSelectedTests(prev => prev.includes(test.id) ? prev.filter(i => i !== test.id) : [...prev, test.id])}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all ${selectedTests.includes(test.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      {test.name} (${test.cost})
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleForward}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                Forward to Consultant
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4">
            <svg className="w-24 h-24 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p className="font-bold text-lg">Select a patient token to start screening</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JuniorDoctorDesk;
