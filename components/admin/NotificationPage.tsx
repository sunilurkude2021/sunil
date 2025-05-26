
import React, { useState, useRef } from 'react';
import { AdminNotification } from '../../types';
import { TrashIcon, FileArrowUpIcon, BellIcon as SendNotificationIcon } from '../icons/FeatureIcons';

interface NotificationPageProps {
  notifications: AdminNotification[];
  onAddNotification: (newNotification: AdminNotification) => void;
  onDeleteNotification: (notificationId: string) => void;
}

const NotificationPage: React.FC<NotificationPageProps> = ({ notifications, onAddNotification, onDeleteNotification }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [text, setText] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!date || !text) {
      setError('Date and Notification Text are required.');
      return;
    }

    const newNotification: AdminNotification = {
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      date,
      text,
      remarks,
      fileName: file?.name,
      uploadedAt: new Date().toISOString(),
    };

    try {
      onAddNotification(newNotification);
      setSuccess(`Notification created successfully.`);
      // Reset form
      setText('');
      setRemarks('');
      setFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.message || 'Failed to create notification.');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-100">Upload Notification</h3>
      
      {error && <div className="p-3 bg-red-700 border border-red-900 text-red-100 rounded-md text-sm my-2">{error}</div>}
      {success && <div className="p-3 bg-green-700 border border-green-900 text-green-100 rounded-md text-sm my-2">{success}</div>}

      <form onSubmit={handleSubmit} className="p-4 bg-slate-600 rounded-md space-y-4">
        <div>
          <label htmlFor="notificationDate" className="block text-sm font-medium text-slate-300">Date</label>
          <input type="date" id="notificationDate" value={date} onChange={e => setDate(e.target.value)} required
            className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-slate-400 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"/>
        </div>
        <div>
          <label htmlFor="notificationText" className="block text-sm font-medium text-slate-300">Notification Text (Short)</label>
          <input type="text" id="notificationText" value={text} onChange={e => setText(e.target.value)} required maxLength={150}
            className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-slate-400 rounded-md shadow-sm placeholder-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
            placeholder="Brief summary of the notification"/>
        </div>
        <div>
          <label htmlFor="notificationFile" className="block text-sm font-medium text-slate-300">Attach File (Optional)</label>
          <input type="file" id="notificationFile" ref={fileInputRef} onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"/>
        </div>
        <div>
          <label htmlFor="notificationRemarks" className="block text-sm font-medium text-slate-300">Remarks</label>
          <textarea id="notificationRemarks" value={remarks} onChange={e => setRemarks(e.target.value)} rows={3}
            className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-slate-400 rounded-md shadow-sm placeholder-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
            placeholder="Additional details or comments"></textarea>
        </div>
        <button type="submit"
          className="w-full md:w-auto flex items-center justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-600 focus:ring-sky-500 transition-colors">
          <SendNotificationIcon className="w-5 h-5 mr-2"/> Create Notification
        </button>
      </form>

      <h4 className="text-lg font-medium text-slate-100 mt-6 mb-3">Uploaded Notifications</h4>
      {notifications.length === 0 ? (
        <p className="text-slate-400 text-center py-4">No notifications uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto bg-slate-600 p-1 rounded-md shadow">
          <table className="min-w-full divide-y divide-slate-500">
            <thead className="bg-slate-500">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-100 sm:pl-6">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-100">Text</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-100">File</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-100">Remarks</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {notifications.map((n) => (
                <tr key={n.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-200 sm:pl-6">{new Date(n.date).toLocaleDateString()}</td>
                  <td className="px-3 py-4 text-sm text-slate-300 max-w-sm truncate" title={n.text}>{n.text}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-300">{n.fileName || 'N/A'}</td>
                  <td className="px-3 py-4 text-sm text-slate-300 max-w-xs truncate" title={n.remarks}>{n.remarks || 'N/A'}</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button onClick={() => onDeleteNotification(n.id)} className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-700" title="Delete Notification">
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

export default NotificationPage;
