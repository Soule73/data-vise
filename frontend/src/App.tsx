import React, { useEffect, useState, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@pages/auth/LoginPage";
import Register from "@pages/auth/RegisterPage";
import SourcesPage from "@pages/datasource/SourceListPage";
import AddSourcePage from "@pages/datasource/AddSourcePage";
import EditSourcePage from "@pages/datasource/EditSourcePage";
import BaseLayout from "@components/layouts/BaseLayout";
import { useUserStore } from "@store/user";
import { ROUTES } from "@constants/routes";
import WidgetListPage from "@pages/widget/WidgetListPage";
import WidgetCreatePage from "@pages/widget/WidgetCreatePage";
import RoleManagementPage from "@pages/auth/RoleManagementPage";
import RoleCreatePage from "@pages/auth/RoleCreatePage";
import UserManagementPage from "@pages/auth/UserManagementPage";
import DashboardPage from "@pages/dashboard/DashboardPage";
import DashboardListPage from "@pages/dashboard/DashboardListPage";
import WidgetEditPage from "@pages/widget/WidgetEditPage";
import AppLoader from "@components/layouts/AppLoader";
import DashboardSharePage from "@pages/dashboard/DashboardSharePage";
import ErrorPage from "@components/layouts/ErrorPage";
import LandingPage from "@pages/LandingPage";
import DocumentationPage from "@pages/DocumentationPage";

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
      <ErrorPage
        code={403}
        title="Accès refusé"
        message="Vous n'avez pas les permissions nécessaires pour accéder à cette page."
      />
    );
  }
  return <BaseLayout>{children}</BaseLayout>;
}

const App: React.FC = () => {
  const user = useUserStore((s) => s.user);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      const currentUser = useUserStore.getState().user;
      const isDashboardShare = /^\/dashboard\/share\//.test(
        window.location.pathname
      );
      if (
        (currentUser === null || currentUser === undefined) &&
        window.location.pathname !== ROUTES.login &&
        window.location.pathname !== ROUTES.register &&
        !isDashboardShare
      ) {

        window.location.replace(ROUTES.login);

      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (
    (user === undefined || user === null || showLoader) &&
    window.location.pathname !== ROUTES.login &&
    window.location.pathname !== ROUTES.register &&
    !/^\/dashboard\/share\//.test(window.location.pathname)
  ) {
    return <AppLoader />;
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.home} element={<LandingPage />} />
        <Route path={ROUTES.docs} element={<DocumentationPage />} />
        <Route path={ROUTES.docsSection} element={<DocumentationPage />} />
        <Route path={ROUTES.docsPage} element={<DocumentationPage />} />
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.register} element={<Register />} />
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
          path={ROUTES.editSource}
          element={
            <RequireAuth permission="datasource:canUpdate">
              <EditSourcePage />
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
        <Route path={ROUTES.dashboardShare} element={<DashboardSharePage />} />
        {/* <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} /> */}
        <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
