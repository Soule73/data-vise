import React from "react";
import type { IntervalUnit } from "@type/dashboardTypes";
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

import SelectField from "@components/SelectField";
import InputField from "@components/forms/InputField";
import Button from "@components/forms/Button";

import {
  formatUnitFr,
  formatShortDateTime,
  INTERVAL_UNITS,
} from "@utils/timeUtils";

type Props = {
  autoRefreshIntervalValue?: number;
  autoRefreshIntervalUnit?: IntervalUnit;
  timeRangeFrom: string | null;
  timeRangeTo: string | null;
  relativeValue?: number;
  relativeUnit?: IntervalUnit;
  timeRangeMode: "absolute" | "relative";
  handleChangeAutoRefresh: (
    value?: number,
    unit?: IntervalUnit
  ) => void;
  handleChangeTimeRangeAbsolute: (
    from: string | null,
    to: string | null
  ) => void;
  handleChangeTimeRangeRelative: (
    value?: number,
    unit?: IntervalUnit
  ) => void;
  handleChangeTimeRangeMode: (
    mode: "absolute" | "relative"
  ) => void;
  onSave: () => void;
  saving?: boolean;
  onForceRefresh?: () => void;
};

const baseBtnClasses =
  "!w-max !px-3 !h-8 text-sm flex items-center gap-2";

export default function DashboardConfigFields({
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
}: Props) {
  // Labels
  const autoRefreshLabel = autoRefreshIntervalValue && autoRefreshIntervalUnit
    ? `Actualise toutes les ${autoRefreshIntervalValue} ${formatUnitFr(
      autoRefreshIntervalUnit,
      autoRefreshIntervalValue
    )}`
    : "Activer l'auto-refresh";

  const timeRangeLabel =
    timeRangeMode === "relative" && relativeValue && relativeUnit
      ? `Il y a ${relativeValue} ${formatUnitFr(
        relativeUnit,
        relativeValue
      )}`
      : timeRangeMode === "absolute" &&
        timeRangeFrom &&
        timeRangeTo
        ? `du ${formatShortDateTime(new Date(timeRangeFrom))} au ${formatShortDateTime(
          new Date(timeRangeTo)
        )}`
        : "Configurer la plage";

  // Auto-refresh panel
  const AutoRefreshPanel = (
    <div className="flex flex-col gap-2">
      <span className="font-medium">Rafraîchir tous les</span>
      <div className="flex items-end gap-2">
        <InputField
          id="autoRefreshIntervalValue"
          type="number"
          min={1}
          className="max-w-28 h-8"
          value={autoRefreshIntervalValue ?? ""}
          onChange={(e) =>
            handleChangeAutoRefresh(
              e.target.value === "" ? undefined : +e.target.value,
              autoRefreshIntervalUnit
            )
          }
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
          className="max-w-28 h-8"
          disabled={autoRefreshIntervalValue == null}
        />
        <Button
          type="button"
          color="indigo"
          variant="outline"
          size="sm"
          className={baseBtnClasses}
          onClick={onSave}
          disabled={saving}
        >
          Appliquer
        </Button>
      </div>
    </div>
  );

  // Time-range panel
  const TimeRangePanel = (
    <TabGroup
      selectedIndex={timeRangeMode === "absolute" ? 0 : 1}
      onChange={(i) =>
        handleChangeTimeRangeMode(i === 0 ? "absolute" : "relative")
      }
    >
      <TabList className="flex gap-2 mb-2">
        {["Absolue", "Relative"].map((label) => (
          <Tab
            key={label}
            className={({ selected }) =>
              `${selected
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              } px-3 py-1 rounded`
            }
          >
            {label}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        <TabPanel>
          <div className="flex items-end gap-2">
            <InputField
              id="timeRangeFrom"
              type="datetime-local"
              label="De"
              className="max-w-32 h-8"
              value={timeRangeFrom || ""}
              onChange={(e) =>
                handleChangeTimeRangeAbsolute(e.target.value, timeRangeTo)
              }
            />
            <InputField
              id="timeRangeTo"
              type="datetime-local"
              label="À"
              className="max-w-32 h-8"
              value={timeRangeTo || ""}
              onChange={(e) =>
                handleChangeTimeRangeAbsolute(timeRangeFrom, e.target.value)
              }
            />
            <Button
              size="sm"
              variant="outline"
              color="indigo"
              className={baseBtnClasses}
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
              className="max-w-24 h-8"
              value={relativeValue ?? ""}
              onChange={(e) =>
                handleChangeTimeRangeRelative(
                  e.target.value === "" ? undefined : +e.target.value,
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
              className="max-w-28 h-8"
            />
            <Button
              size="sm"
              variant="outline"
              color="indigo"
              className={baseBtnClasses}
              onClick={onSave}
              disabled={saving || !relativeValue}
            >
              Appliquer
            </Button>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );

  // Popover wrapper
  const renderPopover = (
    icon: React.ReactNode,
    label: string,
    panel: React.ReactNode,
    className?: string
  ) => (
    <Popover className="relative inline-block text-left" key={label}>
      <PopoverButton
        as={Button}
        color="gray"
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 !border-gray-200 dark:!border-gray-700 ${className}`}
      >
        {icon}
        {label}
      </PopoverButton>
      <PopoverPanel className="absolute top-full left-0 z-[150] mt-2 w-max min-w-80 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-xl border border-gray-200 dark:border-gray-700">
        {panel}
      </PopoverPanel>
    </Popover>
  );

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center mb-2 gap-2 md:gap-0">
      {renderPopover(<Cog6ToothIcon className="w-5 h-5" />, autoRefreshLabel, AutoRefreshPanel, " md:rounded-r-none")}
      {renderPopover(<ClockIcon className="w-5 h-5 " />, timeRangeLabel, TimeRangePanel, "md:rounded-none md:border-x-0")}

      {onForceRefresh && (
        <Button
          type="button"
          variant="outline"
          color="gray"
          size="sm"
          className="flex items-center gap-2 w-max !border-gray-200 dark:!border-gray-700 md:rounded-l-none"
          onClick={onForceRefresh}
          title="Rafraîchir toutes les sources de données"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Rafraîchir les données
        </Button>
      )}
    </div>
  );
}