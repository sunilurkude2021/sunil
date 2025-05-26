
import React from 'react';
import { Teacher, MonthlyTeacherSalaryData, PayslipFieldMapping } from '../../types';
import { DocumentDownloadIcon } from '../icons/FeatureIcons';

interface PayslipDisplayProps {
  teacher: Teacher;
  salaryData: MonthlyTeacherSalaryData;
  mappings: PayslipFieldMapping[];
  targetMonth: string;
  targetYear: string;
}

// Helper to find value from raw data row based on Excel header candidates
const getValueFromRow = (
  rawHeaders: string[], 
  rawDataRow: (string | number | null)[], 
  excelHeaderCandidates: string[], 
): string | number | null => {
  const candidate = excelHeaderCandidates[0]; 
  if (!candidate) return null;

  // Updated regex to handle spaces, dots, underscores, hyphens, forward slashes, and parentheses
  const normalizeHeader = (header: string | null | undefined): string => {
    if (header === null || header === undefined) return '';
    return String(header).toLowerCase().replace(/[\s._\-\/()]/g, '');
  }

  const normalizedCandidate = normalizeHeader(candidate);
  const headerIndex = rawHeaders.findIndex(h => normalizeHeader(String(h)) === normalizedCandidate);
  
  if (headerIndex !== -1 && rawDataRow[headerIndex] !== undefined && rawDataRow[headerIndex] !== null && String(rawDataRow[headerIndex]).trim() !== '') {
    return rawDataRow[headerIndex];
  }
  return null; 
};

const parseNumericValue = (value: any): number => {
  if (value === null || value === undefined || String(value).trim() === '') return 0;
  const num = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
  return isNaN(num) ? 0 : num;
};

