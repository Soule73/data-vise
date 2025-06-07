import Button from '@/components/Button';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import { useSourcesPage } from '@/hooks/useSourcesPage';
import { useSources } from '@/hooks/useSources';
import { ROUTES } from '@/constants/routes';
import { EditSourceForm, DeleteSourceForm } from '@/components/source/SourceForms';

export default function SourcesPage() {
  const {
    modalOpen, setModalOpen, selectedSource, setSelectedSource, modalType, setModalType, navigate, deleteMutation, handleEditSuccess, handleEditError
  } = useSourcesPage();

  const { sources } = useSources();

  const columns = [
    {
      key: 'name',
      label: 'Nom',
      render: (row: any) => (
        <span className="font-medium text-gray-900 whitespace-nowrap dark:text-white">{row.name}</span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
    },
    {
      key: 'endpoint',
      label: 'Endpoint',
      render: (row: any) => (
        <span className="font-mono text-xs break-all">{row.endpoint}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row: any) => (
        <div className="flex gap-2">
          <Button size="sm" color="indigo" onClick={() => { setSelectedSource(row); setModalType('edit'); setModalOpen(true); }}>
            Modifier
          </Button>
          <Button size="sm" color="red" onClick={() => { setSelectedSource(row); setModalType('delete'); setModalOpen(true); }}>
            Supprimer
          </Button>
        </div>
      ),
      className: 'px-6 py-4 text-right',
    },
  ];

  return (
    <>
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold ">
                        Sources de données
                </h1>
            <div className="flex items-center gap-2">
                <Button color="indigo" size="lg" onClick={() => navigate(ROUTES.addSource)}>
                    Ajouter une source
                </Button>
            </div>
        </div>
        <div className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Mes sources</h2>
            <Table columns={columns} data={sources} emptyMessage="Aucune source enregistrée." />
        </div>
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedSource(null); }}
        title={modalType === 'delete' ? 'Supprimer la source' : 'Modifier la source'}
        size="sm"
        footer={null}
      >
        {modalType === 'delete' && selectedSource && (
          <DeleteSourceForm
            source={selectedSource}
            onDelete={() => selectedSource && deleteMutation.mutate(selectedSource._id)}
            onCancel={() => setModalOpen(false)}
            loading={deleteMutation.isPending}
          />
        )}
        {modalType === 'edit' && selectedSource && (
          <EditSourceForm
            source={selectedSource}
            onClose={() => { setModalOpen(false); setSelectedSource(null); }}
            afterEdit={handleEditSuccess}
            onError={handleEditError}
          />
        )}
      </Modal>
    </>
  );
}
