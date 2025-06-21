import React, { useState } from "react";
import Modal from "./Modal";
import SelectField from "./SelectField";
import Button from "./forms/Button";

interface ExportPDFModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (options: { orientation: "portrait" | "landscape" }) => void;
}

const ExportPDFModal: React.FC<ExportPDFModalProps> = ({
  open,
  onClose,
  onExport,
}) => {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "landscape"
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Exporter le dashboard en PDF"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <SelectField
            id="pdf-orientation"
            label="Orientation"
            value={orientation}
            onChange={(e: any) => setOrientation(e.target.value)}
            options={[
              { value: "landscape", label: "Paysage" },
              { value: "portrait", label: "Portrait" },
            ]}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button color="gray" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button
          color="indigo"
          variant="solid"
          onClick={() => onExport({ orientation })}
        >
          Exporter
        </Button>
      </div>
    </Modal>
  );
};

export default ExportPDFModal;
