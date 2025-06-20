import type { WidgetConfigFooterProps } from "@/core/types/widget-types";
import Button from "@/presentation/components/forms/Button";

export default function WidgetConfigFooter({
  step,
  loading,
  onPrev,
  onNext,
  onSave,
  isSaving,
}: WidgetConfigFooterProps) {
  return (
    <div className="flex justify-end px-5 gap-2 sticky bottom-0 py-2 z-30 ">
      {step === 1 ? (
        <Button
          color="indigo"
          className=" w-max px-10"
          onClick={onNext}
          loading={loading}
        >
          Suivant
        </Button>
      ) : (
        <>
          <Button className=" w-max px-10" color="gray" onClick={onPrev}>
            Retour
          </Button>
          <Button
            className=" w-max px-10"
            color="indigo"
            onClick={onSave}
            loading={isSaving}
          >
            Enregistrer
          </Button>
        </>
      )}
    </div>
  );
}
