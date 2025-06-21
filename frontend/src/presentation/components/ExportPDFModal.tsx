import React, { useState } from "react";
import Modal from "./Modal";

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
          <label className="block font-medium mb-1">Format du PDF</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="orientation"
                value="landscape"
                checked={orientation === "landscape"}
                onChange={() => setOrientation("landscape")}
                className="mr-2"
              />
              Paysage
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="orientation"
                value="portrait"
                checked={orientation === "portrait"}
                onChange={() => setOrientation("portrait")}
                className="mr-2"
              />
              Portrait
            </label>
          </div>
        </div>
        {/* Option future : choix du contenu à exporter */}
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
          onClick={onClose}
        >
          Annuler
        </button>
        <button
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => onExport({ orientation })}
        >
          Exporter
        </button>
      </div>
    </Modal>
  );
};

export default ExportPDFModal;
