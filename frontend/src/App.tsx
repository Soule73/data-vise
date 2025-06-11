// src/App.tsx

import React, { type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SourcesPage from "@/pages/Sources";
import AddSourcePage from "@/pages/AddSource";
import BaseLayout from "@/components/BaseLayout";
import { useUserStore } from "@/store/user";
import { ROUTES } from "@/constants/routes";
import WidgetListPage from "@/pages/WidgetListPage";
import WidgetCreatePage from "@/pages/WidgetCreatePage";
import RoleManagementPage from "@/pages/RoleManagementPage";
import RoleCreatePage from "@/pages/RoleCreatePage";
import UserManagementPage from "@/pages/UserManagementPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardListPage from "@/pages/DashboardListPage";
import WidgetEditPage from "./pages/WidgetEditPage";

function RequireAuth({ children }: { children: ReactNode }) {
  const user = useUserStore((s) => s.user);
  if (!user) return <Navigate to={ROUTES.login} replace />;
  return <>{children}</>;
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
              <BaseLayout>
                <DashboardListPage />
              </BaseLayout>
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.dashboardDetail}
          element={
            <RequireAuth>
              <BaseLayout>
                <DashboardPage />
              </BaseLayout>
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
              <BaseLayout>
                <SourcesPage />
              </BaseLayout>
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.addSource}
          element={
            <RequireAuth>
              <BaseLayout>
                <AddSourcePage />
              </BaseLayout>
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.widgets}
          element={
            <RequireAuth>
              <BaseLayout>
                <WidgetListPage />
              </BaseLayout>
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.widgets + "/create"}
          element={
            <RequireAuth>
              <BaseLayout>
                <WidgetCreatePage />
              </BaseLayout>
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.roles}
          element={
            <RequireAuth>
              <BaseLayout>
                <RoleManagementPage />
              </BaseLayout>
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.roles + "/create"}
          element={
            <RequireAuth>
              <BaseLayout>
                <RoleCreatePage />
              </BaseLayout>
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.users}
          element={
            <RequireAuth>
              <BaseLayout>
                <UserManagementPage />
              </BaseLayout>
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.editWidget}
          element={
            <RequireAuth>
              <BaseLayout>
                <WidgetEditPage />
              </BaseLayout>
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
