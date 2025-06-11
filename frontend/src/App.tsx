// src/App.tsx

import React, { type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/presentation/pages/auth/LoginPage";
import Register from "@/presentation/pages/auth/RegisterPage";
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

function RequireAuth({ children }: { children: ReactNode }) {
  const user = useUserStore((s) => s.user);
  if (!user) return <Navigate to={ROUTES.login} replace />;
  return <BaseLayout>{children}</BaseLayout>;
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.register} element={<Register />} />
        <Route
          path={ROUTES.dashboards}
          element={
            <RequireAuth>
                <DashboardListPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.dashboardDetail}
          element={
            <RequireAuth>
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
            <RequireAuth>
                <SourcesPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.addSource}
          element={
            <RequireAuth>
                <AddSourcePage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.widgets}
          element={
            <RequireAuth>
                <WidgetListPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.createWidget}
          element={
            <RequireAuth>
                <WidgetCreatePage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.roles}
          element={
            <RequireAuth>
                <RoleManagementPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.createRole}
          element={
            <RequireAuth>
                <RoleCreatePage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.users}
          element={
            <RequireAuth>
                <UserManagementPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.editWidget}
          element={
            <RequireAuth>
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
