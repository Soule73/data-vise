import type { ColorFieldProps } from "@/core/types/form-types";

export default function ColorField({
  label = 'Couleur',
  value,
  onChange,
  name = 'color',
  id = 'color-input',
  disabled = false,
}: ColorFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="color"
        className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
        id={id}
        name={name}
        value={value || '#2563eb'}
        onChange={e => onChange(e.target.value)}
        title="Choisissez votre couleur"
        disabled={disabled}
      />
    </div>
  );
}
