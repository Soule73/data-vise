import DashboardGrid from "@components/dashoards/DashboardGrid";
import { useParams } from "react-router-dom";
import { useDashboardShare } from "@hooks/dashboard/useDashboardShare";
import BaseLayout from "@components/layouts/BaseLayout";
import ErrorPage from "@components/layouts/ErrorPage";

function EmptyDashboard() {
  return (
    <div className="text-gray-400 dark:text-gray-500 ext-center py-12 space-y-3">
      <h2>Aucun widget sur ce dashboard.</h2>
      <p>Ce dashboard partagé ne contient aucun widget à afficher.</p>
    </div>
  );
}

export default function DashboardSharePage() {
  const { shareId } = useParams<{ shareId: string }>();
  const { dashboard, sources, loading, error, errorCode } =
    useDashboardShare(shareId);

  if (loading) return <div className="p-8 text-center">Chargement…</div>;
  if (error) {
    return (
      <ErrorPage
        code={errorCode}
        title="Tableau de bord non trouvé"
        message={error}
      />
    );
  }
  if (!dashboard) return null;

  const layout = dashboard.layout || [];

  return (
    <BaseLayout hideSidebar={true} hideUserInfo={true}>
      {/* Grille ou placeholder */}
      <div className="flex flex-col md:flex-row space-y-4 justify-start items-start md:items-center md:justify-between mb-2"></div>
      {layout.length === 0 ? (
        <EmptyDashboard />
      ) : (
        <DashboardGrid
          layout={layout}
          sources={sources}
          editMode={false}
          hasUnsavedChanges={false}
          handleAddWidget={() => { }}
          timeRangeFrom={dashboard.timeRange?.from}
          timeRangeTo={dashboard.timeRange?.to}
          forceRefreshKey={0}
          shareId={shareId}
        />
      )}
    </BaseLayout>
  );
}
