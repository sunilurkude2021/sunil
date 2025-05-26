
import React, { useState, useCallback, useEffect } from 'react';
import { UserRole, Admin, LoggedInUser, TabItem, Teacher, Paybill, AdminNotification, InfoRequest, AdminPage, TeacherPage, TeacherInfoResponse, MonthlyTeacherSalaryData, ManagerPage } from './types';
import { MANAGER_USER_ID, MANAGER_PASSWORD, APP_TITLE, ADMIN_CONTACT_MOBILE, DEFAULT_PAYSLIP_MAPPINGS } from './constants';
import Tabs from './components/Tabs';
import LoginForm from './components/LoginForm';
import ManagerDashboard from './components/ManagerDashboard';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ErrorModal from './components/ErrorModal'; // Import the new modal component
import { UserIcon, CogIcon, BuildingOfficeIcon } from './components/icons/FeatureIcons';

// Helper to convert month name to number for sorting
const monthNameToNumber = (monthName: string): number => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const index = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
  return index !== -1 ? index : 12; // Return 12 for unknown to sort them last
};


const App: React.FC = () => {
  const [activeLoginTab, setActiveLoginTab] = useState<UserRole>(UserRole.Teacher);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  
  const [paybills, setPaybills] = useState<Paybill[]>([]);
  const [monthlySalaryDataList, setMonthlySalaryDataList] = useState<MonthlyTeacherSalaryData[]>([]);
  const [latestSalaryDataForCurrentTeacher, setLatestSalaryDataForCurrentTeacher] = useState<MonthlyTeacherSalaryData | null>(null);


  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  const [infoRequests, setInfoRequests] = useState<InfoRequest[]>([]);
  const [teacherInfoResponses, setTeacherInfoResponses] = useState<TeacherInfoResponse[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    const initialAdmins = localStorage.getItem('admins');
    let adminList: Admin[] = initialAdmins ? JSON.parse(initialAdmins) : [];
    if (!adminList.some(admin => admin.userId === 'sample')) {
      adminList.push({
        userId: 'sample',
        password_do_not_store_plaintext_in_real_apps: 'sample',
        name: 'Sample Admin',
        email: 'sample.admin@example.com',
        mobile: '0123456789'
      });
    }
    setAdmins(adminList);
    
    const initialTeachers = localStorage.getItem('teachers');
    let teacherList: Teacher[] = initialTeachers ? JSON.parse(initialTeachers) : [];
     if (!teacherList.some(teacher => teacher.shalarthId === 'sample')) {
      teacherList.push({
        id: 'sample' + Date.now(),
        shalarthId: 'sample',
        password_do_not_store_plaintext_in_real_apps: 'sample',
        name: 'Sample Teacher',
        mobile: '9876543210',
        emailId: 'sample.teacher@example.com',
        bankDetails: 'Bank Sample - Acc #XXX9876',
        schoolDetails: 'ZP School Sampleville',
        gpfNo: `GPF/SAMP/123`,
        panNo: `SAMPP0000X`,
        pranNo: `11009876543`,
        adharNo: `XXXX XXXX 3210`,
        bankIfscCode: `BKID0009876`,
        branchName: `Sample Branch`,
        payMatrix: `Level 10 (S-15)`,
        schoolDdoCode: `DDOSAMPLE`,
        designation: "Assistant Teacher",
      });
    }

    setTeachers(teacherList.map(t => ({
        ...t,
        emailId: t.emailId || `${t.shalarthId?.toLowerCase().replace(/[^a-z0-9]/gi, '') || 'user'}@example.com`,
        bankDetails: t.bankDetails || `Bank XYZ - Acc #XXX${t.mobile?.slice(-4) || '0000'}`,
        schoolDetails: t.schoolDetails || `ZP School ${t.name?.split(' ')[0] || 'Defaultville'}`,
        gpfNo: t.gpfNo || `GPF/${t.shalarthId?.slice(0,3) || '000'}/123`,
        panNo: t.panNo || `ABCDE${t.mobile?.slice(0,4) || '0000'}X`,
        pranNo: t.pranNo || `1100${t.mobile?.slice(-7) || '0000000'}`,
        adharNo: t.adharNo || `XXXX XXXX ${t.mobile?.slice(2,6) || '0000'}`,
        bankIfscCode: t.bankIfscCode || `BKID000${t.mobile?.slice(-4) || '0000'}`,
        branchName: t.branchName || `${t.name?.split(' ')[0] || 'Default'} Branch`,
        payMatrix: t.payMatrix || `Level ${parseInt(t.mobile?.slice(-1) || '1') + 5} (S-${parseInt(t.mobile?.slice(-2,-1) || '1') +10 })`,
        schoolDdoCode: t.schoolDdoCode || `DDO${t.shalarthId?.slice(0,5) || '00000'}`,
        designation: t.designation || "Assistant Teacher",
    })));


    const storedPaybills = localStorage.getItem('paybills_master');
    if (storedPaybills) setPaybills(JSON.parse(storedPaybills));
    
    const storedMonthlySalaryData = localStorage.getItem('monthlySalaryDataList');
    if (storedMonthlySalaryData) setMonthlySalaryDataList(JSON.parse(storedMonthlySalaryData));

    const storedAdminNotifications = localStorage.getItem('adminNotifications');
    if (storedAdminNotifications) setAdminNotifications(JSON.parse(storedAdminNotifications));

    const storedInfoRequests = localStorage.getItem('infoRequests');
    if (storedInfoRequests) setInfoRequests(JSON.parse(storedInfoRequests));
    
    const storedTeacherInfoResponses = localStorage.getItem('teacherInfoResponses');
    if (storedTeacherInfoResponses) setTeacherInfoResponses(JSON.parse(storedTeacherInfoResponses));
  }, []);

  useEffect(() => { localStorage.setItem('admins', JSON.stringify(admins)); }, [admins]);
  useEffect(() => { localStorage.setItem('teachers', JSON.stringify(teachers)); }, [teachers]);
  useEffect(() => { localStorage.setItem('paybills_master', JSON.stringify(paybills)); }, [paybills]);
  useEffect(() => { localStorage.setItem('monthlySalaryDataList', JSON.stringify(monthlySalaryDataList)); }, [monthlySalaryDataList]);
  useEffect(() => { localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications)); }, [adminNotifications]);
  useEffect(() => { localStorage.setItem('infoRequests', JSON.stringify(infoRequests)); }, [infoRequests]);
  useEffect(() => { localStorage.setItem('teacherInfoResponses', JSON.stringify(teacherInfoResponses)); }, [teacherInfoResponses]);

  // Effect to update latestSalaryDataForCurrentTeacher
  useEffect(() => {
    if (loggedInUser?.role === UserRole.Teacher && monthlySalaryDataList.length > 0) {
      const teacherSpecificData = monthlySalaryDataList
        .filter(data => data.teacherShalarthId === loggedInUser.username)
        .sort((a, b) => {
          // Sort by year descending
          if (parseInt(b.year) !== parseInt(a.year)) {
            return parseInt(b.year) - parseInt(a.year);
          }
          // Sort by month descending
          return monthNameToNumber(b.month) - monthNameToNumber(a.month);
        });
      
      setLatestSalaryDataForCurrentTeacher(teacherSpecificData.length > 0 ? teacherSpecificData[0] : null);
    } else {
      setLatestSalaryDataForCurrentTeacher(null); // Clear if not teacher or no data
    }
  }, [loggedInUser, monthlySalaryDataList]);


  const handleLogin = useCallback((userId: string, pass: string, role: UserRole) => {
    setError(null);
    setIsErrorModalOpen(false);
    const genericErrorMessage = "Confirm your User ID and Password from Admin/Manager";

    if (role === UserRole.Manager) {
      if ((userId === MANAGER_USER_ID && pass === MANAGER_PASSWORD) || (userId === 'sample' && pass === 'sample')) {
        setLoggedInUser({ role: UserRole.Manager, username: userId });
      } else { 
        setError(genericErrorMessage);
        setIsErrorModalOpen(true);
      }
    } else if (role === UserRole.Admin) {
      const adminUser = admins.find(admin => admin.userId === userId && admin.password_do_not_store_plaintext_in_real_apps === pass);
      if (adminUser) { setLoggedInUser({ role: UserRole.Admin, username: userId }); } 
      else { 
        setError(genericErrorMessage);
        setIsErrorModalOpen(true);
      }
    } else if (role === UserRole.Teacher) {
      const teacherUser = teachers.find(teacher => teacher.shalarthId === userId && teacher.password_do_not_store_plaintext_in_real_apps === pass);
      if (teacherUser) { setLoggedInUser({ role: UserRole.Teacher, username: userId }); } 
      else { 
        setError(genericErrorMessage);
        setIsErrorModalOpen(true);
      }
    }
  }, [admins, teachers]);

  const handleLogout = useCallback(() => {
    setLoggedInUser(null);
    setError(null);
    setIsErrorModalOpen(false);
    setActiveLoginTab(UserRole.Teacher);
  }, []);

  const closeErrorModal = useCallback(() => {
    setIsErrorModalOpen(false);
    setError(null);
  }, []);

  const clearErrorFromChild = useCallback(() => {
    setError(null);
    setIsErrorModalOpen(false);
  }, []);


  const handleCreateAdmin = useCallback((newAdmin: Admin) => {
    if (admins.some(admin => admin.userId === newAdmin.userId)) {
      throw new Error(`Admin with User ID ${newAdmin.userId} already exists.`);
    }
    setAdmins(prevAdmins => [...prevAdmins, newAdmin]);
  }, [admins]);

  const handleDeleteAdmin = useCallback((adminUserId: string) => {
    setAdmins(prevAdmins => prevAdmins.filter(admin => admin.userId !== adminUserId));
  }, []);

  const handleCreateTeachers = useCallback((newTeachers: Teacher[]) => {
    setTeachers(prevTeachers => {
      const existingShalarthIds = new Set(prevTeachers.map(t => t.shalarthId));
      const uniqueNewTeachers = newTeachers.filter(nt => !existingShalarthIds.has(nt.shalarthId))
        .map(t => ({ 
            ...t,
            emailId: t.emailId || `${t.shalarthId?.toLowerCase().replace(/[^a-z0-9]/gi, '') || 'user'}@example.com`,
            bankDetails: t.bankDetails || `Bank XYZ - Acc #XXX${t.mobile?.slice(-4) || '0000'}`,
            schoolDetails: t.schoolDetails || `ZP School ${t.name?.split(' ')[0] || 'Defaultville'}`,
            gpfNo: t.gpfNo || `GPF/${t.shalarthId?.slice(0,3) || '000'}/123`,
            panNo: t.panNo || `ABCDE${t.mobile?.slice(0,4) || '0000'}X`,
            pranNo: t.pranNo || `1100${t.mobile?.slice(-7) || '0000000'}`,
            adharNo: t.adharNo || `XXXX XXXX ${t.mobile?.slice(2,6) || '0000'}`,
            bankIfscCode: t.bankIfscCode || `BKID000${t.mobile?.slice(-4) || '0000'}`,
            branchName: t.branchName || `${t.name?.split(' ')[0] || 'Default'} Branch`,
            payMatrix: t.payMatrix || `Level ${parseInt(t.mobile?.slice(-1) || '1') + 5} (S-${parseInt(t.mobile?.slice(-2,-1) || '1') +10 })`,
            schoolDdoCode: t.schoolDdoCode || `DDO${t.shalarthId?.slice(0,5) || '00000'}`,
            designation: t.designation || "Assistant Teacher",
        }));
      return [...prevTeachers, ...uniqueNewTeachers];
    });
  }, []);

  const handleDeleteTeacher = useCallback((teacherId: string) => {
    setTeachers(prevTeachers => prevTeachers.filter(teacher => teacher.id !== teacherId));
  }, []);

  const handleProcessPaybillUpload = useCallback((
    paybillMeta: Omit<Paybill, 'id' | 'uploadedAt'>,
    parsedExcelData: { headers: string[]; rows: { shalarthId: string; dataRow: (string | number | null)[] }[] }
  ) => {
    if (paybills.some(p => p.month === paybillMeta.month && p.year === paybillMeta.year)) {
      throw new Error(`A paybill master record for ${paybillMeta.month} ${paybillMeta.year} already exists. Delete it first if you want to re-upload.`);
    }
    if (monthlySalaryDataList.some(d => d.month === paybillMeta.month && d.year === paybillMeta.year)) {
        throw new Error(`Salary data for ${paybillMeta.month} ${paybillMeta.year} has already been processed. Delete the existing paybill to re-upload and re-process.`);
    }

    const newPaybillMaster: Paybill = {
      ...paybillMeta,
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      uploadedAt: new Date().toISOString(),
    };
    setPaybills(prev => [newPaybillMaster, ...prev].sort((a,b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));

    const newSalaryDataEntries: MonthlyTeacherSalaryData[] = parsedExcelData.rows.map(teacherRow => ({
      id: `${paybillMeta.year}-${paybillMeta.month}-${teacherRow.shalarthId}`,
      month: paybillMeta.month,
      year: paybillMeta.year,
      teacherShalarthId: teacherRow.shalarthId,
      rawHeaders: parsedExcelData.headers,
      rawDataRow: teacherRow.dataRow,
    }));
    
    setMonthlySalaryDataList(prev => [...prev, ...newSalaryDataEntries]);

  }, [paybills, monthlySalaryDataList]);

  const handleDeletePaybill = useCallback((paybillIdToDelete: string) => {
    const paybillToDelete = paybills.find(p => p.id === paybillIdToDelete);
    if (!paybillToDelete) return;

    setPaybills(prev => prev.filter(p => p.id !== paybillIdToDelete));
    setMonthlySalaryDataList(prev => 
      prev.filter(data => !(data.month === paybillToDelete.month && data.year === paybillToDelete.year))
    );
  }, [paybills]);

  const handleAddAdminNotification = useCallback((newNotification: AdminNotification) => {
    setAdminNotifications(prev => [newNotification, ...prev].sort((a,b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
  }, []);

  const handleDeleteAdminNotification = useCallback((notificationId: string) => {
    setAdminNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);
  
  const handleAddInfoRequest = useCallback((newRequest: InfoRequest) => {
    setInfoRequests(prev => [newRequest, ...prev].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const handleDeleteInfoRequest = useCallback((requestId: string) => {
    setInfoRequests(prev => prev.filter(req => req.id !== requestId));
    setTeacherInfoResponses(prevResponses => prevResponses.filter(res => res.requestId !== requestId));
  }, []);

  const handleAddOrUpdateTeacherInfoResponse = useCallback((response: TeacherInfoResponse) => {
    setTeacherInfoResponses(prevResponses => {
      const existingResponseIndex = prevResponses.findIndex(
        r => r.requestId === response.requestId && r.teacherShalarthId === response.teacherShalarthId
      );
      if (existingResponseIndex > -1) {
        const updatedResponses = [...prevResponses];
        updatedResponses[existingResponseIndex] = {
          ...response,
          lastUpdatedAt: new Date().toISOString(),
        };
        return updatedResponses;
      }
      return [...prevResponses, response];
    });
  }, []);

  const TABS: TabItem[] = [
    { label: 'Teacher Login', value: UserRole.Teacher, icon: <UserIcon className="w-5 h-5 mr-2" /> },
    { label: 'Admin Login', value: UserRole.Admin, icon: <CogIcon className="w-5 h-5 mr-2" /> },
    { label: 'Manager Login', value: UserRole.Manager, icon: <BuildingOfficeIcon className="w-5 h-5 mr-2" /> },
  ];
  
  const currentTeacherDetails = loggedInUser?.role === UserRole.Teacher 
    ? teachers.find(t => t.shalarthId === loggedInUser.username) 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-sky-500 selection:text-white">
      <header className="mb-8 text-center no-print">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">{APP_TITLE}</h1>
      </header>

      <main className={`w-full max-w-4xl bg-slate-800 shadow-2xl rounded-lg p-6 md:p-10 ${!loggedInUser ? 'no-print' : ''}`}>
        {!loggedInUser ? (
          <>
            <Tabs tabs={TABS} activeTab={activeLoginTab} onTabChange={setActiveLoginTab as (tab: UserRole | AdminPage | TeacherPage | ManagerPage) => void} />
            <div className="mt-6">
              <LoginForm
                key={activeLoginTab} 
                role={activeLoginTab}
                onLogin={handleLogin}
                error={null} // LoginForm no longer displays error directly
                clearError={clearErrorFromChild} // Pass down clearError
              />
            </div>
          </>
        ) : (
          <>
            {loggedInUser.role === UserRole.Manager && (
              <ManagerDashboard
                onLogout={handleLogout}
                admins={admins}
                onCreateAdmin={handleCreateAdmin}
                onDeleteAdmin={handleDeleteAdmin}
                username={loggedInUser.username}
                // Pass notification and info request props
                adminNotifications={adminNotifications}
                onAddAdminNotification={handleAddAdminNotification}
                onDeleteAdminNotification={handleDeleteAdminNotification}
                infoRequests={infoRequests}
                onAddInfoRequest={handleAddInfoRequest}
                onDeleteInfoRequest={handleDeleteInfoRequest}
              />
            )}
            {loggedInUser.role === UserRole.Admin && (
              <AdminDashboard
                username={loggedInUser.username}
                onLogout={handleLogout}
                teachers={teachers}
                onCreateTeachers={handleCreateTeachers}
                onDeleteTeacher={handleDeleteTeacher}
                paybills={paybills}
                onProcessPaybillUpload={handleProcessPaybillUpload}
                onDeletePaybill={handleDeletePaybill}
                adminNotifications={adminNotifications}
                onAddAdminNotification={handleAddAdminNotification}
                onDeleteAdminNotification={handleDeleteAdminNotification}
                infoRequests={infoRequests}
                onAddInfoRequest={handleAddInfoRequest}
                onDeleteInfoRequest={handleDeleteInfoRequest}
              />
            )}
            {loggedInUser.role === UserRole.Teacher && currentTeacherDetails && (
              <TeacherDashboard
                teacher={currentTeacherDetails}
                onLogout={handleLogout}
                monthlySalaryDataList={monthlySalaryDataList.filter(d => d.teacherShalarthId === currentTeacherDetails.shalarthId)}
                payslipMappings={DEFAULT_PAYSLIP_MAPPINGS}
                adminNotifications={adminNotifications}
                infoRequests={infoRequests}
                teacherInfoResponses={teacherInfoResponses.filter(r => r.teacherShalarthId === currentTeacherDetails.shalarthId)}
                onAddOrUpdateInfoResponse={handleAddOrUpdateTeacherInfoResponse}
                adminContactMobile={ADMIN_CONTACT_MOBILE}
                // Pass latest salary data for profile
                latestSalaryDataForCurrentTeacher={latestSalaryDataForCurrentTeacher}
              />
            )}
          </>
        )}
      </main>
      {isErrorModalOpen && error && (
        <ErrorModal message={error} onClose={closeErrorModal} />
      )}
      <footer className="mt-8 text-center text-sm text-slate-400 no-print">
        <p>&copy; {new Date().getFullYear()} {APP_TITLE}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
