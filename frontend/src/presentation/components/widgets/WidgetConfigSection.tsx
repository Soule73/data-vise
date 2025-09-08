import { PlusCircleIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

const WidgetConfigSection = ({
    title,
    children,
    canAdd = true,
    addButtonText = "Ajouter",
    onAdd,
}: {
    title: string;
    addButtonText?: string;
    canAdd?: boolean;
    children: ReactNode;
    onAdd: () => void;
}) => {
    return (
        <>

            <div className=" flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>

                {canAdd && <button
                    type="button"
                    onClick={onAdd}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                >
                    <PlusCircleIcon className="w-4 h-4" />
                    {addButtonText}
                </button>}
            </div>
            {children}
        </>
    );
}


export default WidgetConfigSection;