import { AdjustmentsVerticalIcon } from "@heroicons/react/24/outline";
import { EmptyConfigWidget } from "./EmptyConfigWidget";

export function InvalideConfigWidget() {
  return (
    <EmptyConfigWidget
      icon={
        <AdjustmentsVerticalIcon className="w-12 h-12 stroke-gray-300 dark:stroke-gray-700" />
      }
      message="Aucune configuration du widget"
      details="Assurez-vous que les métriques et le champ de groupement sont correctement configurés."
    />
  );
}

export default InvalideConfigWidget;
