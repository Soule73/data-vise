import type { IntervalUnit } from "@/core/types/dashboard-model";
import SelectField from "./SelectField";
import Button from "./Button";
import InputField from "./InputField";
import { Popover, PopoverButton, PopoverPanel, Tab } from "@headlessui/react";
import { Cog6ToothIcon, ClockIcon } from "@heroicons/react/24/outline";
import React from "react";

const INTERVAL_UNITS: { label: string; value: IntervalUnit }[] = [
  { label: "Secondes", value: "second" },
  { label: "Minutes", value: "minute" },
  { label: "Heures", value: "hour" },
  { label: "Jours", value: "day" },
  { label: "Semaines", value: "week" },
  { label: "Mois", value: "month" },
  { label: "Années", value: "year" },
];

type Props = {
  autoRefreshIntervalValue: number | undefined;
  autoRefreshIntervalUnit: IntervalUnit;
  timeRangeFrom: string | null;
  timeRangeTo: string | null;
  relativeValue: number | undefined;
  relativeUnit: IntervalUnit;
  timeRangeMode: "absolute" | "relative";
  // Handlers centralisés
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
  onSave: () => void;
  saving?: boolean;
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
}) => {
  // Tab state synchronisé avec timeRangeMode global
  const tab = timeRangeMode;

  // Fonction utilitaire pour formater l'unité en français (singulier/pluriel)
  function formatUnitFr(unit: IntervalUnit, value: number): string {
    switch (unit) {
      case "second":
        return value > 1 ? "secondes" : "seconde";
      case "minute":
        return value > 1 ? "minutes" : "minute";
      case "hour":
        return value > 1 ? "heures" : "heure";
      case "day":
        return value > 1 ? "jours" : "jour";
      case "week":
        return value > 1 ? "semaines" : "semaine";
      case "month":
        return "mois";
      case "year":
        return value > 1 ? "années" : "année";
      default:
        return unit;
    }
  }

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
    const format = (d: Date) =>
      d.toLocaleString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    timeRangeLabel = `du ${format(from)} au ${format(to)}`;
  }

  return (
    <div className="flex gap-4">
      {/* Popover pour le refresh automatique */}
      <Popover className="relative inline-block text-left mb-4">
        <PopoverButton
          as={Button}
          color={
            autoRefreshIntervalValue && autoRefreshIntervalValue > 0
              ? "indigo"
              : "gray"
          }
          // variant={
          //   autoRefreshIntervalValue && autoRefreshIntervalValue > 0
          //     ? "solid"
          //     : "outline"
          // }
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${
            autoRefreshIntervalValue && autoRefreshIntervalValue > 0
              ? "ring-1 ring-indigo-400"
              : ""
          }`}
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
                label=""
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
                label=""
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
      <Popover className="relative inline-block text-left mb-4">
        <PopoverButton
          as={Button}
          color={
            timeRangeMode === "relative" && relativeValue && relativeUnit
              ? "indigo"
              : "gray"
          }
          // variant={
          //   timeRangeMode === "relative" && relativeValue && relativeUnit
          //     ? "solid"
          //     : "outline"
          // }
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${
            (timeRangeMode === "relative" && relativeValue && relativeUnit) ||
            (timeRangeMode === "absolute" && timeRangeFrom && timeRangeTo)
              ? "ring-1 ring-indigo-400"
              : ""
          }`}
        >
          <ClockIcon className="w-5 h-5 mr-1" />
          {timeRangeLabel}
        </PopoverButton>
        <PopoverPanel
          anchor="bottom end"
          className="z-50 mt-2 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4 min-w-[340px]"
        >
          <Tab.Group
            selectedIndex={tab === "absolute" ? 0 : 1}
            onChange={(i) =>
              handleChangeTimeRangeMode(i === 0 ? "absolute" : "relative")
            }
          >
            <Tab.List className="flex gap-2 mb-2">
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
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
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
              </Tab.Panel>
              <Tab.Panel>
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
                    label=""
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
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </PopoverPanel>
      </Popover>
    </div>
  );
};

export default DashboardConfigFields;
