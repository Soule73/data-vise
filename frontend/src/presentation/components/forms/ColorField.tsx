import type { ColorFieldProps } from "@type/formTypes";

export default function ColorField({
  label = "Couleur",
  value,
  onChange,
  name = "color",
  id = "color-input",
  disabled = false,
}: ColorFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      <input
        type="color"
        className="block w-full outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 transition-colors duration-300"
        id={id}
        name={name}
        value={value || "#2563eb"}
        onChange={(e) => onChange(e.target.value)}
        title="Choisissez votre couleur"
        disabled={disabled}
      />
    </div>
  );
}
