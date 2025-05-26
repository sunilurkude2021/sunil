
import React from 'react';
import { Teacher, MonthlyTeacherSalaryData } from '../../types';
import { 
  UserCircleIcon, 
  DevicePhoneMobileIcon, 
  BanknotesIcon, 
  EnvelopeIcon, 
  AcademicCapIcon,
  IdentificationIcon,
  BuildingLibraryIcon,
  MapPinIcon,
  HashtagIcon,
  ShieldCheckIcon, // For PAN/ADHAR
  CreditCardIcon, // For PRAN/DCPS
  SparklesIcon // For PAY MATRIX/BASIC PAY
} from '@heroicons/react/24/outline';

interface TeacherHomePageProps {
  teacher: Teacher;
  latestSalaryData?: MonthlyTeacherSalaryData | null; // Make it optional
}

interface ProfileFieldItem {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
}

// Helper to get value from raw data row based on Excel header
const getValueFromRowData = (
  rawHeaders: string[] | undefined, 
  rawDataRow: (string | number | null)[] | undefined, 
  excelHeader: string, 
): string | number | null => {
  if (!rawHeaders || !rawDataRow) return null;

  const normalize = (header: string | null | undefined): string => 
    (header || '').toLowerCase().replace(/[\s._\-\/()]/g, '');

  const normalizedExcelHeader = normalize(excelHeader);
  const headerIndex = rawHeaders.findIndex(h => normalize(h) === normalizedExcelHeader);
  
  if (headerIndex !== -1 && rawDataRow[headerIndex] !== undefined && rawDataRow[headerIndex] !== null && String(rawDataRow[headerIndex]).trim() !== '') {
    return rawDataRow[headerIndex];
  }
  return null; 
};

const DetailItemDisplay: React.FC<ProfileFieldItem> = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3 p-3 bg-slate-600 rounded-md shadow">
    <span className="text-sky-400 mt-1">{icon}</span>
    <div>
      <p className="text-sm font-medium text-slate-300">{label}</p>
      <p className="text-md text-slate-100 break-words">{value || 'N/A'}</p>
    </div>
  </div>
);

// Updated PROFILE_FIELD_CONFIG
const PROFILE_FIELD_CONFIG: { excelHeader: string, displayLabel: string, icon: React.ReactNode }[] = [
  { excelHeader: "BLOCK / TALUKA", displayLabel: "Working Taluka", icon: <MapPinIcon className="w-6 h-6" /> },
  { excelHeader: "SCHOOL UDISE CODE", displayLabel: "SCHOOL UDISE CODE", icon: <HashtagIcon className="w-6 h-6" /> },
  { excelHeader: "NAME OF SCHOOL", displayLabel: "NAME OF SCHOOL", icon: <BuildingLibraryIcon className="w-6 h-6" /> },
  { excelHeader: "SCHOOL SHALARTH DDO CODE", displayLabel: "SCHOOL SHALARTH DDO CODE", icon: <HashtagIcon className="w-6 h-6" /> },
  { excelHeader: "EMPLOYEE NAME", displayLabel: "EMPLOYEE NAME", icon: <UserCircleIcon className="w-6 h-6" /> },
  { excelHeader: "SHALARTH ID", displayLabel: "SHALARTH ID", icon: <IdentificationIcon className="w-6 h-6" /> },
  { excelHeader: "GENDER M/F", displayLabel: "GENDER", icon: <UserCircleIcon className="w-6 h-6" /> },
  { excelHeader: "GPF NO", displayLabel: "GPF NO", icon: <CreditCardIcon className="w-6 h-6" /> },
  { excelHeader: "PRAN NO", displayLabel: "PRAN NO", icon: <CreditCardIcon className="w-6 h-6" /> },
  { excelHeader: "PAN NO", displayLabel: "PAN NO", icon: <ShieldCheckIcon className="w-6 h-6" /> },
  { excelHeader: "ADHAR NO", displayLabel: "ADHAR NO", icon: <ShieldCheckIcon className="w-6 h-6" /> },
  { excelHeader: "MOB NO", displayLabel: "MOBILE NUMBER", icon: <DevicePhoneMobileIcon className="w-6 h-6" /> },
  { excelHeader: "EMAIL ID", displayLabel: "EMAIL ID", icon: <EnvelopeIcon className="w-6 h-6" /> },
  { excelHeader: "BANK NAME", displayLabel: "BANK NAME", icon: <BanknotesIcon className="w-6 h-6" /> },
  { excelHeader: "BANK ACCOUNT NUMBER", displayLabel: "BANK ACCOUNT NUMBER", icon: <BanknotesIcon className="w-6 h-6" /> },
  { excelHeader: "BANK IFSC CODE", displayLabel: "BANK IFSC CODE", icon: <BanknotesIcon className="w-6 h-6" /> }, // Added
  { excelHeader: "BRANCH NAME", displayLabel: "BRANCH NAME", icon: <BanknotesIcon className="w-6 h-6" /> },
  { excelHeader: "PAY MATRIX", displayLabel: "PAY MATRIX", icon: <SparklesIcon className="w-6 h-6" /> },
  { excelHeader: "BASIC PAY", displayLabel: "BASIC PAY", icon: <SparklesIcon className="w-6 h-6" /> },
];


const TeacherHomePage: React.FC<TeacherHomePageProps> = ({ teacher, latestSalaryData }) => {
  
  const profileDetails: ProfileFieldItem[] = PROFILE_FIELD_CONFIG.map(config => {
    let value: string | number | null = null;
    if (latestSalaryData) {
      value = getValueFromRowData(latestSalaryData.rawHeaders, latestSalaryData.rawDataRow, config.excelHeader);
    }
    // Fallback for essential fields if not in Excel or latestSalaryData is null
    if (value === null) {
        if (config.excelHeader === "EMPLOYEE NAME") value = teacher.name;
        else if (config.excelHeader === "SHALARTH ID") value = teacher.shalarthId;
        else if (config.excelHeader === "MOB NO") value = teacher.mobile;
        else if (config.excelHeader === "EMAIL ID" && teacher.emailId) value = teacher.emailId;
        // Add other fallbacks from teacher object if necessary for other fields
    }

    return {
      icon: config.icon,
      label: config.displayLabel,
      value: value !== null ? String(value) : undefined,
    };
  });

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-slate-100 mb-4">My Profile</h3>
      
      {!latestSalaryData && (
        <div className="p-4 bg-yellow-700/30 border border-yellow-600 text-yellow-200 rounded-md text-sm">
          Detailed profile information from the latest paybill is not yet available. 
          Displaying basic registered information. Some fields may show 'N/A'.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profileDetails.map(item => (
          <DetailItemDisplay key={item.label} icon={item.icon} label={item.label} value={item.value} />
        ))}
      </div>

      <div className="mt-6 p-4 bg-slate-600 rounded-md">
        <h4 className="text-lg font-semibold text-sky-300">Welcome!</h4>
        <p className="text-slate-300 mt-2">
          This is your personal dashboard. You can navigate through different sections using the tabs above to view your payslips,
          notifications from the administration, submit requested information, and manage your income tax related documents.
        </p>
      </div>
    </div>
  );
};

export default TeacherHomePage;
