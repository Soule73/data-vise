import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, type ReactNode } from "react";

const CollapsibleSection = ({
    children,
    title,
    collapsible = true,
    canMoveUp = false,
    canMoveDown = false,
    onDelete = () => { },
    onMoveUp = () => { },
    onMoveDown = () => { },
    hideSettings = false,
    draggable = false,
    onDragStart = () => { },
    onDragOver = (e) => e.preventDefault(),
    onDrop = () => { }
}: {
    children: ReactNode;
    title: string;
    collapsible?: boolean;
    canMoveUp?: boolean;
    canMoveDown?: boolean;
    onDelete?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    hideSettings?: boolean;
    draggable?: boolean;
    onDragStart?: () => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: () => void;
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
        <div
            draggable={draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {collapsible && <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    <ChevronDownIcon className={`w-4 h-4 mr-1 inline-block transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                    {title}
                </span>}
                <div className="flex items-center gap-1">
                    {!hideSettings && (
                        <>
                            <button
                                className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${!canMoveUp ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (canMoveUp) onMoveUp();
                                }}
                                disabled={!canMoveUp}
                                title="Monter"
                            >
                                <ChevronUpIcon className="w-4 h-4" />
                            </button>
                            <button
                                className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${!canMoveDown ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (canMoveDown) onMoveDown();
                                }}
                                disabled={!canMoveDown}
                                title="Descendre"
                            >
                                <ChevronDownIcon className="w-4 h-4" />
                            </button>
                        </>
                    )}
                    {!hideSettings && (
                        <button
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            title="Supprimer"
                        >
                            <XMarkIcon className="w-5 h-5 text-red-500" />
                        </button>
                    )}
                </div>
            </div>

            {!isCollapsed && children}
        </div>
    );

}


export default CollapsibleSection;