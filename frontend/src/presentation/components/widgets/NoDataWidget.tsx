import { EmptyConfigWidget } from "@components/widgets/EmptyConfigWidget";

export default function NoDataWidget(
  { icon }: { icon: React.ReactNode }
) {
  return (
    <EmptyConfigWidget
      icon={icon}
      message="Aucune donnée disponible."
      details="Essayez de modifier les paramètres ou d'attendre que de nouvelles données soient disponibles." />
  );
}