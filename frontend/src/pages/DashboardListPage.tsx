import { useQuery } from "@tanstack/react-query";
import { fetchDashboards } from "@/services/dashboard";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import Table from "@/components/Table";
import { useDashboardStore } from "@/store/dashboard";
import { useEffect } from "react";

export default function DashboardListPage() {
  const setDashboardTitle = useDashboardStore((s) => s.setDashboardTitle);

  useEffect(() => {
    setDashboardTitle("dashboards", "Tableaux de bord");
  }, [setDashboardTitle]);

  const { data: dashboards = [], isLoading } = useQuery({
    queryKey: ["dashboards"],
    queryFn: fetchDashboards,
  });
  const navigate = useNavigate();

  const columns = [
    { key: "title", label: "Titre" },
    {
      key: "widgets",
      label: "Widgets",
      render: (row: any) => row.layout?.length || 0,
    },
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto py-8 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold ">Mes tableaux de bord</h1>
          <div>
            <Button
              color="indigo"
              className=" sm:px-8"
              onClick={() => navigate("/dashboards/create")}
            >
              Nouveau dashboard
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div>Chargement…</div>
        ) : dashboards.length === 0 ? (
          <div className="text-gray-400 text-center py-12">
            Aucun dashboard pour l’instant.
          </div>
        ) : (
          <Table
            columns={columns}
            data={dashboards}
            emptyMessage="Aucun dashboard."
            actionsColumn={{
              label: "",
              render: (row: any) => (
                <Button
                  color="gray"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dashboards/${row._id}`);
                  }}
                >
                  Ouvrir
                </Button>
              ),
            }}
          />
        )}
      </div>
    </>
  );
}
