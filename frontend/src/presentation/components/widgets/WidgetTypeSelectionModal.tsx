import { useState } from "react";
import Modal from "@components/Modal";
import SelectField from "@components/SelectField";
import VisualizationTypeSelector from "@components/visualizations/VisualizationTypeSelector";
import Button from "@components/forms/Button";
import type { WidgetType, WidgetTypeSelectionModalProps } from "@type/widgetTypes";



export default function WidgetTypeSelectionModal({
    open,
    onClose,
    onConfirm,
    sources,
    loading = false,
}: WidgetTypeSelectionModalProps) {
    const [selectedSourceId, setSelectedSourceId] = useState("");
    const [selectedType, setSelectedType] = useState<WidgetType>("bar");
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);

    const handleConfirm = () => {
        if (!selectedSourceId) {
            setError("Veuillez sélectionner une source de données");
            return;
        }
        setError("");
        onConfirm(selectedSourceId, selectedType);
    };

    const handleClose = () => {
        setSelectedSourceId("");
        setSelectedType("bar");
        setError("");
        onClose();
    };

    const sourceOptions = [
        { value: "", label: "Sélectionner une source de données" },
        ...sources.map((source) => ({
            value: source._id || "",
            label: source.name,
        })),
    ];

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Créer une nouvelle visualisation"
            size="2xl"
            footer={
                step == 1 ?
                    (
                        <Button
                            color="indigo"
                            className="w-max"
                            onClick={() => {
                                if (!selectedSourceId) {
                                    setError("Veuillez sélectionner une source de données");
                                    return;
                                }
                                setError("");
                                setStep(2);
                            }}
                        >
                            Suivant
                        </Button>
                    )
                    :

                    (<div className="flex gap-3">

                        <Button
                            variant="outline"
                            className="w-max"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="outline"
                            className="w-max"
                            onClick={() => setStep(1)}
                        >
                            Précédent
                        </Button>
                        <Button
                            color="indigo"
                            onClick={handleConfirm}
                            disabled={loading || !selectedSourceId}
                        >
                            {loading ? "Création..." : "Créer"}
                        </Button>
                    </div>)
            }
        >
            <div className="space-y-6 !min-h-[70vh]">
                {error && (
                    <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
                        {error}
                    </div>
                )}

                {step == 1 && <div>
                    <SelectField
                        label="Source de données"
                        value={selectedSourceId}
                        onChange={(e) => {
                            setSelectedSourceId(e.target.value);
                            setError("");
                        }}
                        options={sourceOptions}
                        required
                    />
                </div>}

                {step == 2 && <div>
                    <VisualizationTypeSelector
                        type={selectedType}
                        setType={setSelectedType}
                    />
                </div>}
            </div>
        </Modal>
    );
}
