import type { AuthLayoutProps } from "@/core/types/layout-types";

export default function AuthLayout({
  title,
  children,
  logoUrl,
  bottomText,
}: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="flex flex-col justify-center items-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-900 w-md mx-auto rounded-lg shadow">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {logoUrl && (
            <img
              className="mx-auto h-20 w-auto"
              src={logoUrl}
              alt="Logo Data-Vise"
            />
          )}
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight ">
            {title}
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {children}
          {bottomText && (
            <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
              {bottomText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
