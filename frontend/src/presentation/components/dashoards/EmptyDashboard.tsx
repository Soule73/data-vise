export function EmptyDashboard() {
  return (
    <div className="text-gray-400 items-center h-full flex flex-col min-w-full justify-center dark:text-gray-500 ext-center py-12 space-y-3">
      <h2>Aucun widget sur ce dashboard.</h2>
      <p>
        Cliquez sur "Sauvegarder" après avoir donné un titre pour créer votre
        dashboard.
      </p>
    </div>
  );
}