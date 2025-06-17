// src/App.tsx

import React, { useEffect, useState, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/presentation/pages/auth/LoginPage";
// import Register from "@/presentation/pages/auth/RegisterPage";
import SourcesPage from "@/presentation/pages/SourceListPage";
import AddSourcePage from "@/presentation/pages/AddSourcePage";
import BaseLayout from "@/presentation/components/BaseLayout";
import { useUserStore } from "@/core/store/user";
import { ROUTES } from "@/core/constants/routes";
import WidgetListPage from "@/presentation/pages/WidgetListPage";
import WidgetCreatePage from "@/presentation/pages/WidgetCreatePage";
import RoleManagementPage from "@/presentation/pages/RoleManagementPage";
import RoleCreatePage from "@/presentation/pages/RoleCreatePage";
import UserManagementPage from "@/presentation/pages/UserManagementPage";
import DashboardPage from "@/presentation/pages/DashboardPage";
import DashboardListPage from "@/presentation/pages/DashboardListPage";
import WidgetEditPage from "@/presentation/pages/WidgetEditPage";
import AppLoader from "@/presentation/components/AppLoader";

function RequireAuth({
  children,
  permission,
}: {
  children: ReactNode;
  permission?: string;
}) {
  const user = useUserStore((s) => s.user);
  const hasPermission = useUserStore((s) => s.hasPermission);
  if (!user) return <Navigate to={ROUTES.login} replace />;
  if (permission && !hasPermission(permission)) {
    return (
      <div className="flex items-center justify-center h-full text-xl text-red-500">
        Accès refusé
      </div>
    );
  }
  return <BaseLayout>{children}</BaseLayout>;
}

const App: React.FC = () => {
  const user = useUserStore((s) => s.user);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Affiche le loader au moins 3 secondes
    const timer = setTimeout(() => setShowLoader(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Le loader ne s'affiche que sur les pages RequireAuth
  if (
    (user === undefined || user === null || showLoader) &&
    window.location.pathname !== ROUTES.login
  ) {
    return <AppLoader />;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.login} element={<Login />} />
        {/* <Route path={ROUTES.register} element={<Register />} /> */}
        <Route
          path={ROUTES.dashboards}
          element={
            <RequireAuth permission="dashboard:canView">
              <DashboardListPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.dashboardDetail}
          element={
            <RequireAuth permission="dashboard:canView">
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.dashboard}
          element={<Navigate to={ROUTES.dashboards} replace />}
        />
        <Route
          path={ROUTES.sources}
          element={
            <RequireAuth permission="datasource:canView">
              <SourcesPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.addSource}
          element={
            <RequireAuth permission="datasource:canCreate">
              <AddSourcePage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.widgets}
          element={
            <RequireAuth permission="widget:canView">
              <WidgetListPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.createWidget}
          element={
            <RequireAuth permission="widget:canCreate">
              <WidgetCreatePage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.roles}
          element={
            <RequireAuth permission="role:canView">
              <RoleManagementPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.createRole}
          element={
            <RequireAuth permission="role:canCreate">
              <RoleCreatePage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.users}
          element={
            <RequireAuth permission="user:canView">
              <UserManagementPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.editWidget}
          element={
            <RequireAuth permission="widget:canUpdate">
              <WidgetEditPage />
            </RequireAuth>
          }
        />
        <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
