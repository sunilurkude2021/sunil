
import React, { useState } from 'react';
import { Admin, ManagerPage, TabItem, AdminNotification, InfoRequest } from '../types'; // Added ManagerPage, AdminNotification, InfoRequest
import CreateAdminForm from './CreateAdminForm';
import AdminList from './AdminList';
import Tabs from './Tabs'; // Import Tabs component
import NotificationPage from './admin/NotificationPage'; // Reuse admin's NotificationPage
import GetDataPage from './admin/GetDataPage'; // Reuse admin's GetDataPage
import { LogoutIcon, UserGroupIcon, BellIcon, UploadCloudIcon } from './icons/FeatureIcons'; // Added icons

interface ManagerDashboardProps {
  username: string;
  onLogout: () => void;
  admins: Admin[];
  onCreateAdmin: (newAdmin: Admin) => void;
  onDeleteAdmin: (adminUserId: string) => void;
  // Props for Notifications and Get Data
  adminNotifications: AdminNotification[];
  onAddAdminNotification: (newNotification: AdminNotification) => void;
  onDeleteAdminNotification: (notificationId: string) => void;
  infoRequests: InfoRequest[];
  onAddInfoRequest: (newRequest: InfoRequest) => void;
  onDeleteInfoRequest: (requestId: string) => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  username,
  onLogout,
  admins,
  onCreateAdmin,
  onDeleteAdmin,
  adminNotifications,
  onAddAdminNotification,
  onDeleteAdminNotification,
  infoRequests,
  onAddInfoRequest,
  onDeleteInfoRequest,
}) => {
  const [activeManagerPage, setActiveManagerPage] = useState<ManagerPage>(ManagerPage.Administrators);
  const [showCreateAdminForm, setShowCreateAdminForm] = useState(false);

  const MANAGER_TABS: TabItem[] = [
    { label: 'Manage Admins', value: ManagerPage.Administrators, icon: <UserGroupIcon className="w-5 h-5 mr-2" /> },
    { label: 'Notifications', value: ManagerPage.Notifications, icon: <BellIcon className="w-5 h-5 mr-2" /> },
    { label: 'Get Data', value: ManagerPage.GetData, icon: <UploadCloudIcon className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 no-print">
        <div>
          <h2 className="text-3xl font-semibold text-slate-100">Manager Dashboard</h2>
          <p className="text-slate-300">Welcome, Manager <span className="font-semibold text-sky-400">{username}</span>!</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 transition-colors"
          aria-label="Logout"
        >
          <LogoutIcon className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>

      <div className="no-print">
        <Tabs tabs={MANAGER_TABS} activeTab={activeManagerPage} onTabChange={(tab) => setActiveManagerPage(tab as ManagerPage)} />
      </div>
      

      <div className="mt-6 bg-slate-700 p-4 sm:p-6 rounded-lg shadow-md min-h-[300px]">
        {activeManagerPage === ManagerPage.Administrators && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-slate-100">Administrators</h3>
              <button
                onClick={() => setShowCreateAdminForm(!showCreateAdminForm)}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-700 focus:ring-sky-500 transition-colors"
              >
                {showCreateAdminForm ? 'Cancel' : 'Create New Admin'}
              </button>
            </div>
            
            {showCreateAdminForm && (
              <div className="mb-6 p-4 bg-slate-600 rounded-md">
                <CreateAdminForm onCreateAdmin={onCreateAdmin} />
              </div>
            )}
            <AdminList admins={admins} onDeleteAdmin={onDeleteAdmin} />
          </>
        )}

        {activeManagerPage === ManagerPage.Notifications && (
          <NotificationPage
            notifications={adminNotifications}
            onAddNotification={onAddAdminNotification}
            onDeleteNotification={onDeleteAdminNotification}
          />
        )}

        {activeManagerPage === ManagerPage.GetData && (
          <GetDataPage
            infoRequests={infoRequests}
            onAddInfoRequest={onAddInfoRequest}
            onDeleteInfoRequest={onDeleteInfoRequest}
          />
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;