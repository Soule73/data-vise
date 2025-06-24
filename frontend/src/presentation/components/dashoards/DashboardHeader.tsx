// Déclaration locale du type IntervalUnit
export type IntervalUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

import DashboardConfigFields from "@/presentation/components/dashoards/DashboardConfigFields";
import DashboardSharePopover from "@/presentation/components/dashoards/DashboardSharePopover";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Button from "../forms/Button";
import type { DashboardHeaderProps } from "@/core/types/dashboard-types";

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  editMode,
  isCreate,
  hasPermission,
  openAddWidgetModal,
  handleSave,
  handleCancelEdit,
  setEditMode,
  saving,
  handleSaveConfig,
  autoRefreshIntervalValue,
  autoRefreshIntervalUnit,
  timeRangeFrom,
  timeRangeTo,
  relativeValue,
  relativeUnit,
  timeRangeMode,
  handleChangeAutoRefresh,
  handleChangeTimeRangeAbsolute,
  handleChangeTimeRangeRelative,
  handleChangeTimeRangeMode,
  savingConfig,
  onForceRefresh,
  shareLoading,
  shareError,
  shareLink,
  isShareEnabled,
  currentShareId,
  handleEnableShare,
  handleDisableShare,
  handleCopyShareLink,
  handleExportPDF,
}) => {
  return (
    <div className="flex flex-col md:flex-row space-y-4 justify-start items-start md:items-center md:justify-between mb-2">
      {editMode || isCreate ? (
        <div className="hidden md:flex items-center gap-2 md:gap-4">
          {hasPermission("widget:canCreate") && (
            <Button
              color="indigo"
              size="sm"
              variant="outline"
              title="Ajouter un widget"
              className=" w-max !border-none"
              onClick={openAddWidgetModal}
            >
              Ajouter un widget
            </Button>
          )}
          {hasPermission("dashboard:canUpdate") && (
            <Button
              color="indigo"
              size="sm"
              variant="solid"
              title="Sauvegarder le dashboard"
              className=" w-max"
              onClick={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {saving ? "Sauvegarde…" : "Sauvegarder"}
            </Button>
          )}
          {editMode && !isCreate && hasPermission("dashboard:canUpdate") && (
            <Button
              variant="outline"
              color="gray"
              size="sm"
              className=" w-max !border-none"
              title="Annuler les modifications"
              onClick={(e) => {
                e.preventDefault();
                handleCancelEdit();
              }}
            >
              Annuler
            </Button>
          )}
        </div>
      ) : !isCreate ? (
        <div className="flex items-center gap-2 md:gap-4">
          {hasPermission("dashboard:canUpdate") && (
            <Button
              color="indigo"
              size="sm"
              variant="outline"
              title="Modifier le dashboard"
              className=" w-max !border-none"
              onClick={(e) => {
                e.preventDefault();
                setEditMode(true);
              }}
            >
              Modifier
            </Button>
          )}
          {/* Bloc de partage public */}
          {!isCreate && hasPermission("dashboard:canUpdate") && (
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
          {/* Bouton d'export PDF */}
          <Button
            variant="outline"
            type="button"
            size="sm"
            color="gray"
            className="w-max !border-none"
            // className="flex items-center gap-1 text-xs text-indigo-600 hover:underline bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded px-2 py-1"
            onClick={handleExportPDF}
            title="Exporter le dashboard en PDF"
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-1" /> Exporter PDF
          </Button>
        </div>
      ) : null}
      {/* Bloc UI avancé de configuration déplacé dans DashboardConfigFields */}
      <DashboardConfigFields
        autoRefreshIntervalValue={autoRefreshIntervalValue}
        autoRefreshIntervalUnit={autoRefreshIntervalUnit}
        timeRangeFrom={timeRangeFrom}
        timeRangeTo={timeRangeTo}
        relativeValue={relativeValue}
        relativeUnit={relativeUnit}
        timeRangeMode={timeRangeMode}
        handleChangeAutoRefresh={handleChangeAutoRefresh}
        handleChangeTimeRangeAbsolute={handleChangeTimeRangeAbsolute}
        handleChangeTimeRangeRelative={handleChangeTimeRangeRelative}
        handleChangeTimeRangeMode={handleChangeTimeRangeMode}
        onSave={handleSaveConfig}
        saving={savingConfig}
        onForceRefresh={onForceRefresh}
      />
    </div>
  );
};

export default DashboardHeader;
