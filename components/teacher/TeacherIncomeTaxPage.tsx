
import React, { useState } from 'react';
import { DocumentTextIcon, DocumentDownloadIcon, SearchCircleIcon } from '../icons/FeatureIcons';

const currentYear = new Date().getFullYear();
const financialYears = Array.from({ length: 5 }, (_, i) => {
  const endYear = currentYear - i;
  const startYear = endYear - 1;
  return `${startYear}-${endYear.toString().slice(-2)}`; // e.g., 2023-24
});


const TeacherIncomeTaxPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>(financialYears[0]);
  
  const handleShowYearlyStatement = () => {
    alert(`Showing yearly statement for ${selectedYear} (mock display). This would typically fetch and display aggregated monthly data.`);
  };

  const handleDownloadIncomeTaxStatement = () => {
    alert(`Downloading Income Tax Statement for ${selectedYear} (Form 16 / Annexure - mock PDF download).`);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-100">Income Tax Information</h3>
      
      <div className="p-4 bg-slate-600 rounded-md space-y-6">
        <div>
          <h4 className="text-lg font-medium text-sky-300 mb-2">Yearly Statement View</h4>
          <p className="text-sm text-slate-400 mb-3">Select a financial year to view your consolidated monthly statements (April to March).</p>
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-grow">
              <label htmlFor="financialYear" className="block text-sm font-medium text-slate-300">Financial Year</label>
              <select 
                id="financialYear" 
                value={selectedYear} 
                onChange={e => setSelectedYear(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-slate-400 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
              >
                {financialYears.map(fy => <option key={fy} value={fy}>{fy}</option>)}
              </select>
            </div>
            <button 
              onClick={handleShowYearlyStatement}
              className="w-full sm:w-auto flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-slate-600 focus:ring-sky-500 transition-colors"
            >
              <SearchCircleIcon className="w-5 h-5 mr-2"/> Show Yearly Statement (Mock)
            </button>
          </div>
        </div>

        <hr className="border-slate-500"/>

        <div>
          <h4 className="text-lg font-medium text-sky-300 mb-2">Income Tax Statement (Form 16 / Annexure)</h4>
          <p className="text-sm text-slate-400 mb-3">View and download your official Income Tax statement for the selected financial year.</p>
          <button 
            onClick={handleDownloadIncomeTaxStatement}
            className="w-full sm:w-auto flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-slate-600 focus:ring-emerald-500 transition-colors"
          >
            <DocumentDownloadIcon className="w-5 h-5 mr-2"/> View/Download Statement for {selectedYear} (Mock)
          </button>
        </div>
      </div>
       <p className="text-xs text-slate-400 mt-4 text-center">
            Disclaimer: Tax information provided here is for convenience. Always verify with official documents and consult a tax advisor.
        </p>
    </div>
  );
};

export default TeacherIncomeTaxPage;
