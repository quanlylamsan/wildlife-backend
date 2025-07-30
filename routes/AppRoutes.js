import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import RegisterManageSub1Page from '../pages/RegisterManageSub1Page';
import RegisterManageSub2Page from '../pages/RegisterManageSub2Page';
import UserListPage from '../pages/UserListPage';
import PrivateRoute from '../components/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Các route yêu cầu đăng nhập */}
      <Route element={<PrivateRoute allowedRoles={['admin', 'manager', 'staff']} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register-manage/sub1" element={<RegisterManageSub1Page />} />
        <Route path="/register-manage/sub2" element={<RegisterManageSub2Page />} />
        <Route path="/users" element={<UserListPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
