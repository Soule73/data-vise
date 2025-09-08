import type { User } from "@type/authTypes";
import type { UseFormReturn } from "react-hook-form";
import type { InputFieldProps } from "@type/formTypes";
import type { TextareaHTMLAttributes } from "react";

export type BadgeColor = "gray" | "indigo" | "green" | "yellow";

export interface BadgeProps {
    color?: BadgeColor;
    children: React.ReactNode;
    className?: string;
}

export interface UserDeleteModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    userToDelete: User | null;
}

export interface UserModalFormProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    loading: boolean;
    editingUser: boolean;
    form: User;
    setForm: React.Dispatch<React.SetStateAction<User>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formHook: UseFormReturn<any>;
    showPassword: boolean;
    generatePassword: () => void;
    rolesList: { value: string; label: string }[];
    getErrorMsg: (err: unknown) => string | undefined;
}

export interface FileFieldProps
    extends Omit<InputFieldProps, "type" | "value" | "onChange"> {
    label?: string;
    error?: string;
    id?: string;
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
}

export interface RadioFieldProps {
    children: React.ReactNode;
    className?: string;
}

export interface TextareaFieldProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    className?: string;
    minRows?: number;
}

/**
 * Interface pour la gestion du drag & drop
 */
export interface DragDropHandlers {
    handleDragStart: (idx: number) => void;
    handleDragOver: (idx: number, e: React.DragEvent) => void;
    handleDrop: (idx: number) => void;
}

export interface TabConfig {
    key: string;
    label: string;
}


