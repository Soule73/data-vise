import type { CollapsibleProps } from "@type/dashboardTypes";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Collapsible({
  title,
  children,
  defaultOpen = false,
  className = "",
}: CollapsibleProps) {
  return (
    <Disclosure
      as="div"
      className={`p-6 ${className}`}
      defaultOpen={defaultOpen}
    >
      <DisclosureButton className="group flex w-full items-center cursor-pointer ">
        <ChevronRightIcon className="size-5 fill-gray-400 dark:fill-white/60 group-data-hover:fill-gray-500 dark:group-data-hover:fill-white/50 group-data-open:rotate-90 transition-transform" />
        <span className="text-sm/6 font-medium text-gray-800 dark:text-white group-data-hover:text-gray-600 dark:group-data-hover:text-white/80">
          {title}
        </span>
      </DisclosureButton>
      <DisclosurePanel className="mt-2 text-sm/5 text-gray-700 dark:text-white/70">
        {children}
      </DisclosurePanel>
    </Disclosure>
  );
}
