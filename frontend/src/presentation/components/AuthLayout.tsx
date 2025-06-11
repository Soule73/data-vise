import type { AuthLayoutProps } from "@/core/types/ui";

export default function AuthLayout({ title, children, logoUrl, bottomText }: AuthLayoutProps) {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {logoUrl && (
          <img className="mx-auto h-10 w-auto" src={logoUrl} alt="Logo" />
        )}
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight ">{title}</h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {children}
        {bottomText && (
                  <p className="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
                      {bottomText}</p>
        )}
      </div>
    </div>
  );
}
