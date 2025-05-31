import { useQuery } from '@tanstack/react-query';
import { getSources } from '@/services/datasource';
import { WIDGETS, type WidgetType } from '@/components/widgets';
import { useState } from 'react';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

export interface WidgetCreateSelectorResult {
  type: WidgetType;
  sourceId: string;
}

export default function WidgetCreateSelectorModal({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (result: WidgetCreateSelectorResult) => void }) {
  const { data: sources = [] } = useQuery({ queryKey: ['sources'], queryFn: getSources });
  const [type, setType] = useState<WidgetType>('bar');
  const [sourceId, setSourceId] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    if (!type || !sourceId) return setError('Type et source requis');
    onSelect({ type, sourceId });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouvelle visualisation" size="md" color="indigo" footer={null}>
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Type de visualisation</label>
          <select className="w-full border rounded p-2" value={type} onChange={e => setType(e.target.value as WidgetType)}>
            {Object.values(WIDGETS).map(w => (
              <option key={w.type} value={w.type}>{w.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Source de données</label>
          <select className="w-full border rounded p-2" value={sourceId} onChange={e => setSourceId(e.target.value)}>
            <option value="">Sélectionner une source</option>
            {sources.map((s: any) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="flex justify-end">
          <Button color="indigo" onClick={handleNext}>Configurer</Button>
        </div>
      </div>
    </Modal>
  );
}
