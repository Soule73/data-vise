import React from "react";
import DashboardSharePopover from "@components/dashoards/DashboardSharePopover";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Button from "@components/forms/Button";
import type { DashboardHeaderProps } from "@type/dashboardTypes";

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  editMode,
  isCreate,
  hasPermission,
  openAddWidgetModal,
  handleSave,
  handleCancelEdit,
  setEditMode,
  saving,
  shareLoading,
  shareError,
  shareLink,
  isShareEnabled,
  currentShareId,
  handleEnableShare,
  handleDisableShare,
  handleCopyShareLink,
  handleExportPDF,
  children,
}) => {
  const canUpdateDashboard = hasPermission("dashboard:canUpdate");

  const canCreateWidget = hasPermission("widget:canCreate");

  const renderEditActions = () => (
    <div className="hidden md:flex items-center gap-4">
      {canCreateWidget && (
        <Button
          color="indigo"
          size="sm"
          variant="outline"
          className="!border-none !min-w-max"
          onClick={openAddWidgetModal}
        >
          Ajouter un widget
        </Button>
      )}
      {canUpdateDashboard && (
        <Button
          color="indigo"
          size="sm"
          variant="solid"
          className="!border-none !min-w-max"
          onClick={(e) => {
            e.preventDefault();
            handleSave();

          }}
        >
          {saving ? "Sauvegarde…" : "Sauvegarder"}
        </Button>
      )}
      {editMode && !isCreate && canUpdateDashboard && (
        <Button
          variant="outline"
          color="gray"
          size="sm"
          className="!border-none !min-w-max"
          onClick={(e) => {
            e.preventDefault();
            handleCancelEdit();
          }}
        >
          Annuler
        </Button>
      )}
    </div>
  );


  const renderViewActions = () => (
    <div className="flex items-center gap-4">
      {canUpdateDashboard && (
        <Button
          color="indigo"
          size="sm"
          variant="outline"
          className="!border-none !min-w-max"
          onClick={(e) => {
            e.preventDefault();
            setEditMode(true);
          }}
        >
          Modifier
        </Button>
      )}

      {canUpdateDashboard && (
        <DashboardSharePopover
          isShareEnabled={isShareEnabled}
          shareLoading={shareLoading}
          shareError={shareError}
          shareLink={shareLink}
          currentShareId={currentShareId}
          handleEnableShare={handleEnableShare}
          handleDisableShare={handleDisableShare}
          handleCopyShareLink={handleCopyShareLink}
        />
      )}

      <Button
        variant="outline"
        size="sm"
        color="gray"
        className="!border-none !min-w-max"
        onClick={handleExportPDF}
      >
        <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
        Exporter PDF
      </Button>
    </div>
  );

  let actionGroup = null;

  if (editMode || isCreate) {
    actionGroup = renderEditActions();
  } else if (!isCreate) {
    actionGroup = renderViewActions();
  }

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 justify-between items-start md:items-center mb-2">
      {actionGroup}
      {children}
    </div>
  );
};

export default DashboardHeader;
