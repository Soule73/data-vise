import Button from '@/components/Button';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import Notification, { type NotificationType } from '@/components/Notification';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSources, deleteSource } from '@/services/datasource';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useState } from 'react';
import { EditSourceForm, DeleteSourceForm } from '@/components/source/SourceForms';

export default function SourcesPage() {
  const { data: sources = [] } = useQuery({
    queryKey: ['sources'],
    queryFn: getSources,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [modalType, setModalType] = useState<'delete' | 'edit' | null>(null);
  const [notif, setNotif] = useState<{
    open: boolean;
    type: NotificationType;
    title: string;
    description?: string;
  }>({ open: false, type: 'default', title: '' });

  const handleEditSuccess = () => {
    setNotif({
      open: true,
      type: 'success',
      title: 'Source modifiée',
      description: 'La source a bien été modifiée.',
    });
    queryClient.invalidateQueries({ queryKey: ['sources'] });
  };

  const handleEditError = (message: string) => {
    setNotif({
      open: true,
      type: 'error',
      title: 'Erreur',
      description: message,
    });
  };

  const handleDeleteSuccess = () => {
    setNotif({
      open: true,
      type: 'success',
      title: 'Source supprimée',
      description: 'La source a bien été supprimée.',
    });
    queryClient.invalidateQueries({ queryKey: ['sources'] });
  };

  const handleDeleteError = (message: string) => {
    setNotif({
      open: true,
      type: 'error',
      title: 'Erreur',
      description: message,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSource(id),
    onSuccess: () => {
      setModalOpen(false);
      setSelectedSource(null);
      handleDeleteSuccess();
    },
    onError: (e: any) => {
      setModalOpen(false);
      setSelectedSource(null);
      handleDeleteError(e.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

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
        color={modalType === 'delete' ? 'red' : 'indigo'}
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
      <Notification
        open={notif.open}
        onClose={() => setNotif(n => ({ ...n, open: false }))}
        type={notif.type}
        title={notif.title}
        description={notif.description}
        duration={3500}
        position="bottom-right"
      />
    </>
  );
}
