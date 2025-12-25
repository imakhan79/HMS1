
import React, { useState } from 'react';
import { Patient, OPDType } from '../types';
import { OPD_CONFIGS } from '../constants';

interface Props {
  patients: Patient[];
  onRegister: (patient: Patient, opd: OPDType) => void;
}

const ReceptionDesk: React.FC<Props> = ({ patients, onRegister }) => {
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState<Patient>({
    mrNumber: `MR-${Math.floor(100000 + Math.random() * 900000)}`,
    name: '',
    age: 0,
    gender: 'Male',
    phone: ''
  });
  const [selectedOPD, setSelectedOPD] = useState<OPDType>(OPDType.GENERAL_MEDICINE);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.mrNumber.includes(search)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return alert("Fill all details");
    onRegister(formData, selectedOPD);
    // Reset but keep MR unique
    setFormData({
      mrNumber: `MR-${Math.floor(100000 + Math.random() * 900000)}`,
      name: '',
      age: 0,
      gender: 'Male',
      phone: ''
    });
  };

  const selectExisting = (p: Patient) => {
    setFormData(p);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </span>
          Patient Registration
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">MR Number (Auto-Generated)</label>
              <input readOnly value={formData.mrNumber} className="mt-1 block w-full bg-gray-50 border border-gray-200 rounded-md p-2" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input type="number" required value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} className="mt-1 block w-full border border-gray-200 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="mt-1 block w-full border border-gray-200 rounded-md p-2">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="mt-1 block w-full border border-gray-200 rounded-md p-2" placeholder="+1 234 567 890" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Select OPD</label>
              <select value={selectedOPD} onChange={e => setSelectedOPD(e.target.value as OPDType)} className="mt-1 block w-full border border-gray-200 rounded-md p-2 bg-blue-50 font-bold">
                {Object.values(OPDType).map(o => (
                  <option key={o} value={o}>{o.replace('_', ' ')} (Fee: {OPD_CONFIGS[o].fee})</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md font-bold hover:bg-blue-700 transition-colors mt-4">
            Register & Generate Token
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Existing Patients</h2>
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Search by name or MR#" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full p-2 border border-gray-200 rounded-md" 
          />
        </div>
        <div className="flex-grow overflow-y-auto max-h-[500px] border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">MR#</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length > 0 ? filteredPatients.map(p => (
                <tr key={p.mrNumber} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm font-mono">{p.mrNumber}</td>
                  <td className="px-4 py-2 text-sm">{p.name}</td>
                  <td className="px-4 py-2">
                    <button 
                      onClick={() => selectExisting(p)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-bold"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-400">No patients found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceptionDesk;
