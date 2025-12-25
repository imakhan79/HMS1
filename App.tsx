
import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserRole, Patient, Visit, VisitStatus, OPDType, 
  LabStatus, Vitals, LabOrder, Prescription 
} from './types';
import { OPD_CONFIGS, ROLE_THEMES } from './constants';
import ReceptionDesk from './components/ReceptionDesk';
import NurseStation from './components/NurseStation';
import JuniorDoctorDesk from './components/JuniorDoctorDesk';
import ConsultantRoom from './components/ConsultantRoom';
import LabModule from './components/LabModule';
import PharmacyModule from './components/PharmacyModule';
import BillingModule from './components/BillingModule';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>('RECEPTION');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [tokenCounters, setTokenCounters] = useState<Record<OPDType, number>>({
    [OPDType.GYNECOLOGY]: 0,
    [OPDType.PEDIATRICS]: 0,
    [OPDType.ENT]: 0,
    [OPDType.DENTAL]: 0,
    [OPDType.GENERAL_MEDICINE]: 0,
    [OPDType.CARDIOLOGY]: 0,
  });

  // Helper to update a visit
  const updateVisit = (visitId: string, updates: Partial<Visit>) => {
    setVisits(prev => prev.map(v => v.id === visitId ? { ...v, ...updates } : v));
  };

  // Workflow Handlers
  const handleRegistration = (patient: Patient, opd: OPDType) => {
    const isNew = !patients.find(p => p.mrNumber === patient.mrNumber);
    if (isNew) setPatients(prev => [...prev, patient]);

    const newTokenNum = tokenCounters[opd] + 1;
    setTokenCounters(prev => ({ ...prev, [opd]: newTokenNum }));

    const newVisit: Visit = {
      id: Math.random().toString(36).substr(2, 9),
      mrNumber: patient.mrNumber,
      opd,
      token: `${OPD_CONFIGS[opd].prefix}-${String(newTokenNum).padStart(3, '0')}`,
      status: VisitStatus.REGISTERED,
      createdAt: new Date().toISOString(),
      labOrders: [],
      prescriptions: [],
      consultationFee: OPD_CONFIGS[opd].fee,
      paid: false,
      totalAmount: OPD_CONFIGS[opd].fee
    };

    setVisits(prev => [...prev, newVisit]);
    alert(`Token Generated: ${newVisit.token}`);
  };

  const renderDashboard = () => {
    switch (role) {
      case 'RECEPTION': 
        return <ReceptionDesk patients={patients} onRegister={handleRegistration} />;
      case 'NURSE':
        return <NurseStation 
          visits={visits.filter(v => [VisitStatus.REGISTERED, VisitStatus.VITALS_PENDING].includes(v.status))} 
          onUpdate={(id, vitals) => updateVisit(id, { vitals, status: VisitStatus.JUNIOR_PENDING })}
        />;
      case 'JUNIOR_DOCTOR':
        return <JuniorDoctorDesk 
          visits={visits.filter(v => v.status === VisitStatus.JUNIOR_PENDING)}
          onForward={(id, updates) => updateVisit(id, { ...updates, status: VisitStatus.CONSULTANT_PENDING })}
        />;
      case 'CONSULTANT':
        return <ConsultantRoom 
          visits={visits.filter(v => v.status === VisitStatus.CONSULTANT_PENDING)}
          onComplete={(id, updates) => {
             const hasLab = updates.labOrders && updates.labOrders.length > 0;
             const hasPharmacy = updates.prescriptions && updates.prescriptions.length > 0;
             let nextStatus = VisitStatus.BILLING_PENDING;
             if (hasLab) nextStatus = VisitStatus.LAB_PENDING;
             else if (hasPharmacy) nextStatus = VisitStatus.PHARMACY_PENDING;
             updateVisit(id, { ...updates, status: nextStatus });
          }}
        />;
      case 'LAB':
        return <LabModule 
          visits={visits.filter(v => v.status === VisitStatus.LAB_PENDING || v.labOrders.length > 0)}
          onUpdateStatus={(visitId, labId, status) => {
            const visit = visits.find(v => v.id === visitId);
            if (!visit) return;
            const newOrders = visit.labOrders.map(o => o.id === labId ? { ...o, status } : o);
            const allDone = newOrders.every(o => o.status === LabStatus.COMPLETED);
            const hasPharmacy = visit.prescriptions.length > 0;
            updateVisit(visitId, { 
              labOrders: newOrders, 
              status: allDone ? (hasPharmacy ? VisitStatus.PHARMACY_PENDING : VisitStatus.BILLING_PENDING) : visit.status 
            });
          }}
        />;
      case 'PHARMACY':
        return <PharmacyModule 
          visits={visits.filter(v => v.status === VisitStatus.PHARMACY_PENDING || v.prescriptions.length > 0)}
          onDispense={(visitId) => updateVisit(visitId, { status: VisitStatus.BILLING_PENDING })}
        />;
      case 'CASHIER':
        return <BillingModule 
          visits={visits.filter(v => v.status === VisitStatus.BILLING_PENDING)}
          onPaymentComplete={(visitId) => updateVisit(visitId, { status: VisitStatus.COMPLETED, paid: true })}
        />;
      case 'ADMIN':
        return <Dashboard visits={visits} patients={patients} />;
      default:
        return <div>Select a role from the top navigation.</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`${ROLE_THEMES[role]} text-white p-4 shadow-lg sticky top-0 z-50 transition-colors duration-300`}>
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            <h1 className="text-xl font-bold tracking-tight">OmniClinic <span className="text-xs font-normal opacity-75">Integrated OPD</span></h1>
          </div>
          
          <nav className="flex flex-wrap gap-2">
            {(['RECEPTION', 'NURSE', 'JUNIOR_DOCTOR', 'CONSULTANT', 'LAB', 'PHARMACY', 'CASHIER', 'ADMIN'] as UserRole[]).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${role === r ? 'bg-white text-gray-900 shadow-md scale-105' : 'bg-black/10 hover:bg-black/20 text-white'}`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4">
        {renderDashboard()}
      </main>

      <footer className="bg-white border-t p-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} OmniClinic Enterprise HMS. Built for Integrated Workflows.
      </footer>
    </div>
  );
};

export default App;
