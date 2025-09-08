import SourceForm from "@components/source/SourceForm";
import { useCreateDataSourceForm } from "@hooks/datasource/useCreateDataSourceForm";
import { useDashboardStore } from "@store/dashboard";
import { useEffect } from "react";
import { ROUTES } from "@constants/routes";

export default function AddSourcePage() {
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  const formProps = useCreateDataSourceForm();

  useEffect(() => {
    setBreadcrumb([
      { url: ROUTES.sources, label: "Sources" },
      { url: ROUTES.addSource, label: "Ajouter une source" },
    ]);
  }, [setBreadcrumb]);

  return (
    <div className="max-w-5xl mx-auto py-4 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Ajouter une source de données</h1>
      <SourceForm
        form={formProps.form}
        setFormField={formProps.setFormField}
        step={formProps.step}
        setStep={formProps.setStep}
        csvOrigin={formProps.csvOrigin}
        setCsvOrigin={formProps.setCsvOrigin}
        csvFile={formProps.csvFile}
        setCsvFile={formProps.setCsvFile}
        columns={formProps.columns}
        columnsLoading={formProps.columnsLoading}
        columnsError={formProps.columnsError}
        dataPreview={formProps.dataPreview}
        showModal={formProps.showModal}
        setShowModal={formProps.setShowModal}
        globalError={formProps.globalError}
        handleNext={formProps.handleNext}
        onSubmit={formProps.onSubmit}
        isEdit={false}
      />
    </div>
  );
}
