// ======================================================
// 4. Form Fields & Composants UI
// ======================================================
export type TextSize = 'sm' | 'md' | 'lg';
export interface SelectFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  options: Option[];
  label?: string;
  error?: string;
  textSize?: TextSize;
}

export interface Option {
  value: string;
  label: string;
}

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  textSize?: TextSize;
}

export interface CheckboxFieldProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  name?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export interface ColorFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  color?: "indigo" | "red" | "green" | "gray";
  variant?: "solid" | "outline";
  loading?: boolean;
}