const formatAmount = (value: any): string => {
  const num = parseNumericValue(value);
  // Displaying as plain number, formatted to two decimal places
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const numberToWords = (num: number): string => {
    const integerPart = Math.floor(Math.abs(num));
    if (integerPart === 0 && num !==0) { 
        if (num > 0 && num < 1) return ""; 
    }
    if (integerPart === 0 && num === 0) return "Zero";
    if (num < 0 && integerPart === 0) return "Zero"; 

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

    let words = "";
    let currentNum = integerPart;
    let i = 0;

    if (currentNum === 0 && integerPart !== 0) return "Zero";

    while (currentNum > 0) {
        if (currentNum % 1000 !== 0) {
            words = convertLessThanOneThousand(currentNum % 1000) + (thousands[i] ? " " + thousands[i] : "") + (words ? " " + words : "");
        }
        currentNum = Math.floor(currentNum / 1000);
        i++;
    }
    
    return words.trim();

    function convertLessThanOneThousand(n: number): string {
        let currentWords = "";
        if (n >= 100) {
            currentWords += ones[Math.floor(n / 100)] + " Hundred";
            n %= 100;
            if (n > 0) currentWords += " ";
        }
        if (n >= 20) {
            currentWords += tens[Math.floor(n / 10)];
            n %= 10;
             if (n > 0) currentWords += " ";
        }
        if (n > 0) {
            currentWords += ones[n];
        }
        return currentWords.trim();
    }
};


const PayslipDisplay: React.FC<PayslipDisplayProps> = ({ teacher, salaryData, mappings, targetMonth, targetYear }) => {
  
  const getMappedValue = (mapping: PayslipFieldMapping): string | number | null => {
    if (mapping.valueKey && teacher[mapping.valueKey]) {
        const val = teacher[mapping.valueKey];
        if (typeof val === 'string' || typeof val === 'number') return val;
    }
    return getValueFromRow(salaryData.rawHeaders, salaryData.rawDataRow, mapping.excelHeaderCandidates);
  };

  const headerDataElements: { label: string, value: string }[] = [];
  const payslipHeaderFields = [
    "NAME OF SCHOOL", "SCHOOL SHALARTH DDO CODE", "EMPLOYEE NAME", "SHALARTH ID",
    "GPF NO", "PAN NO", "PRAN NO", "ADHAR NO", "EMAIL ID", "MOB NO",
    "BANK ACCOUNT NUMBER", "PAY MATRIX", "BANK IFSC CODE", "BRANCH NAME"
  ]; // "DESIGNATION" was removed in previous step

  payslipHeaderFields.forEach(fieldLabel => {
    const mapping = mappings.find(m => m.payslipLabel === fieldLabel && m.category === 'headerInfo');
    let valueToDisplay = 'N/A';
    if (mapping) {
        let value = null;
        if (fieldLabel === "EMPLOYEE NAME") value = getMappedValue(mapping) || teacher.name;
        else if (fieldLabel === "SHALARTH ID") value = getMappedValue(mapping) || teacher.shalarthId;
        else value = getMappedValue(mapping);
        
        if (value !== null && String(value).trim() !== '') {
            valueToDisplay = String(value);
        }
    } else if (fieldLabel === "EMPLOYEE NAME" && teacher.name) { 
        valueToDisplay = teacher.name;
    } else if (fieldLabel === "SHALARTH ID" && teacher.shalarthId) {
        valueToDisplay = teacher.shalarthId;
    }

    headerDataElements.push({ label: fieldLabel, value: valueToDisplay });
  });


  const emolumentsList: { label: string, value: number }[] = [];
  const govtRecoveriesList: { label: string, value: number }[] = [];
  const nonGovtRecoveriesList: { label: string, value: number }[] = [];

  mappings.forEach(m => {
    if (m.category === 'emolument' || m.category === 'govtRecovery' || m.category === 'nonGovtRecovery') {
        const rawValue = getMappedValue(m);
        const numericValue = parseNumericValue(rawValue);

        if (numericValue !== 0) { 
            const item = { label: m.payslipLabel, value: numericValue };
            if (m.category === 'emolument') emolumentsList.push(item);
            else if (m.category === 'govtRecovery') govtRecoveriesList.push(item);
            else if (m.category === 'nonGovtRecovery') nonGovtRecoveriesList.push(item);
        }
    }
  });

  const totalEmoluments = emolumentsList.reduce((sum, item) => sum + item.value, 0);
  const totalGovtRecoveries = govtRecoveriesList.reduce((sum, item) => sum + item.value, 0);
  const totalNonGovtRecoveries = nonGovtRecoveriesList.reduce((sum, item) => sum + item.value, 0);
  
  // Net Pay is sourced directly from Excel via "EMPLOYEE NET SALARY" mapping
  const netPayExcelMapping = mappings.find(m => m.payslipLabel === "EMPLOYEE NET SALARY");
  let netPayFromExcel: string | number | null = null;
  if (netPayExcelMapping) {
    netPayFromExcel = getMappedValue(netPayExcelMapping);
  }
  const finalNetPay = parseNumericValue(netPayFromExcel); // Use parsed value for words and display
  const netPayWords = numberToWords(finalNetPay);


  const handlePrint = () => {
    window.print();
  };
  
  const renderHeaderItem = (label: string, value: string) => (
    <div className="flex text-[9px] sm:text-[10px] leading-tight">
      <span className="font-medium w-2/5 pr-1">{label}:</span>
      <span className="w-3/5 break-words">{value}</span>
    </div>
  );
  
  const renderThreeColumnSectionItem = (item: {label: string, value: number}) => {
    return (
      <div key={item.label} className="flex justify-between text-[9px] sm:text-[10px] mb-px">
        <span className="pr-1 break-words max-w-[70%]">{item.label}:</span>
        <span className="font-mono whitespace-nowrap text-right">{formatAmount(item.value)}</span>
      </div>
    );
  };
  
  const maxRows = Math.max(emolumentsList.length, govtRecoveriesList.length, nonGovtRecoveriesList.length);

  return (
    <div className="bg-white text-black p-2 sm:p-3 border border-gray-400 shadow-lg printable-payslip max-w-2xl mx-auto font-sans">
      <style>{`
        @media print {
          @page { 
            size: A4; 
            margin: 10mm; 
          }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .printable-payslip { 
            margin: 0 auto; 
            padding: 10px !important; 
            border: 1px solid #999 !important; 
            box-shadow: none !important; 
            width: 100% !important; 
            max-width: 100% !important;
            background-color: white !important;
            color: black !important;
            font-size: 8.5pt !important; 
            line-height: 1.2 !important;
          }
           .printable-payslip div, .printable-payslip span, .printable-payslip p, .printable-payslip th, .printable-payslip td, .printable-payslip h4, .printable-payslip h5, .printable-payslip hr {
            background-color: white !important;
            color: black !important;
            border-color: #777 !important;
          }
          .printable-payslip button { display: none !important; }
        }
      `}</style>
      
      <div className="text-center mb-1">
        <h4 className="font-bold text-sm sm:text-base">PAYSLIP of {targetMonth.toUpperCase()}-{targetYear}</h4>
      </div>

      <div className="grid grid-cols-2 gap-x-2 mb-1">
        {headerDataElements.slice(0, 2).map(item => renderHeaderItem(item.label, item.value))}
         <div className="col-span-2 flex justify-between text-[9px] sm:text-[10px] leading-tight">
            <span></span> 
            <span className="font-medium text-right">Salary Month: {targetMonth} {targetYear}</span>
        </div>
        {headerDataElements.slice(2).map(item => renderHeaderItem(item.label, item.value))}
      </div>

      <hr className="border-gray-400 my-1"/>
      
      <div className="grid grid-cols-3 gap-x-0">
        {/* Emoluments Column */}
        <div className="px-0.5 border-r border-gray-300"> 
          <h5 className="font-semibold text-center text-[10px] sm:text-xs mb-0.5 underline">Emoluments</h5>
          {emolumentsList.map(item => renderThreeColumnSectionItem(item))}
          {Array.from({ length: Math.max(0, maxRows - emolumentsList.length) }).map((_, idx) => 
            <div key={`emolument-fill-${idx}`} className="text-[9px] sm:text-[10px] mb-px h-[1.2em]">&nbsp;</div> 
          )}
          <hr className="border-gray-300 my-0.5" />
          <div className="flex justify-between text-[9px] sm:text-[10px] font-medium">
            <span>Total Emoluments:</span>
            <span className="font-mono text-right">{formatAmount(totalEmoluments)}</span>
          </div>
        </div>

        {/* Govt. Recoveries Column */}
        <div className="px-0.5 border-r border-gray-300">
          <h5 className="font-semibold text-center text-[10px] sm:text-xs mb-0.5 underline">Govt. Recoveries</h5>
          {govtRecoveriesList.map(item => renderThreeColumnSectionItem(item))}
          {Array.from({ length: Math.max(0, maxRows - govtRecoveriesList.length) }).map((_, idx) => 
            <div key={`govtrec-fill-${idx}`} className="text-[9px] sm:text-[10px] mb-px h-[1.2em]">&nbsp;</div>
          )}
           <hr className="border-gray-300 my-0.5" />
          <div className="flex justify-between text-[9px] sm:text-[10px] font-medium">
            <span>Total Govt. Recov.:</span>
            <span className="font-mono text-right">{formatAmount(totalGovtRecoveries)}</span>
          </div>
        </div>

        {/* Non Govt. Recoveries Column */}
        <div className="px-0.5">
          <h5 className="font-semibold text-center text-[10px] sm:text-xs mb-0.5 underline">Non Govt. Recoveries</h5>
          {nonGovtRecoveriesList.map(item => renderThreeColumnSectionItem(item))}
          {Array.from({ length: Math.max(0, maxRows - nonGovtRecoveriesList.length) }).map((_, idx) => 
            <div key={`nongovtrec-fill-${idx}`} className="text-[9px] sm:text-[10px] mb-px h-[1.2em]">&nbsp;</div>
          )}
          <hr className="border-gray-300 my-0.5" />
          <div className="flex justify-between text-[9px] sm:text-[10px] font-medium">
            <span>Total Non-Govt. Recov.:</span>
            <span className="font-mono text-right">{formatAmount(totalNonGovtRecoveries)}</span>
          </div>
        </div>
      </div>
      
      <hr className="border-gray-400 my-1"/>
      
      <div className="mt-1 text-center">
        <p className="font-bold text-xs sm:text-sm">Net Pay: <span className="font-mono">{formatAmount(finalNetPay)}</span></p>
        {(finalNetPay !== 0 || netPayWords === "Zero") && (
             <p className="text-[8px] sm:text-[9px] font-medium">({netPayWords} Rs. Only.)</p>
        )}
      </div>
      
      <p className="text-center text-[8px] sm:text-[9px] italic mt-1">*This is a system-generated payslip. Hence signature is not needed.*</p>
      
      <div className="mt-3 text-center no-print">
        <button 
          onClick={handlePrint}
          className="py-1.5 px-3 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors text-xs sm:text-sm flex items-center justify-center mx-auto"
        >
          <DocumentDownloadIcon className="w-4 h-4 mr-1.5"/> Save as PDF
        </button>
      </div>
    </div>
  );
};

export default PayslipDisplay;
