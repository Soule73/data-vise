import Button from "@components/forms/Button";
import type { DataSource } from "@type/dataSource";

export function DeleteSourceForm({
  source,
  onDelete,
  onCancel,
  loading,
}: {
  source: DataSource;
  onDelete: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div>
      <p className="text-gray-700 dark:text-gray-200 mb-4">
        Voulez-vous vraiment supprimer la source{" "}
        <span className="font-semibold">{source.name}</span> ? Cette action est
        irréversible.
      </p>
      <div className="flex gap-2  justify-baseline">
        <Button color="gray" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button color="red" onClick={onDelete} loading={loading}>
          Suppression
        </Button>
      </div>
    </div>
  );
}
