import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ClipboardDocumentIcon, LinkIcon, EyeSlashIcon, EyeIcon, ShareIcon } from "@heroicons/react/24/outline";
import React from "react";

interface DashboardSharePopoverProps {
  isShareEnabled?: boolean;
  shareLoading?: boolean;
  shareError?: string | null;
  shareLink?: string | null;
  currentShareId?: string | null;
  handleEnableShare?: () => void;
  handleDisableShare?: () => void;
  handleCopyShareLink?: () => void;
}

const DashboardSharePopover: React.FC<DashboardSharePopoverProps> = ({
  isShareEnabled,
  shareLoading,
  shareError,
  shareLink,
  currentShareId,
  handleEnableShare,
  handleDisableShare,
  handleCopyShareLink,
}) => {
  return (
    <Popover className="relative">
      <PopoverButton
        className="flex cursor-pointer items-center gap-1 px-2 py-1 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        title="Partager le dashboard publiquement"
      >
        <ShareIcon className="w-5 h-5 text-indigo-500" />
        Partage
      </PopoverButton>
      <PopoverPanel
        anchor="right end"
        className="z-50 mt-2 !w-xs rounded-xl bg-white dark:bg-gray-900 p-4 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-3"
      >
        <span className="font-medium text-sm text-gray-700 dark:text-gray-200 mb-1">
            Partage le tableau de bord

        </span>
        {isShareEnabled ? (
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-semibold">
              <EyeIcon className="w-4 h-4" /> Activé
            </span>
            <div className="flex flex-wrap gap-2 items-center">
              <button
                className="text-xs cursor-pointer text-red-500 hover:underline"
                onClick={handleDisableShare}
                disabled={shareLoading}
              >
                Désactiver
              </button>
              <button
                className="flex cursor-pointer items-center gap-1 text-xs text-indigo-600 hover:underline"
                onClick={handleCopyShareLink}
                disabled={!currentShareId || shareLoading}
                title="Copier le lien public"
              >
                <ClipboardDocumentIcon className="w-4 h-4" /> Copier le lien
              </button>
              <a
                href={shareLink || (currentShareId ? `/dashboard/share/${currentShareId}` : undefined)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                <LinkIcon className="w-4 h-4" /> Voir le lien
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1 text-gray-400 text-xs font-semibold">
              <EyeSlashIcon className="w-4 h-4" /> Désactivé
            </span>
            <button
              className="text-xs text-green-600 hover:underline w-max"
              onClick={handleEnableShare}
              disabled={shareLoading}
            >
              Activer le partage
            </button>
          </div>
        )}
        {shareError && (
          <span className="text-xs text-red-500 mt-1">{shareError}</span>
        )}
        <div className="text-xs text-gray-500 mt-2">
          Toute personne disposant du lien peut consulter ce tableau de bord en lecture seule.</div>
      </PopoverPanel>
    </Popover>
  );
};

export default DashboardSharePopover;
