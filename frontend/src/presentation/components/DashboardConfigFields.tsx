import type { IntervalUnit } from "@/core/types/dashboard-model";
import SelectField from "./SelectField";
import Button from "./Button";
import InputField from "./InputField";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
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
  setAutoRefreshIntervalValue: (v: number | undefined) => void;
  autoRefreshIntervalUnit: IntervalUnit;
  setAutoRefreshIntervalUnit: (v: IntervalUnit) => void;
  timeRangeFrom: string | null;
  setTimeRangeFrom: (v: string | null) => void;
  timeRangeTo: string | null;
  setTimeRangeTo: (v: string | null) => void;
  onSave: () => void;
  saving?: boolean;
};

const DashboardConfigFields: React.FC<Props> = ({
  autoRefreshIntervalValue,
  setAutoRefreshIntervalValue,
  autoRefreshIntervalUnit,
  setAutoRefreshIntervalUnit,
  onSave,
  saving,
  timeRangeFrom,
  setTimeRangeFrom,
  timeRangeTo,
  setTimeRangeTo,
}) => (
  <Popover className="relative inline-block text-left mb-4">
    <PopoverButton
      as={Button}
      color="gray"
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Cog6ToothIcon className="w-5 h-5 mr-1" />
      Configurer
    </PopoverButton>
    <PopoverPanel
      anchor="bottom end"
      className="z-50 mt-2 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <span className="font-medium">Rafraîchissement automatique</span>
        {/* Plus de CheckboxField pour l'activation */}
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
              setAutoRefreshIntervalValue(val === "" ? undefined : Number(val));
            }}
          />
          <SelectField
            id="autoRefreshIntervalUnit"
            label=""
            options={INTERVAL_UNITS}
            value={autoRefreshIntervalUnit}
            onChange={(e) =>
              setAutoRefreshIntervalUnit(e.target.value as IntervalUnit)
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
      <div className="flex flex-col gap-2">
        <label className="font-medium">Plage temporelle</label>
        <div className="flex items-end gap-2">
          <InputField
            id="timeRangeFrom"
            type="datetime-local"
            label="De"
            className=" max-w-32 h-8"
            value={timeRangeFrom || ""}
            onChange={(e) => setTimeRangeFrom(e.target.value)}
          />
          <InputField
            id="timeRangeTo"
            type="datetime-local"
            label="À"
            className=" max-w-32 h-8"
            value={timeRangeTo || ""}
            onChange={(e) => setTimeRangeTo(e.target.value)}
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
      </div>
    </PopoverPanel>
  </Popover>
);

export default DashboardConfigFields;
