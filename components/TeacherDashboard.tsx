
import React, { useState } from 'react';
import { Teacher, TeacherPage, MonthlyTeacherSalaryData, AdminNotification, InfoRequest, TeacherInfoResponse, TabItem, PayslipFieldMapping } from '../types';
import { LogoutIcon, HomeIcon, DocumentDownloadIcon, BellIcon as TeacherBellIcon, CloudUploadIconTeacher as TeacherUploadIcon, CurrencyDollarIcon, InboxInIcon } from './icons/FeatureIcons';
import Tabs from './Tabs';
import TeacherHomePage from './teacher/TeacherHomePage';
import TeacherPayslipPage from './teacher/TeacherPayslipPage';
import TeacherNotificationPage from './teacher/TeacherNotificationPage';
import TeacherUploadPage from './teacher/TeacherUploadPage';
import TeacherIncomeTaxPage from './teacher/TeacherIncomeTaxPage';
import TeacherMySubmissionsPage from './teacher/TeacherMySubmissionsPage';

interface TeacherDashboardProps {
  teacher: Teacher;
  onLogout: () => void;
  monthlySalaryDataList: MonthlyTeacherSalaryData[]; 
  payslipMappings: PayslipFieldMapping[]; 
  adminNotifications: AdminNotification[];
  infoRequests: InfoRequest[];
  teacherInfoResponses: TeacherInfoResponse[];
  onAddOrUpdateInfoResponse: (response: TeacherInfoResponse) => void;
  adminContactMobile: string;
  latestSalaryDataForCurrentTeacher?: MonthlyTeacherSalaryData | null; // Added prop
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = (props) => {
  const { teacher, onLogout, latestSalaryDataForCurrentTeacher } = props; // Destructure new prop
  const [activeTeacherPage, setActiveTeacherPage] = useState<TeacherPage>(TeacherPage.Home);

  const TEACHER_TABS: TabItem[] = [
    { label: 'Home', value: TeacherPage.Home, icon: <HomeIcon className="w-5 h-5 mr-2" /> },
    { label: 'Payslip', value: TeacherPage.PayslipDownload, icon: <DocumentDownloadIcon className="w-5 h-5 mr-2" /> },
    { label: 'Notifications', value: TeacherPage.Notifications, icon: <TeacherBellIcon className="w-5 h-5 mr-2" /> },
    { label: 'Upload Info', value: TeacherPage.UploadInfo, icon: <TeacherUploadIcon className="w-5 h-5 mr-2" /> },
    { label: 'My Submissions', value: TeacherPage.MySubmissions, icon: <InboxInIcon className="w-5 h-5 mr-2" /> },
    { label: 'Income Tax', value: TeacherPage.IncomeTax, icon: <CurrencyDollarIcon className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-slate-100">Teacher Dashboard</h2>
          <p className="text-slate-300">Welcome, <span className="font-semibold text-sky-400">{teacher.name}</span> (Shalarth ID: {teacher.shalarthId})</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 transition-colors no-print"
          aria-label="Logout"
        >
          <LogoutIcon className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>

      <div className="no-print">
        <Tabs tabs={TEACHER_TABS} activeTab={activeTeacherPage} onTabChange={(tab) => setActiveTeacherPage(tab as TeacherPage)} />
      </div>
      

      <div className={`mt-6 ${activeTeacherPage !== TeacherPage.PayslipDownload ? 'bg-slate-700 p-4 sm:p-6 rounded-lg shadow-md min-h-[300px]' : ''}`}>
        {activeTeacherPage === TeacherPage.Home && (
          <TeacherHomePage 
            teacher={props.teacher} 
            latestSalaryData={latestSalaryDataForCurrentTeacher} // Pass it here
          />
        )}
        {activeTeacherPage === TeacherPage.PayslipDownload && (
          <TeacherPayslipPage
            teacher={props.teacher} 
            monthlySalaryDataList={props.monthlySalaryDataList}
            payslipMappings={props.payslipMappings}
            adminContactMobile={props.adminContactMobile}
          />
        )}
        {activeTeacherPage === TeacherPage.Notifications && (
          <TeacherNotificationPage notifications={props.adminNotifications} />
        )}
        {activeTeacherPage === TeacherPage.UploadInfo && (
          <TeacherUploadPage
            infoRequests={props.infoRequests}
            existingResponses={props.teacherInfoResponses}
            onAddOrUpdateResponse={props.onAddOrUpdateInfoResponse}
            teacherShalarthId={props.teacher.shalarthId}
          />
        )}
         {activeTeacherPage === TeacherPage.MySubmissions && (
          <TeacherMySubmissionsPage
            infoRequests={props.infoRequests}
            teacherResponses={props.teacherInfoResponses}
          />
        )}
        {activeTeacherPage === TeacherPage.IncomeTax && <TeacherIncomeTaxPage />}
      </div>
    </div>
  );
};

export default TeacherDashboard;
