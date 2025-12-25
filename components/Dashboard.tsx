
import React, { useMemo } from 'react';
import { Visit, VisitStatus, Patient, OPDType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { OPD_CONFIGS } from '../constants';

interface Props {
  visits: Visit[];
  patients: Patient[];
}

const Dashboard: React.FC<Props> = ({ visits, patients }) => {
  const stats = useMemo(() => {
    const totalRevenue = visits.reduce((acc, v) => acc + (v.paid ? v.totalAmount : 0), 0);
    
    const opdMetrics = Object.values(OPDType).map(opd => {
      const opdVisits = visits.filter(v => v.opd === opd);
      const revenue = opdVisits.reduce((acc, v) => acc + (v.paid ? v.totalAmount : 0), 0);
      return {
        name: opd.replace('_', ' '),
        visits: opdVisits.length,
        revenue,
        color: OPD_CONFIGS[opd].color
      };
    });

    const statusData = [
      { name: 'Waiting', value: visits.filter(v => ![VisitStatus.COMPLETED, VisitStatus.BILLING_PENDING].includes(v.status)).length },
      { name: 'Billing', value: visits.filter(v => v.status === VisitStatus.BILLING_PENDING).length },
      { name: 'Completed', value: visits.filter(v => v.status === VisitStatus.COMPLETED).length }
    ];

    return { totalRevenue, opdMetrics, statusData };
  }, [visits]);

  const COLORS = {
    blue: '#3B82F6',
    rose: '#F43F5E',
    cyan: '#06B6D4',
    amber: '#F59E0B',
    slate: '#64748B',
    red: '#EF4444',
    indigo: '#6366F1',
    teal: '#14B8A6'
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:bg-blue-600 transition-all duration-300">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-200">Total Registered</p>
          <p className="text-4xl font-black text-blue-600 group-hover:text-white">{patients.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:bg-green-600 transition-all duration-300">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-green-200">Total Revenue</p>
          <p className="text-4xl font-black text-green-600 group-hover:text-white">${stats.totalRevenue}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:bg-indigo-600 transition-all duration-300">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-indigo-200">Today's Visits</p>
          <p className="text-4xl font-black text-indigo-600 group-hover:text-white">{visits.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:bg-rose-600 transition-all duration-300">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-rose-200">Waitlist Size</p>
          <p className="text-4xl font-black text-rose-600 group-hover:text-white">{visits.filter(v => v.status !== VisitStatus.COMPLETED).length}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Workload by OPD */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-[450px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
             <h3 className="font-black text-xl text-gray-900 uppercase tracking-wider">OPD Workload Analysis</h3>
             <span className="text-xs font-bold text-gray-400">Total Tokens Generated</span>
          </div>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.opdMetrics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={140} fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="visits" radius={[0, 10, 10, 0]} barSize={25}>
                  {stats.opdMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={(COLORS as any)[entry.color]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-[450px] flex flex-col">
          <h3 className="font-black text-xl text-gray-900 uppercase tracking-wider mb-8">Visit Progress</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={COLORS.indigo} />
                  <Cell fill={COLORS.amber} />
                  <Cell fill={COLORS.teal} />
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{paddingTop: '20px', fontWeight: 'bold', fontSize: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Real-time OPD Breakdown Table */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="font-black text-xl text-gray-900 uppercase tracking-wider mb-8 flex items-center gap-3">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          Live Specialty Revenue & Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">
                <th className="p-4 rounded-tl-2xl">Specialty</th>
                <th className="p-4">Consultant</th>
                <th className="p-4">Today's Load</th>
                <th className="p-4">Est. Revenue</th>
                <th className="p-4 rounded-tr-2xl text-right">Performance</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.opdMetrics.map((m, idx) => {
                const config = Object.values(OPD_CONFIGS).find(c => c.type.replace('_', ' ') === m.name);
                return (
                  <tr key={idx} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                       <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-${m.color}-100 text-${m.color}-600`}>
                          {config?.icon}
                       </span>
                       <span className="font-black text-gray-700">{m.name}</span>
                    </td>
                    <td className="p-4 font-bold text-gray-500">{config?.consultant}</td>
                    <td className="p-4">
                       <div className="flex items-center gap-2">
                          <span className="font-black text-gray-900">{m.visits}</span>
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{width: `${Math.min(100, m.visits * 10)}%`}}></div>
                          </div>
                       </div>
                    </td>
                    <td className="p-4 font-black text-green-600">${m.revenue}</td>
                    <td className="p-4 text-right">
                       <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${m.visits > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {m.visits > 5 ? 'High Demand' : m.visits > 0 ? 'Optimal' : 'Inactive'}
                       </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
