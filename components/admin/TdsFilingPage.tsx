
import React from 'react';
import { ShieldCheckIcon } from '../icons/FeatureIcons';

const TdsFilingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-100">Easy TDS Filing</h3>
      
      <div className="p-6 bg-slate-600 rounded-md space-y-4">
        <p className="text-slate-300">
          Streamline your Tax Deducted at Source (TDS) filing process. This section provides tools and information to help you manage TDS compliance efficiently.
        </p>
        
        <div className="mt-4">
          <h4 className="text-md font-semibold text-sky-400 mb-2">Quarterly Auto-Generated Files:</h4>
          <p className="text-slate-300 text-sm">
            After each quarter, the system can help consolidate relevant data to assist in TDS return preparation. 
            (Note: This is a conceptual feature for now. Actual file generation is not implemented.)
          </p>
          <button 
            disabled 
            className="mt-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-500 cursor-not-allowed opacity-70">
            Download Q{Math.floor((new Date().getMonth()) / 3) + 1} {new Date().getFullYear()} Data (Coming Soon)
          </button>
        </div>

        <div className="mt-6 border-t border-slate-500 pt-6">
          <h4 className="text-md font-semibold text-emerald-400 mb-2 flex items-center">
            <ShieldCheckIcon className="w-5 h-5 mr-2 text-emerald-400"/> Easy File TDS (Paid Version)
          </h4>
          <p className="text-slate-300 text-sm">
            Unlock advanced features with our premium TDS filing service. This includes direct integration options, automated calculations, and expert support.
          </p>
          <button 
            onClick={() => alert('Paid TDS Filing feature is conceptual and not yet available. Contact sales for more info.')}
            className="mt-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-600 focus:ring-emerald-500 transition-colors">
            Learn More About Paid Version
          </button>
        </div>
         <p className="text-xs text-slate-400 mt-4">
            Disclaimer: This portal provides tools to assist with TDS management. Always consult with a tax professional for compliance and advice.
        </p>
      </div>
    </div>
  );
};

export default TdsFilingPage;
