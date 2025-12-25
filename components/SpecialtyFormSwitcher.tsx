
import React from 'react';
import { OPDType, SpecialtyData } from '../types';

interface Props {
  opd: OPDType;
  data: SpecialtyData;
  onChange: (newData: SpecialtyData) => void;
  readOnly?: boolean;
}

const SpecialtyFormSwitcher: React.FC<Props> = ({ opd, data, onChange, readOnly = false }) => {
  const handleChange = (specialty: keyof SpecialtyData, field: string, value: any) => {
    if (readOnly) return;
    onChange({
      ...data,
      [specialty]: {
        ...(data[specialty] || {}),
        [field]: value
      }
    });
  };

  const inputClass = "mt-1 block w-full border border-gray-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase";

  switch (opd) {
    case OPDType.GYNECOLOGY:
      return (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="col-span-2 border-b pb-2 mb-2 font-bold text-rose-600 flex items-center gap-2">
            <span>♀ Obstetrics & Gynecology History</span>
          </div>
          <div>
            <label className={labelClass}>LMP (Last Menstrual Period)</label>
            <input type="date" value={data.gyn?.lmp || ''} onChange={e => handleChange('gyn', 'lmp', e.target.value)} className={inputClass} disabled={readOnly} />
          </div>
          <div>
            <label className={labelClass}>EDD (Estimated Due Date)</label>
            <input type="date" value={data.gyn?.edd || ''} onChange={e => handleChange('gyn', 'edd', e.target.value)} className={inputClass} disabled={readOnly} />
          </div>
          <div className="col-span-2 grid grid-cols-4 gap-2">
            <div>
              <label className={labelClass}>G (Gravida)</label>
              <input type="number" value={data.gyn?.gravida || 0} onChange={e => handleChange('gyn', 'gravida', parseInt(e.target.value))} className={inputClass} disabled={readOnly} />
            </div>
            <div>
              <label className={labelClass}>P (Para)</label>
              <input type="number" value={data.gyn?.para || 0} onChange={e => handleChange('gyn', 'para', parseInt(e.target.value))} className={inputClass} disabled={readOnly} />
            </div>
            <div>
              <label className={labelClass}>A (Abortion)</label>
              <input type="number" value={data.gyn?.abortions || 0} onChange={e => handleChange('gyn', 'abortions', parseInt(e.target.value))} className={inputClass} disabled={readOnly} />
            </div>
            <div>
              <label className={labelClass}>L (Living)</label>
              <input type="number" value={data.gyn?.living || 0} onChange={e => handleChange('gyn', 'living', parseInt(e.target.value))} className={inputClass} disabled={readOnly} />
            </div>
          </div>
        </div>
      );

    case OPDType.PEDIATRICS:
      return (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="col-span-2 border-b pb-2 mb-2 font-bold text-cyan-600 flex items-center gap-2">
            <span>👶 Pediatric Growth & Development</span>
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Feeding History</label>
            <textarea value={data.ped?.feedingHistory || ''} onChange={e => handleChange('ped', 'feedingHistory', e.target.value)} className={inputClass} rows={2} placeholder="Ex: Breastfed, Solid started at 6m..." disabled={readOnly} />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={data.ped?.immunizationUpToDate || false} onChange={e => handleChange('ped', 'immunizationUpToDate', e.target.checked)} className="rounded" disabled={readOnly} />
              Immunization Up-to-Date
            </label>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={data.ped?.milestonesNormal || false} onChange={e => handleChange('ped', 'milestonesNormal', e.target.checked)} className="rounded" disabled={readOnly} />
              Milestones Normal
            </label>
          </div>
        </div>
      );

    case OPDType.ENT:
      return (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="col-span-2 border-b pb-2 mb-2 font-bold text-amber-600 flex items-center gap-2">
            <span>👂 ENT Examination Notes</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={data.ent?.tinnitus || false} onChange={e => handleChange('ent', 'tinnitus', e.target.checked)} className="rounded" disabled={readOnly} />
              Tinnitus
            </label>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={data.ent?.vertigo || false} onChange={e => handleChange('ent', 'vertigo', e.target.checked)} className="rounded" disabled={readOnly} />
              Vertigo
            </label>
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Hearing Loss Assessment</label>
            <select value={data.ent?.hearingLoss || ''} onChange={e => handleChange('ent', 'hearingLoss', e.target.value)} className={inputClass} disabled={readOnly}>
              <option value="">Select Level</option>
              <option value="None">None</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>
        </div>
      );

    case OPDType.DENTAL:
      return (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="col-span-2 border-b pb-2 mb-2 font-bold text-slate-600 flex items-center gap-2">
            <span>🦷 Tooth Charting & Procedures</span>
          </div>
          <div>
            <label className={labelClass}>Tooth Number(s)</label>
            <input type="text" value={data.den?.toothNumber || ''} onChange={e => handleChange('den', 'toothNumber', e.target.value)} className={inputClass} placeholder="e.g. 18, 24" disabled={readOnly} />
          </div>
          <div>
            <label className={labelClass}>Planned Procedure</label>
            <select value={data.den?.procedurePlanned || ''} onChange={e => handleChange('den', 'procedurePlanned', e.target.value)} className={inputClass} disabled={readOnly}>
              <option value="">None</option>
              <option value="Scaling">Scaling</option>
              <option value="Extraction">Extraction</option>
              <option value="Filling">Filling</option>
              <option value="RCT">RCT (Root Canal)</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Chief Complaint</label>
            <input type="text" value={data.den?.chiefComplaint || ''} onChange={e => handleChange('den', 'chiefComplaint', e.target.value)} className={inputClass} placeholder="Pain, Sensitivity, etc." disabled={readOnly} />
          </div>
        </div>
      );

    case OPDType.CARDIOLOGY:
      return (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="col-span-2 border-b pb-2 mb-2 font-bold text-red-600 flex items-center gap-2">
            <span>❤️ Cardiac Risk Profile</span>
          </div>
          <div>
            <label className={labelClass}>Chest Pain Scale (1-10)</label>
            <input type="range" min="0" max="10" value={data.car?.chestPainScale || 0} onChange={e => handleChange('car', 'chestPainScale', parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600 mt-4" disabled={readOnly} />
            <div className="text-center text-xs font-bold mt-1">{data.car?.chestPainScale || 0} / 10</div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={data.car?.shortnessOfBreath || false} onChange={e => handleChange('car', 'shortnessOfBreath', e.target.checked)} className="rounded" disabled={readOnly} />
              Shortness of Breath
            </label>
          </div>
          <div className="col-span-2">
            <label className={labelClass}>ECG Summary Findings</label>
            <textarea value={data.car?.ecgSummary || ''} onChange={e => handleChange('car', 'ecgSummary', e.target.value)} className={inputClass} rows={2} placeholder="Normal sinus rhythm, ST elevation..." disabled={readOnly} />
          </div>
        </div>
      );

    case OPDType.GENERAL_MEDICINE:
    default:
      return (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="col-span-2 border-b pb-2 mb-2 font-bold text-blue-600 flex items-center gap-2">
            <span>💊 General Systemic Review</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={data.gen?.diabetic || false} onChange={e => handleChange('gen', 'diabetic', e.target.checked)} className="rounded" disabled={readOnly} />
              Diabetic
            </label>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={data.gen?.hypertensive || false} onChange={e => handleChange('gen', 'hypertensive', e.target.checked)} className="rounded" disabled={readOnly} />
              Hypertensive
            </label>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={data.gen?.smoker || false} onChange={e => handleChange('gen', 'smoker', e.target.checked)} className="rounded" disabled={readOnly} />
              Smoker
            </label>
          </div>
        </div>
      );
  }
};

export default SpecialtyFormSwitcher;
