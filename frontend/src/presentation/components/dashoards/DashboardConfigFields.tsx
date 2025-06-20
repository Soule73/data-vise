import type { IntervalUnit } from "@/core/types/dashboard-model";
import SelectField from "../SelectField";
import Button from "../forms/Button";
import InputField from "../forms/InputField";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Cog6ToothIcon,
  ClockIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import {
  formatUnitFr,
  formatShortDateTime,
  INTERVAL_UNITS,
} from "@/core/utils/timeUtils";

type Props = {
  autoRefreshIntervalValue: number | undefined;
  autoRefreshIntervalUnit: IntervalUnit | undefined;
  timeRangeFrom: string | null;
  timeRangeTo: string | null;
  relativeValue: number | undefined;
  relativeUnit: IntervalUnit | undefined;
  timeRangeMode: "absolute" | "relative";
  // Handlers centralisés
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
  onSave: () => void;
  saving?: boolean;
  onForceRefresh?: () => void;
};

const DashboardConfigFields: React.FC<Props> = ({
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
  onSave,
  saving,
  onForceRefresh,
}) => {
  // Tab state synchronisé avec timeRangeMode global
  const tab = timeRangeMode;

  // Texte dynamique pour le bouton Popover auto-refresh
  let autoRefreshLabel = "Activer l'auto-refresh";
  if (autoRefreshIntervalValue && autoRefreshIntervalValue > 0) {
    const unitLabel = formatUnitFr(
      autoRefreshIntervalUnit,
      autoRefreshIntervalValue
    );
    autoRefreshLabel = `Actualise toutes les ${autoRefreshIntervalValue} ${unitLabel}`;
  }

  // Texte dynamique pour le bouton Popover plage temporelle
  let timeRangeLabel = "Configurer la plage";
  if (timeRangeMode === "relative" && relativeValue && relativeUnit) {
    const unitLabel = formatUnitFr(relativeUnit, relativeValue);
    timeRangeLabel = `Il y a ${relativeValue} ${unitLabel}`;
  } else if (timeRangeMode === "absolute" && timeRangeFrom && timeRangeTo) {
    // Formatage court (date/heure)
    const from = new Date(timeRangeFrom);
    const to = new Date(timeRangeTo);
    timeRangeLabel = `du ${formatShortDateTime(from)} au ${formatShortDateTime(
      to
    )}`;
  }

  return (
    <div className="flex flex-wrap items-center mb-2 gap-2 md:gap-0">
      {/* Popover pour le refresh automatique */}
      <Popover className="relative inline-block text-left">
        <PopoverButton
          as={Button}
          color={"gray"}
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 !border-gray-200 dark:!border-gray-700 md:rounded-r-none `}
        >
          <Cog6ToothIcon className="w-5 h-5 mr-1" />
          {autoRefreshLabel}
        </PopoverButton>
        <PopoverPanel
          anchor="bottom end"
          className="z-50 mt-2 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <span className="font-medium">Rafraîchir tous les</span>
            <div className="flex items-end gap-2">
              <InputField
                id="autoRefreshIntervalValue"
                type="number"
                min={1}
                className=" max-w-28 h-8"
                value={autoRefreshIntervalValue ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleChangeAutoRefresh(
                    val === "" ? undefined : Number(val),
                    autoRefreshIntervalUnit
                  );
                }}
              />
              <SelectField
                id="autoRefreshIntervalUnit"
                options={INTERVAL_UNITS}
                value={autoRefreshIntervalUnit}
                onChange={(e) =>
                  handleChangeAutoRefresh(
                    autoRefreshIntervalValue,
                    e.target.value as IntervalUnit
                  )
                }
                className=" max-w-28 h-8"
                disabled={autoRefreshIntervalValue == null}
              />
              <Button
                type="button"
                color="indigo"
                variant="outline"
                size="sm"
                className=" !w-max !px-3 !h-8"
                onClick={onSave}
                disabled={saving}
              >
                Appliquer
              </Button>
            </div>
          </div>
        </PopoverPanel>
      </Popover>
      {/* Popover pour la plage temporelle */}
      <Popover className="relative inline-block text-left">
        <PopoverButton
          as={Button}
          color={"gray"}
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 !border-gray-200 dark:!border-gray-700 md:rounded-l-none md:rounded-r-none md:border-x-0 `}
        >
          <ClockIcon className="w-5 h-5 mr-1" />
          {timeRangeLabel}
        </PopoverButton>
        <PopoverPanel
          anchor="bottom end"
          className="z-50 mt-2 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4 min-w-[340px]"
        >
          <TabGroup
            selectedIndex={tab === "absolute" ? 0 : 1}
            onChange={(i) =>
              handleChangeTimeRangeMode(i === 0 ? "absolute" : "relative")
            }
          >
            <TabList className="flex gap-2 mb-2">
              <Tab
                className={({ selected }) =>
                  selected
                    ? "px-3 py-1 rounded bg-indigo-600 text-white"
                    : "px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                }
              >
                Absolue
              </Tab>
              <Tab
                className={({ selected }) =>
                  selected
                    ? "px-3 py-1 rounded bg-indigo-600 text-white"
                    : "px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                }
              >
                Relative
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="flex items-end gap-2">
                  <InputField
                    id="timeRangeFrom"
                    type="datetime-local"
                    label="De"
                    className=" max-w-32 h-8"
                    value={timeRangeFrom || ""}
                    onChange={(e) =>
                      handleChangeTimeRangeAbsolute(e.target.value, timeRangeTo)
                    }
                  />
                  <InputField
                    id="timeRangeTo"
                    type="datetime-local"
                    label="À"
                    className=" max-w-32 h-8"
                    value={timeRangeTo || ""}
                    onChange={(e) =>
                      handleChangeTimeRangeAbsolute(
                        timeRangeFrom,
                        e.target.value
                      )
                    }
                  />
                  <Button
                    size="sm"
                    className=" !w-max !px-3 !h-8"
                    variant="outline"
                    color="indigo"
                    onClick={onSave}
                    disabled={saving}
                  >
                    Appliquer
                  </Button>
                </div>
              </TabPanel>
              <TabPanel>
                <div className="flex items-end gap-2">
                  <InputField
                    id="relativeValue"
                    type="number"
                    min={1}
                    label="Derniers"
                    className=" max-w-24 h-8"
                    value={relativeValue ?? ""}
                    onChange={(e) =>
                      handleChangeTimeRangeRelative(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value),
                        relativeUnit
                      )
                    }
                  />
                  <SelectField
                    id="relativeUnit"
                    options={INTERVAL_UNITS}
                    value={relativeUnit}
                    onChange={(e) =>
                      handleChangeTimeRangeRelative(
                        relativeValue,
                        e.target.value as IntervalUnit
                      )
                    }
                    className=" max-w-28 h-8"
                  />
                  <Button
                    size="sm"
                    className=" !w-max !px-3 !h-8"
                    variant="outline"
                    color="indigo"
                    onClick={onSave}
                    disabled={saving || !relativeValue}
                  >
                    Appliquer
                  </Button>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </PopoverPanel>
      </Popover>
      {/* Bouton de refresh global */}
      {onForceRefresh && (
        <Button
          type="button"
          variant="outline"
          color="gray"
          size="sm"
          className={` flex items-center gap-2 w-max !border-gray-200 dark:!border-gray-700 md:rounded-l-none `}
          onClick={onForceRefresh}
          title="Rafraîchir toutes les sources de données"
        >
          <ArrowPathIcon className="w-5 h-5 mr-1" />
          Rafraîchir les données
        </Button>
      )}
    </div>
  );
};

export default DashboardConfigFields;
