import DashboardGrid from "@/presentation/components/DashboardGrid";
import Button from "@/presentation/components/Button";
import WidgetSelectModal from "@/presentation/components/WidgetSelectModal";
import { useDashboard } from "@/core/hooks/useDashboard";
import { useEffect, useState } from "react";
import Modal from "@/presentation/components/Modal";
import InputField from "@/presentation/components/InputField";
import { useLocation } from "react-router-dom";
import { useDashboardStore } from "@/core/store/dashboard";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const {
    isLoading,
    sources,
    saving,
    selectOpen,
    setSelectOpen,
    layout,
    editMode,
    setEditMode,
    hasUnsavedChanges,
    handleAddWidget,
    handleSaveDashboard,
    handleSwapLayout,
    handleCreateDashboard,
    dashboard,
    setLocalTitle,
  } = useDashboard();

  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);

  const location = useLocation();
  const isCreate = location.pathname.includes("/dashboards/create");

  // Utilise directement dashboard et layout du hook
  const [titleModalOpen, setTitleModalOpen] = useState(false);
  const [pendingTitle, setPendingTitle] = useState("");
  useEffect(() => {
    // Met à jour le titre du breadcrumb uniquement si le dashboard est chargé et a un titre
    if (isCreate) {
      if (dashboard?.title) {
        setBreadcrumb([
          { url: "/dashboards", label: "Tableaux de bord" },
          {
            url: "/dashboards/create",
            label: dashboard?.title || "Nouveau dashboard",
          },
        ]);
      }
    } else if (dashboard && dashboard._id && dashboard.title) {
      setBreadcrumb([
        { url: "/dashboards", label: "Tableaux de bord" },
        { url: `/dashboards/${dashboard._id}`, label: dashboard.title },
      ]);
    }
  }, [isCreate, dashboard?._id, dashboard?.title, setBreadcrumb]);

  // Met à jour le titre du breadcrumb dès que l'ID change (titre temporaire)
  useEffect(() => {
    if (!isCreate && dashboard && dashboard._id) {
      setBreadcrumb([
        { url: "/dashboards", label: "Tableaux de bord" },
        {
          url: `/dashboards/${dashboard._id}`,
          label: dashboard.title || "Dashboard",
        },
      ]);
    } else if (isCreate) {
      setBreadcrumb([
        { url: "/dashboards", label: "Tableaux de bord" },
        {
          url: "/dashboards/create",
          label: dashboard?.title || "Nouveau dashboard",
        },
      ]);
    }
  }, [dashboard?._id, isCreate, setBreadcrumb]);

  // Met à jour le titre du breadcrumb dès que le titre réel arrive
  useEffect(() => {
    if (!isCreate && dashboard && dashboard._id && dashboard.title) {
      setBreadcrumb([
        { url: "/dashboards", label: "Tableaux de bord" },
        { url: `/dashboards/${dashboard._id}`, label: dashboard.title },
      ]);
    } else if (isCreate && dashboard?.title) {
      setBreadcrumb([
        { url: "/dashboards", label: "Tableaux de bord" },
        { url: "/dashboards/create", label: dashboard.title },
      ]);
    }
  }, [dashboard?.title, dashboard?._id, isCreate, setBreadcrumb]);

  // Gère le champ local de titre indépendamment du breadcrumb
  useEffect(() => {
    if (dashboard && dashboard.title) {
      setPendingTitle(dashboard.title);
    } else if (isCreate) {
      setPendingTitle(dashboard?.title || "");
    }
  }, [dashboard?._id, dashboard?.title, isCreate]);

  const handleSave = () => {
    setTitleModalOpen(true);
  };

  const handleConfirmSave = async () => {
    if (isCreate) {
      try {
        await handleCreateDashboard(pendingTitle);
        setTitleModalOpen(false);
      } catch (e) {}
      return;
    }
    await handleSaveDashboard({ title: pendingTitle });
    setEditMode(false);
    setTitleModalOpen(false);
  };

  return (
    <>
      <WidgetSelectModal
        open={selectOpen}
        onClose={() => setSelectOpen(false)}
        onSelect={handleAddWidget}
      />
      <Modal
        open={titleModalOpen}
        onClose={() => setTitleModalOpen(false)}
        title="Titre du dashboard"
      >
        <div className="space-y-4">
          <InputField
            label="Titre du dashboard"
            value={pendingTitle}
            onChange={(e) => {
              setPendingTitle(e.target.value);
              if (isCreate && setLocalTitle) setLocalTitle(e.target.value);
              if (isCreate && setBreadcrumb) {
                setBreadcrumb([
                  { url: "/dashboards", label: "Tableaux de bord" },
                  {
                    url: "/dashboards/create",
                    label: e.target.value || "Nouveau dashboard",
                  },
                ]);
              } else if (dashboard && dashboard._id && setBreadcrumb) {
                setBreadcrumb([
                  { url: "/dashboards", label: "Tableaux de bord" },
                  {
                    url: `/dashboards/${dashboard._id}`,
                    label: e.target.value || "Dashboard",
                  },
                ]);
              }
            }}
            required
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button
              color="gray"
              variant="outline"
              onClick={() => setTitleModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              color="green"
              onClick={handleConfirmSave}
              disabled={!pendingTitle.trim()}
            >
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>
      <div className="flex items-center justify-between mb-2">
        {editMode || isCreate ? (
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              to={"#"}
              about="Ajouter un widget"
              onClick={() => setSelectOpen(true)}
            >
              Ajouter un widget
            </Link>
            <Link
              to={"#"}
              about="Sauvegarder"
              className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              onClick={handleSave}
            >
              {saving ? "Sauvegarde…" : "Sauvegarder"}
            </Link>
            {editMode && !isCreate && (
              <Link
                about="Annuler"
                to={"#"}
                className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
                onClick={() => {
                  // Remettre le layout et le titre à l'état initial du backend
                  if (dashboard && dashboard.layout) {
                    handleSwapLayout(dashboard.layout);
                  }
                  if (dashboard && dashboard.title) {
                    setPendingTitle(dashboard.title);
                  }
                  setEditMode(false);
                }}
              >
                Annuler
              </Link>
            )}
          </div>
        ) : !isCreate ? (
          <div>
            <Link
              about="Modifier le dashboard"
              to={"#"}
              className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              onClick={() => setEditMode(true)}
            >
              Modifier
            </Link>
          </div>
        ) : null}
      </div>
      {isCreate ? (
        layout.length === 0 ? (
          <div className="text-gray-400 text-center py-12">
            Aucun widget sur ce dashboard.
            <br />
            Cliquez sur "Sauvegarder" après avoir donné un titre pour créer
            votre dashboard.
          </div>
        ) : (
          <DashboardGrid
            layout={layout}
            onSwapLayout={handleSwapLayout}
            sources={sources ?? []}
            editMode={true}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        )
      ) : isLoading ? (
        <div>Chargement…</div>
      ) : layout.length === 0 ? (
        <div className="text-gray-400 text-center py-12">
          Aucun widget sur ce dashboard.
          <br />
          Cliquez sur "Ajouter un widget" pour commencer.
        </div>
      ) : (
        <DashboardGrid
          layout={layout}
          onSwapLayout={editMode ? handleSwapLayout : undefined}
          sources={sources ?? []}
          editMode={editMode}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      )}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded shadow">
          Sauvegarde…
        </div>
      )}
    </>
  );
}
