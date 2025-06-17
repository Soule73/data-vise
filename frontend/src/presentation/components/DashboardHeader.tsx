// Déclaration locale du type IntervalUnit
export type IntervalUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

import DashboardConfigFields from "@/presentation/components/DashboardConfigFields";

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
  autoRefreshIntervalUnit: IntervalUnit;
  timeRangeFrom: string | null;
  timeRangeTo: string | null;
  relativeValue: number | undefined;
  relativeUnit: IntervalUnit;
  timeRangeMode: "absolute" | "relative";
  handleChangeAutoRefresh: (
    value: number | undefined,
    unit: IntervalUnit
  ) => void;
  handleChangeTimeRangeAbsolute: (
    from: string | null,
    to: string | null
  ) => void;
  handleChangeTimeRangeRelative: (
    value: number | undefined,
    unit: IntervalUnit
  ) => void;
  handleChangeTimeRangeMode: (mode: "absolute" | "relative") => void;
  savingConfig?: boolean;
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
        <div className="hidden md:block ">
          {hasPermission("dashboard:canUpdate") && (
            <a
              href="#"
              className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
              onClick={(e) => {
                e.preventDefault();
                setEditMode(true);
              }}
            >
              Modifier
            </a>
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
      />
    </div>
  );
};

export default DashboardHeader;
