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

interface DashboardHeaderProps {
  editMode: boolean;
  isCreate: boolean;
  hasPermission: (perm: string) => boolean;
  openAddWidgetModal: (e: React.MouseEvent) => void;
  handleSave: () => void;
  handleCancelEdit: () => void;
  setEditMode: (v: boolean) => void;
  saving: boolean;
  handleSaveConfig: () => void;
  autoRefreshIntervalValue: number | undefined;
  autoRefreshIntervalUnit: IntervalUnit | undefined;
  timeRangeFrom: string | null;
  timeRangeTo: string | null;
  relativeValue: number | undefined;
  relativeUnit: IntervalUnit | undefined;
  timeRangeMode: "absolute" | "relative";
  handleChangeAutoRefresh: (
    value: number | undefined,
    unit: IntervalUnit | undefined
  ) => void;
  handleChangeTimeRangeAbsolute: (
    from: string | null,
    to: string | null
  ) => void;
  handleChangeTimeRangeRelative: (
    value: number | undefined,
    unit: IntervalUnit | undefined
  ) => void;
  handleChangeTimeRangeMode: (mode: "absolute" | "relative") => void;
  savingConfig?: boolean;
  onForceRefresh?: () => void;
  // Ajout des props pour le partage public
  shareLoading?: boolean;
  shareError?: string | null;
  shareLink?: string | null;
  isShareEnabled?: boolean;
  currentShareId?: string | null;
  handleEnableShare?: () => void;
  handleDisableShare?: () => void;
  handleCopyShareLink?: () => void;
}

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
}) => {
  return (
    <div className="flex flex-col md:flex-row space-y-4 justify-start items-start md:items-center md:justify-between mb-2">
      {editMode || isCreate ? (
        <div className="hidden md:flex items-center gap-2 md:gap-4">
          {hasPermission("widget:canCreate") && (
            <a
              className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              href="#"
              onClick={openAddWidgetModal}
            >
              Ajouter un widget
            </a>
          )}
          {hasPermission("dashboard:canUpdate") && (
            <a
              href="#"
              className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              onClick={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {saving ? "Sauvegarde…" : "Sauvegarder"}
            </a>
          )}
          {editMode && !isCreate && hasPermission("dashboard:canUpdate") && (
            <a
              href="#"
              className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              onClick={(e) => {
                e.preventDefault();
                handleCancelEdit();
              }}
            >
              Annuler
            </a>
          )}
        </div>
      ) : !isCreate ? (
        <div className="flex items-center gap-2 md:gap-4">
          {hasPermission("dashboard:canUpdate") && (
            <a
              href="#"
              className="hidden md:block w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              onClick={(e) => {
                e.preventDefault();
                setEditMode(true);
              }}
            >
              Modifier
            </a>
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
