
import React, { useState } from 'react';
import { AdminNotification } from '../../types';
import { DocumentDownloadIcon, EyeIcon } from '../icons/FeatureIcons'; // Re-using EyeIcon for view

interface TeacherNotificationPageProps {
  notifications: AdminNotification[];
}

const TeacherNotificationPage: React.FC<TeacherNotificationPageProps> = ({ notifications }) => {
  const [selectedNotification, setSelectedNotification] = useState<AdminNotification | null>(null);

  const handleViewNotification = (notification: AdminNotification) => {
    setSelectedNotification(notification);
    // In a real app, this might open a modal with more details
    alert(`Viewing Notification: ${notification.text}\nFile: ${notification.fileName || 'N/A'}\nRemarks: ${notification.remarks}`);
  };

  const handleDownloadFile = (fileName: string) => {
    alert(`Downloading file: ${fileName} (mock download)`);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-100">Notifications from Admin</h3>
      
      {notifications.length === 0 ? (
        <p className="text-slate-400 text-center py-4">No notifications available at the moment.</p>
      ) : (
        <div className="overflow-x-auto bg-slate-600 p-1 rounded-md shadow">
          <table className="min-w-full divide-y divide-slate-500">
            <thead className="bg-slate-500">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-100 sm:pl-6">Sr.No</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-100">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-100">Notification</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-100">File</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-100">Remarks</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {notifications.map((n, index) => (
                <tr key={n.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-200 sm:pl-6">{index + 1}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{new Date(n.date).toLocaleDateString()}</td>
                  <td className="px-3 py-4 text-sm text-slate-300 max-w-sm truncate" title={n.text}>{n.text}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">
                    {n.fileName ? (
                      <button 
                        onClick={() => handleDownloadFile(n.fileName!)} 
                        className="text-sky-400 hover:text-sky-300 hover:underline flex items-center text-xs"
                        title={`Download ${n.fileName}`}
                      >
                        <DocumentDownloadIcon className="w-4 h-4 mr-1"/> {n.fileName}
                      </button>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-300 max-w-xs truncate" title={n.remarks}>{n.remarks || 'N/A'}</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                    <button 
                      onClick={() => handleViewNotification(n)} 
                      className="text-sky-400 hover:text-sky-300 p-1 rounded hover:bg-sky-700/50" 
                      title="View Details"
                    >
                      <EyeIcon className="w-5 h-5" /> <span className="sr-only">View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
       {/* Simple modal placeholder - replace with a proper modal component if needed */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setSelectedNotification(null)}>
            <div className="bg-slate-700 p-6 rounded-lg shadow-xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <h4 className="text-xl font-semibold text-sky-300 mb-3">Notification Details</h4>
                <p className="text-sm text-slate-300"><strong className="text-slate-100">Date:</strong> {new Date(selectedNotification.date).toLocaleDateString()}</p>
                <p className="text-sm text-slate-300 mt-1"><strong className="text-slate-100">Notification:</strong> {selectedNotification.text}</p>
                <p className="text-sm text-slate-300 mt-1"><strong className="text-slate-100">File:</strong> {selectedNotification.fileName || 'N/A'}</p>
                <p className="text-sm text-slate-300 mt-1"><strong className="text-slate-100">Remarks:</strong> {selectedNotification.remarks || 'N/A'}</p>
                <button 
                    onClick={() => setSelectedNotification(null)} 
                    className="mt-4 py-2 px-4 bg-sky-600 text-white rounded hover:bg-sky-700"
                >
                    Close
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default TeacherNotificationPage;
