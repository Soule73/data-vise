// Un composant de sélection de couleur avec aperçu visuel

export interface ColorOption {
  value: string;
  label: string;
}

interface ColorSelectProps {
  options: ColorOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function ColorSelect({ options, value, onChange }: ColorSelectProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`flex items-center gap-2 px-2 py-1 rounded border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            value === opt.value ? 'border-indigo-600 ring-2 ring-indigo-400' : 'border-gray-300'
          }`}
          style={{ background: value === opt.value && opt.value ? opt.value + '22' : undefined }}
          onClick={() => onChange(opt.value)}
          aria-label={opt.label}
        >
          <span
            className="inline-block w-5 h-5 rounded-full border"
            style={{ background: opt.value || 'linear-gradient(45deg,#eee,#ccc)', borderColor: opt.value || '#ccc' }}
          />
          <span className="text-xs">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
