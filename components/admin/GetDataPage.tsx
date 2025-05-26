
import React, { useState } from 'react';
import { InfoRequest } from '../../types';
import { PlusCircleIcon, MinusCircleIcon, UploadCloudIcon as CreateRequestIcon, TrashIcon, DocumentDownloadIcon } from '../icons/FeatureIcons';

interface GetDataPageProps {
  infoRequests: InfoRequest[];
  onAddInfoRequest: (newRequest: InfoRequest) => void;
  onDeleteInfoRequest: (requestId: string) => void; 
}

const GetDataPage: React.FC<GetDataPageProps> = ({ infoRequests, onAddInfoRequest, onDeleteInfoRequest }) => {
  const [subject, setSubject] = useState<string>('');
  const [columnHeaders, setColumnHeaders] = useState<string[]>(['']);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleColumnHeaderChange = (index: number, value: string) => {
    const newHeaders = [...columnHeaders];
    newHeaders[index] = value;
    setColumnHeaders(newHeaders);
  };

  const addColumnHeader = () => {
    setColumnHeaders([...columnHeaders, '']);
  };

  const removeColumnHeader = (index: number) => {
    if (columnHeaders.length > 1) {
      const newHeaders = columnHeaders.filter((_, i) => i !== index);
      setColumnHeaders(newHeaders);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!subject.trim()) {
      setError('Subject is required.');
      return;
    }
    const finalColumnHeaders = columnHeaders.map(h => h.trim()).filter(h => h !== '');
    if (finalColumnHeaders.length === 0) {
      setError('At least one valid column header is required.');
      return;
    }

    const newRequest: InfoRequest = {
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      subject,
      columnHeaders: finalColumnHeaders,
      createdAt: new Date().toISOString(),
    };

    try {
      onAddInfoRequest(newRequest);
      setSuccess(`Data request "${subject}" created successfully.`);
      // Reset form
      setSubject('');
      setColumnHeaders(['']);
    } catch (err: any) {
      setError(err.message || 'Failed to create data request.');
    }
  };

  const handleDownloadTemplate = (request: InfoRequest) => {
    const csvHeader = request.columnHeaders.join(',');
    const csvContent = `${csvHeader}\n`; // Only headers for the template
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${request.subject.replace(/\s+/g, '_')}_template.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
        alert("Your browser doesn't support direct downloads. Template creation failed.");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-100">Create Data Request</h3>
      <p className="text-sm text-slate-400">Define a subject and the columns of information you need users to fill.</p>

      {error && <div className="p-3 bg-red-700 border border-red-900 text-red-100 rounded-md text-sm my-2">{error}</div>}
      {success && <div className="p-3 bg-green-700 border border-green-900 text-green-100 rounded-md text-sm my-2">{success}</div>}

      <form onSubmit={handleSubmit} className="p-4 bg-slate-600 rounded-md space-y-4">
        <div>
          <label htmlFor="infoSubject" className="block text-sm font-medium text-slate-300">Subject</label>
          <input type="text" id="infoSubject" value={subject} onChange={e => setSubject(e.target.value)} required
            className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-slate-400 rounded-md shadow-sm placeholder-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
            placeholder="e.g., Annual Training Certification Update"/>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Column Headers for Data</label>
          {columnHeaders.map((header, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={header}
                onChange={(e) => handleColumnHeaderChange(index, e.target.value)}
                placeholder={`Column ${index + 1} Header`}
                className="flex-grow px-3 py-2 bg-slate-500 border border-slate-400 rounded-md shadow-sm placeholder-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
              />
              <button type="button" onClick={() => removeColumnHeader(index)} 
                className="p-2 text-red-400 hover:text-red-300 disabled:opacity-50"
                disabled={columnHeaders.length <= 1}
                title="Remove Column">
                <MinusCircleIcon className="w-6 h-6" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addColumnHeader} 
            className="mt-1 flex items-center text-sm text-sky-400 hover:text-sky-300">
            <PlusCircleIcon className="w-5 h-5 mr-1" /> Add Column
          </button>
        </div>

        <button type="submit"
          className="w-full md:w-auto flex items-center justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-600 focus:ring-sky-500 transition-colors">
          <CreateRequestIcon className="w-5 h-5 mr-2"/> Create Data Request
        </button>
      </form>

      <h4 className="text-lg font-medium text-slate-100 mt-6 mb-3">Created Data Requests</h4>
      {infoRequests.length === 0 ? (
        <p className="text-slate-400 text-center py-4">No data requests created yet.</p>
      ) : (
        <div className="overflow-x-auto bg-slate-600 p-1 rounded-md shadow">
          <table className="min-w-full divide-y divide-slate-500">
            <thead className="bg-slate-500">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-100 sm:pl-6">Sr.No</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-100">Subject</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-100">Columns</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-100">Created At</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-100">Template</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-100">Filled By (Mock)</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {infoRequests.map((req, index) => (
                <tr key={req.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-200 sm:pl-6">{index + 1}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300 max-w-md truncate" title={req.subject}>{req.subject}</td>
                  <td className="px-3 py-4 text-sm text-slate-300 truncate max-w-xs" title={req.columnHeaders.join(', ')}>{req.columnHeaders.join(', ')}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                     <button 
                        onClick={() => handleDownloadTemplate(req)}
                        className="text-sky-400 hover:text-sky-300 text-xs flex items-center" 
                        title="Download CSV Template (Headers Only)">
                        <DocumentDownloadIcon className="w-4 h-4 mr-1" /> CSV Template
                     </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">0 (Mock)</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button 
                        onClick={() => onDeleteInfoRequest(req.id)} 
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-700" 
                        title="Delete Data Request">
                      <TrashIcon className="w-5 h-5" /> <span className="sr-only">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetDataPage; // Renamed component
