import React, { useState } from 'react';
import { LogoutIcon, DocumentTextIcon, BellIcon, UploadCloudIcon, UserGroupIcon, ShieldCheckIcon } from './icons/FeatureIcons';
import { AdminPage, Teacher, Paybill, AdminNotification, InfoRequest, TabItem, MonthlyTeacherSalaryData } from '../types'; // Added MonthlyTeacherSalaryData
import Tabs from './Tabs'; 
import PaybillPage from './admin/PaybillPage';
import NotificationPage from './admin/NotificationPage';
import GetDataPage from './admin/GetDataPage';
import CreateUsersPage from './admin/CreateUsersPage';
import TdsFilingPage from './admin/TdsFilingPage';

interface AdminDashboardProps {
  username: string;
  onLogout: () => void;
  teachers: Teacher[];
  onCreateTeachers: (newTeachers: Teacher[]) => void;
  onDeleteTeacher: (teacherId: string) => void;
  paybills: Paybill[]; // This is the list of master paybill records
  onProcessPaybillUpload: (
    paybillMeta: Omit<Paybill, 'id' | 'uploadedAt'>,
    parsedExcelData: { headers: string[]; rows: { shalarthId: string; dataRow: (string | number | null)[] }[] }
  ) => void; // Updated prop for handling processed Excel data
  onDeletePaybill: (paybillId: string) => void;
  adminNotifications: AdminNotification[];
  onAddAdminNotification: (newNotification: AdminNotification) => void;
  onDeleteAdminNotification: (notificationId: string) => void;
  infoRequests: InfoRequest[];
  onAddInfoRequest: (newRequest: InfoRequest) => void;
  onDeleteInfoRequest: (requestId: string) => void; 
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const { username, onLogout } = props;
  const [activeAdminPage, setActiveAdminPage] = useState<AdminPage>(AdminPage.Paybill);

  const ADMIN_TABS: TabItem[] = [
    { label: 'Paybill', value: AdminPage.Paybill, icon: <DocumentTextIcon className="w-5 h-5 mr-2" /> },
    { label: 'Notifications', value: AdminPage.Notifications, icon: <BellIcon className="w-5 h-5 mr-2" /> },
    { label: 'Get Data', value: AdminPage.GetData, icon: <UploadCloudIcon className="w-5 h-5 mr-2" /> },
    { label: 'Create Users', value: AdminPage.CreateUsers, icon: <UserGroupIcon className="w-5 h-5 mr-2" /> },
    { label: 'Easy TDS Filing', value: AdminPage.TDSFiling, icon: <ShieldCheckIcon className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-slate-100">Admin Dashboard</h2>
          <p className="text-slate-300">Welcome, Admin <span className="font-semibold text-sky-400">{username}</span>!</p>
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

      <Tabs tabs={ADMIN_TABS} activeTab={activeAdminPage} onTabChange={(tab) => setActiveAdminPage(tab as AdminPage)} />

      <div className="mt-6 bg-slate-700 p-4 sm:p-6 rounded-lg shadow-md min-h-[300px]">
        {activeAdminPage === AdminPage.Paybill && (
          <PaybillPage
            paybills={props.paybills} // List of master paybill files
            onProcessPaybillUpload={props.onProcessPaybillUpload} // New prop
            onDeletePaybill={props.onDeletePaybill}
          />
        )}
        {activeAdminPage === AdminPage.Notifications && (
          <NotificationPage
            notifications={props.adminNotifications}
            onAddNotification={props.onAddAdminNotification}
            onDeleteNotification={props.onDeleteAdminNotification}
          />
        )}
        {activeAdminPage === AdminPage.GetData && ( 
          <GetDataPage 
            infoRequests={props.infoRequests}
            onAddInfoRequest={props.onAddInfoRequest}
            onDeleteInfoRequest={props.onDeleteInfoRequest} 
          />
        )}
        {activeAdminPage === AdminPage.CreateUsers && (
          <CreateUsersPage
            teachers={props.teachers}
            onCreateTeachers={props.onCreateTeachers}
            onDeleteTeacher={props.onDeleteTeacher}
          />
        )}
        {activeAdminPage === AdminPage.TDSFiling && <TdsFilingPage />}
      </div>
    </div>
  );
};

export default AdminDashboard;