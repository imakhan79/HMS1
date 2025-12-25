
export enum OPDType {
  GYNECOLOGY = 'GYNECOLOGY',
  PEDIATRICS = 'PEDIATRICS',
  ENT = 'ENT',
  DENTAL = 'DENTAL',
  GENERAL_MEDICINE = 'GENERAL_MEDICINE',
  CARDIOLOGY = 'CARDIOLOGY'
}

export enum VisitStatus {
  REGISTERED = 'Registered',
  VITALS_PENDING = 'Called for Vitals',
  JUNIOR_PENDING = 'With Junior Doctor',
  CONSULTANT_PENDING = 'With Consultant',
  LAB_PENDING = 'Sent to Lab',
  PHARMACY_PENDING = 'Sent to Pharmacy',
  BILLING_PENDING = 'Billing Pending',
  COMPLETED = 'Completed'
}

export enum LabStatus {
  ORDERED = 'Ordered',
  SAMPLE_COLLECTED = 'Sample Collected',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed'
}

export interface Patient {
  mrNumber: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
}

export interface Vitals {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  weight: number;
  timestamp: string;
  // Specialty specific vitals
  headCircumference?: number; // Pediatrics
  fetalHeartRate?: number; // Gynecology
}

export interface SpecialtyData {
  gyn?: {
    lmp?: string;
    edd?: string;
    gravida?: number;
    para?: number;
    abortions?: number;
    living?: number;
  };
  ped?: {
    immunizationUpToDate?: boolean;
    milestonesNormal?: boolean;
    feedingHistory?: string;
  };
  ent?: {
    tinnitus?: boolean;
    vertigo?: boolean;
    hearingLoss?: string;
  };
  den?: {
    toothNumber?: string;
    chiefComplaint?: string;
    procedurePlanned?: string;
  };
  gen?: {
    smoker?: boolean;
    diabetic?: boolean;
    hypertensive?: boolean;
  };
  car?: {
    chestPainScale?: number;
    shortnessOfBreath?: boolean;
    ecgSummary?: string;
  };
}

export interface LabOrder {
  id: string;
  testName: string;
  status: LabStatus;
  reportUrl?: string;
  results?: string;
  cost: number;
}

export interface Prescription {
  medicineName: string;
  dosage: string;
  duration: string;
  cost: number;
}

export interface Visit {
  id: string;
  mrNumber: string;
  opd: OPDType;
  token: string;
  status: VisitStatus;
  createdAt: string;
  vitals?: Vitals;
  preliminaryNotes?: string;
  diagnosis?: string;
  specialtyData?: SpecialtyData;
  labOrders: LabOrder[];
  prescriptions: Prescription[];
  consultationFee: number;
  paid: boolean;
  totalAmount: number;
}

export interface OPDConfig {
  type: OPDType;
  prefix: string;
  fee: number;
  consultant: string;
  junior: string;
  color: string;
  icon: string;
}

export type UserRole = 'RECEPTION' | 'NURSE' | 'JUNIOR_DOCTOR' | 'CONSULTANT' | 'LAB' | 'PHARMACY' | 'CASHIER' | 'ADMIN';
