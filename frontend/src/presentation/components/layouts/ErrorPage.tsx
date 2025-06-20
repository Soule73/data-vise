import { ROUTES } from "@/core/constants/routes";
import { Link } from "react-router-dom";
import ThemeDropdown from "../ThemeDropdown";

export default function ErrorPage({
  code,
  message,
  title,
}: {
  code?: number;
  message?: string;
  title?: string;
}) {
  return (
    <>
      <div className="hidden">
        <ThemeDropdown />
      </div>
      <main className="grid min-h-screen place-items-center  px-6 py-24 sm:py-32 lg:px-8  bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">{code}</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">
            {title}
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-gray-400">
            {message}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to={ROUTES.dashboard}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Retour au tableau de bord
            </Link>
            {/* <a href="#" className="text-sm font-semibold text-gray-900">Contact support <span aria-hidden="true">&rarr;</span></a> */}
          </div>
        </div>
      </main>
    </>
  );
}
