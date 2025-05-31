// src/App.tsx

import React, { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import SourcesPage from '@/pages/Sources';
import AddSourcePage from '@/pages/AddSource';
import BaseLayout from '@/components/BaseLayout';
import { useUserStore } from '@/store/user';
import { ROUTES } from '@/constants/routes';
import WidgetListPage from '@/pages/WidgetListPage';
import WidgetCreatePage from '@/pages/WidgetCreatePage';

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
        <Route path={ROUTES.dashboard} element={<RequireAuth><BaseLayout><Dashboard /></BaseLayout></RequireAuth>} />
        <Route path={ROUTES.sources} element={<RequireAuth><BaseLayout><SourcesPage /></BaseLayout></RequireAuth>} />
        <Route path={ROUTES.addSource} element={<RequireAuth><BaseLayout><AddSourcePage /></BaseLayout></RequireAuth>} />
        <Route path={ROUTES.widgets} element={<RequireAuth><BaseLayout><WidgetListPage /></BaseLayout></RequireAuth>} />
        <Route path={ROUTES.widgets + '/create'} element={<RequireAuth><BaseLayout><WidgetCreatePage /></BaseLayout></RequireAuth>} />
        <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
