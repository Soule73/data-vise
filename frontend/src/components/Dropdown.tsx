import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface DropdownProps {
  open: boolean;
  onClose: () => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  menuClassName?: string;
  zIndex?: number;
}

export default function Dropdown({
  open,
  onClose,
  trigger,
  children,
  className = '',
  menuClassName = '',
  zIndex = 50,
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY,
        left: rect.right - 160 + window.scrollX, // 160 = largeur du menu
        width: rect.width,
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      // Vérifie si le clic est à l'extérieur du menu (dans le portail)
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  return (
    <div className={`relative inline-block ${className}`} ref={ref} style={{ zIndex }}>
      {trigger &&
        // Ajoute un wrapper pour forcer le style du trigger
        <div className="[&>button]:bg-white [&>button]:dark:bg-gray-900 [&>button]:text-gray-900 [&>button]:dark:text-gray-100 [&>button]:border [&>button]:border-gray-300 [&>button]:dark:border-gray-700 [&>button]:hover:bg-gray-100 [&>button]:dark:hover:bg-gray-800 rounded">
          {trigger}
        </div>
      }
      {open && menuPos && createPortal(
        <div
          ref={menuRef}
          className={`fixed w-40 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 ${menuClassName}`}
          style={{
            top: menuPos.top,
            left: menuPos.left,
            zIndex: zIndex + 100,
          }}
        >
          {children}
        </div>,
        document.body
      )}
    </div>
  );
}
