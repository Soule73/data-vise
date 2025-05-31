import { CheckIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  name?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
  name,
  id,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={["inline-flex items-center p-2", className].filter(Boolean).join(' ')}>
      <label className="flex items-center cursor-pointer relative">
        <input
                    id={id}
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={e => onChange(e.target.checked)}
                    disabled={disabled}
         className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-indigo-800 checked:border-indigo-800"  />

        <CheckIcon className="h-5 w-5 text-white absolute left-0 top-0 opacity-0 peer-checked:opacity-100 transition-opacity duration-200 p-[2px]"
        strokeWidth={3}
        />
      </label>
      <span className="select-none text-sm font-medium text-gray-900 dark:text-gray-300 ml-2">{label}</span>
    </div> 
  );
};

export default CheckboxField;
