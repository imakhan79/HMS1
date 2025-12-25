
import { OPDType, OPDConfig } from './types';

export const OPD_CONFIGS: Record<OPDType, OPDConfig> = {
  [OPDType.GYNECOLOGY]: {
    type: OPDType.GYNECOLOGY,
    prefix: 'GYN',
    fee: 500,
    consultant: 'Dr. Sarah Mitchell',
    junior: 'Dr. Amy Lee',
    color: 'rose',
    icon: '♀'
  },
  [OPDType.PEDIATRICS]: {
    type: OPDType.PEDIATRICS,
    prefix: 'PED',
    fee: 400,
    consultant: 'Dr. James Wilson',
    junior: 'Dr. Kevin Hart',
    color: 'cyan',
    icon: '👶'
  },
  [OPDType.ENT]: {
    type: OPDType.ENT,
    prefix: 'ENT',
    fee: 350,
    consultant: 'Dr. Robert Brown',
    junior: 'Dr. Lisa Wong',
    color: 'amber',
    icon: '👂'
  },
  [OPDType.DENTAL]: {
    type: OPDType.DENTAL,
    prefix: 'DEN',
    fee: 450,
    consultant: 'Dr. Emily Chen',
    junior: 'Dr. Mike Ross',
    color: 'slate',
    icon: '🦷'
  },
  [OPDType.GENERAL_MEDICINE]: {
    type: OPDType.GENERAL_MEDICINE,
    prefix: 'GEN',
    fee: 300,
    consultant: 'Dr. David Miller',
    junior: 'Dr. Sarah Parker',
    color: 'blue',
    icon: '💊'
  },
  [OPDType.CARDIOLOGY]: {
    type: OPDType.CARDIOLOGY,
    prefix: 'CARD',
    fee: 800,
    consultant: 'Dr. Steven Strange',
    junior: 'Dr. Peter Parker',
    color: 'red',
    icon: '❤️'
  }
};

export const ROLE_THEMES: Record<string, string> = {
  RECEPTION: 'bg-blue-600',
  NURSE: 'bg-teal-600',
  JUNIOR_DOCTOR: 'bg-indigo-600',
  CONSULTANT: 'bg-purple-600',
  LAB: 'bg-orange-600',
  PHARMACY: 'bg-green-600',
  CASHIER: 'bg-rose-600',
  ADMIN: 'bg-slate-800'
};
