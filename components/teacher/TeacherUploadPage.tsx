
import React, { useState, useEffect } from 'react';
import { InfoRequest, TeacherInfoResponse, TeacherInfoResponseData } from '../../types';
import { CloudUploadIconTeacher as SubmitIcon, PencilIcon, CheckCircleIcon } from '../icons/FeatureIcons';

interface TeacherUploadPageProps {
  infoRequests: InfoRequest[];
  existingResponses: TeacherInfoResponse[];
  onAddOrUpdateResponse: (response: TeacherInfoResponse) => void;
  teacherShalarthId: string;
}

interface EditableResponseData {
  [key: string]: string;
}

const TeacherUploadPage: React.FC<TeacherUploadPageProps> = ({ 
  infoRequests, 
  existingResponses, 
  onAddOrUpdateResponse, 
  teacherShalarthId 
}) => {
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [currentFormData, setCurrentFormData] = useState<EditableResponseData>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getResponseForRequest = (requestId: string): TeacherInfoResponse | undefined => {
    return existingResponses.find(r => r.requestId === requestId);
  };

  const handleStartEdit = (request: InfoRequest) => {
    setEditingRequestId(request.id);
    setError(null);
    setSuccess(null);
    const existingResponse = getResponseForRequest(request.id);
    const initialData: EditableResponseData = {};
    request.columnHeaders.forEach(header => {
      initialData[header] = existingResponse?.responseData[header] || '';
    });
    setCurrentFormData(initialData);
  };

  const handleInputChange = (header: string, value: string) => {
    setCurrentFormData(prev => ({ ...prev, [header]: value }));
  };

  const handleSubmit = (requestId: string) => {
    setError(null);
    setSuccess(null);

    // Basic validation: check if all fields for this request are filled
    const currentRequest = infoRequests.find(r => r.id === requestId);
    if (!currentRequest) {
        setError("Could not find the request to submit against.");
        return;
    }
    for (const header of currentRequest.columnHeaders) {
        if (!currentFormData[header]?.trim()) {
            setError(`Field "${header}" cannot be empty.`);
            return;
        }
    }


    const existingResponse = getResponseForRequest(requestId);
    const responseToSubmit: TeacherInfoResponse = {
      id: existingResponse?.id || Date.now().toString() + Math.random().toString(36).substring(2),
      requestId,
      teacherShalarthId,
      responseData: { ...currentFormData },
      submittedAt: existingResponse?.submittedAt || new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };

    try {
      onAddOrUpdateResponse(responseToSubmit);
      setSuccess(`Information for "${infoRequests.find(r => r.id === requestId)?.subject}" submitted successfully.`);
      setEditingRequestId(null); // Close edit form
    } catch (e: any) {
      setError(e.message || 'Failed to submit information.');
    }
  };
  
  if (infoRequests.length === 0) {
    return <p className="text-slate-400 text-center py-4">No information requests from admin at the moment.</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-100">Upload Requested Information</h3>
      <p className="text-sm text-slate-400">Admin has requested the following information. Please fill and submit.</p>

      {error && <div className="p-3 bg-red-700 border border-red-900 text-red-100 rounded-md text-sm my-2">{error}</div>}
      {success && <div className="p-3 bg-green-700 border border-green-900 text-green-100 rounded-md text-sm my-2">{success}</div>}

      <div className="space-y-8">
        {infoRequests.map(req => {
          const existingResponse = getResponseForRequest(req.id);
          const isEditingThis = editingRequestId === req.id;

          return (
            <div key={req.id} className="p-4 bg-slate-600 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-semibold text-sky-300">{req.subject}</h4>
                    <p className="text-xs text-slate-400">Created: {new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
                {!isEditingThis && (
                  <button 
                    onClick={() => handleStartEdit(req)}
                    className="flex items-center py-1 px-3 text-sm rounded-md bg-sky-600 hover:bg-sky-700 text-white transition-colors"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" /> {existingResponse ? 'Edit' : 'Fill Information'}
                  </button>
                )}
              </div>

              {existingResponse && !isEditingThis && (
                <div className="mt-3 p-3 bg-slate-500/50 rounded-md">
                    <div className="flex items-center text-green-400 text-sm mb-2">
                        <CheckCircleIcon className="w-5 h-5 mr-2"/> 
                        <span>Submitted on: {new Date(existingResponse.submittedAt).toLocaleString()}</span>
                        {existingResponse.lastUpdatedAt && existingResponse.lastUpdatedAt !== existingResponse.submittedAt && (
                            <span className="ml-2 text-xs text-slate-400">(Updated: {new Date(existingResponse.lastUpdatedAt).toLocaleString()})</span>
                        )}
                    </div>
                    {req.columnHeaders.map(header => (
                        <p key={header} className="text-sm text-slate-200">
                            <strong className="text-slate-300">{header}:</strong> {existingResponse.responseData[header]}
                        </p>
                    ))}
                </div>
              )}

              {isEditingThis && (
                <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); handleSubmit(req.id); }}>
                  {req.columnHeaders.map(header => (
                    <div key={header}>
                      <label htmlFor={`${req.id}-${header}`} className="block text-sm font-medium text-slate-300">{header}</label>
                      <input
                        type="text"
                        id={`${req.id}-${header}`}
                        value={currentFormData[header] || ''}
                        onChange={(e) => handleInputChange(header, e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-slate-400 rounded-md shadow-sm placeholder-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
                      />
                    </div>
                  ))}
                  <div className="flex space-x-3 pt-2">
                    <button type="submit"
                      className="flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-slate-600 focus:ring-emerald-500">
                      <SubmitIcon className="w-5 h-5 mr-2" /> Submit Information
                    </button>
                    <button type="button" onClick={() => {setEditingRequestId(null); setError(null); setSuccess(null);}}
                      className="py-2 px-4 border border-slate-500 rounded-md shadow-sm text-sm font-medium text-slate-200 hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-slate-600 focus:ring-slate-400">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherUploadPage;
