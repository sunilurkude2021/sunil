
import React from 'react';
import { InfoRequest, TeacherInfoResponse } from '../../types';
import { EyeIcon, CheckCircleIcon } from '../icons/FeatureIcons';

interface TeacherMySubmissionsPageProps {
  infoRequests: InfoRequest[];
  teacherResponses: TeacherInfoResponse[];
}

const TeacherMySubmissionsPage: React.FC<TeacherMySubmissionsPageProps> = ({ infoRequests, teacherResponses }) => {

  if (teacherResponses.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-100">My Submitted Information</h3>
        <p className="text-slate-400 text-center py-4">You have not submitted any information yet. Check the "Upload Info" page for pending requests.</p>
      </div>
    );
  }
  
  // Create a map of info requests for easy lookup
  const requestMap = new Map(infoRequests.map(req => [req.id, req]));

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-100">My Submitted Information</h3>
      <p className="text-sm text-slate-400">Here's a list of information requests you've responded to.</p>

      <div className="space-y-4">
        {teacherResponses
            .sort((a,b) => new Date(b.lastUpdatedAt || b.submittedAt).getTime() - new Date(a.lastUpdatedAt || a.submittedAt).getTime())
            .map(response => {
            const requestDetails = requestMap.get(response.requestId);
            if (!requestDetails) return null; // Should not happen if data is consistent

            return (
                <div key={response.id} className="p-4 bg-slate-600 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-sky-300">{requestDetails.subject}</h4>
                    <div className="flex items-center text-green-400 text-xs mt-1 mb-2">
                        <CheckCircleIcon className="w-4 h-4 mr-1"/> 
                        <span>Submitted: {new Date(response.submittedAt).toLocaleString()}</span>
                        {response.lastUpdatedAt && response.lastUpdatedAt !== response.submittedAt && (
                            <span className="ml-2 text-slate-400">(Last Updated: {new Date(response.lastUpdatedAt).toLocaleString()})</span>
                        )}
                    </div>
                    
                    <div className="mt-2 space-y-1">
                        {Object.entries(response.responseData).map(([header, value]) => (
                            <p key={header} className="text-sm">
                                <strong className="text-slate-300">{header}:</strong> 
                                <span className="text-slate-200 ml-1">{value}</span>
                            </p>
                        ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-3">Original Request Created: {new Date(requestDetails.createdAt).toLocaleDateString()}</p>
                     {/* Add a button to navigate to edit if needed, e.g., by calling a prop function or setting state in TeacherDashboard */}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default TeacherMySubmissionsPage;
