/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Regroupe les permissions par modèle (avant le ':').
 */
export function groupPermissionsByModel(permissions: any[]): Record<string, any[]> {
  return (Array.isArray(permissions) ? permissions : []).reduce(
    (acc: Record<string, any[]>, perm: any) => {
      const [model] = perm.name.split(":");
      if (!acc[model]) acc[model] = [];
      acc[model].push(perm);
      return acc;
    },
    {}
  );
}

/**
 * Ajoute ou retire un élément d'un tableau (toggle).
 */
export function toggleArrayValue<T>(arr: T[], value: T): T[] {
  return arr.includes(value)
    ? arr.filter((v) => v !== value)
    : [...arr, value];
}
